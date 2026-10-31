"""Focused unit tests for request validation and email-safety helpers.

Run with: python -m unittest -v
Requires the packages listed in requirements.txt.
"""
import unittest
import uuid
from types import SimpleNamespace
from unittest.mock import patch

import server
from fastapi.testclient import TestClient
from pydantic import ValidationError
from pymongo.errors import ServerSelectionTimeoutError

from server import ChatRequest, ContactIn, _assert_safe_email, _contact_email_html, _parse_datetime


class RequestValidationTests(unittest.TestCase):
    def test_chat_request_normalizes_uuid_and_trims_message(self):
        session_id = str(uuid.uuid4()).upper()
        request = ChatRequest(session_id=session_id, message="  Tell me about projects  ")
        self.assertEqual(request.session_id, session_id.lower())
        self.assertEqual(request.message, "Tell me about projects")

    def test_chat_request_rejects_non_uuid_session(self):
        with self.assertRaises(ValidationError):
            ChatRequest(session_id="arbitrary-session-id", message="Hello")

    def test_chat_request_rejects_blank_message(self):
        with self.assertRaises(ValidationError):
            ChatRequest(session_id=str(uuid.uuid4()), message="   ")

    def test_contact_request_trims_required_fields(self):
        request = ContactIn(
            name="  Kishan Visitor  ", email=" visitor@example.com ",
            subject=" Opportunity ", message=" Hello there ", website="",
        )
        self.assertEqual(request.name, "Kishan Visitor")
        self.assertEqual(str(request.email), "visitor@example.com")
        self.assertEqual(request.subject, "Opportunity")
        self.assertEqual(request.message, "Hello there")

    def test_contact_request_rejects_blank_required_fields(self):
        with self.assertRaises(ValidationError):
            ContactIn(name="   ", email="visitor@example.com", subject="Role", message="Hi")


class EmailSafetyTests(unittest.TestCase):
    def test_generated_contact_html_escapes_untrusted_content(self):
        html = _contact_email_html({
            "name": "<script>alert(1)</script>",
            "email": "visitor@example.com",
            "subject": "<img src=x>",
            "message": "<b>not markup</b>",
        })
        self.assertNotIn("<script>", html)
        self.assertNotIn("<img src=x>", html)
        self.assertIn("&lt;script&gt;", html)
        _assert_safe_email("Contact: safe", html)

    def test_email_safety_rejects_non_https_assets(self):
        with self.assertRaises(ValueError):
            _assert_safe_email("Hello", '<img src="http://example.com/logo.png">')

    def test_parse_datetime_normalizes_naive_timestamp(self):
        parsed = _parse_datetime("2026-01-02T03:04:05")
        self.assertEqual(parsed.tzinfo, __import__("datetime").timezone.utc)


class DatabaseErrorTests(unittest.TestCase):
    def test_chat_history_can_be_cleared_for_a_session(self):
        session_id = str(uuid.uuid4())
        deleted_filter = {}

        class ChatCollection:
            async def delete_many(self, query):
                deleted_filter.update(query)
                return SimpleNamespace(deleted_count=4)

        with patch.object(server, "db", SimpleNamespace(chat_messages=ChatCollection())):
            response = TestClient(server.app).delete(
                f"/api/chat/history/{session_id}",
                headers={"Origin": "http://localhost:3000"},
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "cleared", "deleted": 4})
        self.assertEqual(deleted_filter, {"session_id": session_id})
        self.assertEqual(
            response.headers.get("access-control-allow-origin"),
            "http://localhost:3000",
        )

    def test_clear_chat_history_rejects_an_invalid_session_id(self):
        response = TestClient(server.app).delete("/api/chat/history/not-a-uuid")

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["detail"], "Invalid chat session ID")

    def test_chat_history_returns_cors_enabled_503_when_database_is_unavailable(self):
        class UnavailableChatCollection:
            def find(self, *args, **kwargs):
                raise ServerSelectionTimeoutError("database unavailable")

        original_db = server.db
        server.db = SimpleNamespace(chat_messages=UnavailableChatCollection())
        try:
            response = TestClient(server.app).get(
                f"/api/chat/history/{uuid.uuid4()}",
                headers={"Origin": "http://localhost:3000"},
            )
        finally:
            server.db = original_db

        self.assertEqual(response.status_code, 503)
        self.assertEqual(
            response.json()["detail"],
            "Database is temporarily unavailable. Check MongoDB connectivity and try again.",
        )
        self.assertEqual(
            response.headers.get("access-control-allow-origin"),
            "http://localhost:3000",
        )

    def test_chat_post_returns_cors_enabled_503_when_database_is_unavailable(self):
        class UnavailableChatCollection:
            async def count_documents(self, *args, **kwargs):
                raise ServerSelectionTimeoutError("database unavailable")

        with (
            patch.object(server, "db", SimpleNamespace(chat_messages=UnavailableChatCollection())),
            patch.object(server, "AI_PROVIDER", "openai"),
            patch.object(server, "AI_API_KEY", "test-key"),
        ):
            response = TestClient(server.app).post(
                "/api/chat",
                headers={"Origin": "http://localhost:3000"},
                json={"session_id": str(uuid.uuid4()), "message": "Test message"},
            )

        self.assertEqual(response.status_code, 503)
        self.assertEqual(
            response.json()["detail"],
            "Database is temporarily unavailable. Check MongoDB connectivity and try again.",
        )
        self.assertEqual(
            response.headers.get("access-control-allow-origin"),
            "http://localhost:3000",
        )


if __name__ == "__main__":
    unittest.main()

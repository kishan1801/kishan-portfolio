import unittest
from knowledge_base import retrieve_context


class PortfolioRetrievalTests(unittest.TestCase):
    def test_specific_project_query_retrieves_that_project(self):
        context, sources = retrieve_context("Explain the real-estate project")
        self.assertEqual(sources, ["Project - Habitat Digital"])
        self.assertIn("Socket.IO", context)
        self.assertIn("AWS S3", context)

    def test_broad_project_query_retrieves_featured_projects(self):
        _, sources = retrieve_context("Tell me about the projects")
        self.assertEqual(
            sources,
            ["Project - PayShop", "Project - Recipe App", "Project - Habitat Digital"],
        )

    def test_worldquant_research_is_separate_from_software_employment(self):
        context, sources = retrieve_context("What is WorldQuant BRAIN?")
        self.assertEqual(sources, ["Independent Research - WorldQuant BRAIN"])
        self.assertIn("separate from software-engineering employment", context)

    def test_contact_query_returns_public_contact_record(self):
        context, sources = retrieve_context("How do I contact Kishan?")
        self.assertEqual(sources, ["Contact and Resume"])
        self.assertIn("k.kishankg120@gmail.com", context)

    def test_rag_query_retrieves_the_ai_architecture(self):
        context, sources = retrieve_context("How does the RAG and AI chat work on this website?")
        self.assertEqual(sources, ["AI Assistant - Ask Kishan AI"])
        self.assertIn("BM25-style lexical ranker", context)
        self.assertIn("does not browse the web", context)

    def test_resume_alias_retrieves_resume_record(self):
        _, sources = retrieve_context("Where can I get Kishan's CV?")
        self.assertEqual(sources, ["Contact and Resume"])


if __name__ == "__main__":
    unittest.main()

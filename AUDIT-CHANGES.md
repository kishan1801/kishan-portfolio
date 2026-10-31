# Portfolio audit and changes

This file records changes made after reviewing the uploaded project. The original uploaded ZIP was not modified; this is the corrected copy.

## What changed

### Backend (`backend/server.py`)

- The `/api/health` endpoint now pings MongoDB. It returns HTTP 503 if the database is unavailable, so Render's health check reflects database readiness rather than only whether FastAPI started.
- Chat session IDs must be UUIDs, request text is trimmed, and blank chat/contact fields are rejected.
- A chat turn remains `pending` while the model streams. The user/assistant pair becomes `completed` together only after a non-empty response is fully generated and saved. Failed or disconnected turns are marked failed and excluded from subsequent context/history.
- Chat history is returned newest-first internally and then presented chronologically, with a bounded result count and no-store fetching from the frontend.
- Both chat and contact records use BSON datetime `created_at` and absolute `expires_at` fields. Startup migrates legacy timestamp formats and creates TTL indexes. Retention is configurable and defaults to seven days.
- Contact submissions are still written before notification delivery. Notification state, attempts, last error, provider ID, timestamps, and delivery-attempt ID are tracked in MongoDB.
- Temporary Resend/network failures get bounded retries. Permanent HTTP failures such as authorization/configuration errors are recorded without retry loops. Requests include a Resend idempotency key to reduce duplicate sends during retries.
- The admin API returns message IDs safely for UI actions, does not expose client IPs, and provides an authenticated retry endpoint. A stale `sending` status can be recovered after five minutes.
- Admin access rejects missing, short, or untouched example secrets; use a random `ADMIN_KEY` of at least 32 characters.
- Contact text is trimmed/validated and email markup is escaped before use.

### Frontend

- The admin screen shows notification status, attempt count, last attempt/error, and a retry action for messages that are not marked sent.
- API-origin values have trailing slashes normalized, preventing accidental `//api` URLs when a hosting environment variable includes a slash.
- Chat history uses `cache: "no-store"`; malformed/old browser session IDs are replaced with a UUID.

### Configuration and documentation

- Added `backend/.env.example` and `frontend/.env.example`.
- Updated the README and deployment checklist to match the Resend integration, current environment variable names, retention behavior, health check, security requirements, and failure-recovery flow.
- Updated `render.yaml` with the email, retention, and rate-limit settings.

## Validation performed here

- Python syntax compilation passed for the backend and tests.
- All 6 existing knowledge-base retrieval tests passed.
- All 8 new helper/validation tests passed using a lightweight Motor stub; this tests validation and pure helper logic, not a live MongoDB connection.
- All 21 frontend JavaScript/JSX source files passed a TypeScript parser syntax pass.
- `frontend/package.json` and `package-lock.json` parse as JSON; `render.yaml` parses as YAML.
- Checked for accidentally bundled `.env` files and common hard-coded API token patterns; only the two `.env.example` templates are present.

## Not verified in this environment

- `npm ci` could not complete because package-registry DNS/network access was unavailable, so a full `npm run build` was not verified here.
- Motor/PyMongo were not installed in this environment, so no live MongoDB startup/TTL/index test was possible.
- No private AI/Resend credentials were available, so real AI streaming, email delivery, provider error handling, and deployed CORS were not tested against live services.

## Important operational notes

- Set `MONGO_URL`, `AI_API_KEY`, `ADMIN_KEY`, `CORS_ORIGINS`, and `REACT_APP_BACKEND_URL` for your deployment. Do not put secrets in frontend variables.
- For production Resend delivery, configure `RESEND_API_KEY`, `OWNER_EMAIL`, and a sender on a domain/address verified in Resend. A Resend 403 due to sender/auth restrictions must be fixed in the Resend account; retries will not correct it.
- Persistent failure status is visible in `/admin` and backend logs. There is no separate out-of-band alert channel configured; adding one requires a separately configured monitoring/webhook destination.
- The chatbot's 30-message cap remains per UUID session. It is a usage guardrail, not a comprehensive anti-abuse system; a visitor can reset browser storage to create a new session.

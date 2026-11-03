# Deployment checklist — Cloudflare Pages + Render + MongoDB Atlas

This project is split into a static React frontend, a FastAPI API, and a managed MongoDB database. You can use the free `*.pages.dev` and `*.onrender.com` subdomains; a custom domain is optional.

## 0. Before deploying

- Run the frontend and backend locally and test chat, contact, project routes, theme, and resume download.
- Keep all `.env` files and secrets out of Git. Set secrets only in Render's environment settings.
- Verify public contact details, resume, links, and project descriptions.
- Generate a unique `ADMIN_KEY` with at least 32 random characters. Do not reuse an account password.

## 1. MongoDB Atlas

1. Create an Atlas cluster and a database user with a strong, unique password.
2. In Network Access, add an access rule appropriate for Render. If a broad outbound rule is necessary for a hobby deployment, use a strong database password and review the exposure trade-off.
3. Copy the connection URI from **Connect → Drivers**, replace the placeholders, and use database name `kishan_portfolio`.
4. Keep `MONGO_URL` on the backend only; never place it in `REACT_APP_*` variables.

## 2. Deploy the API to Render

1. Push the project to GitHub. Do not commit `.env`, API keys, or generated local environments.
2. In Render, choose **New → Blueprint** and select the repository. `render.yaml` sets `backend` as the service root, installs `requirements.txt`, starts Uvicorn, and uses `/api/health` as the health check.
3. Set the environment variables in Render:

   | Variable | Required value |
   |---|---|
   | `MONGO_URL` | Your private Atlas connection URI |
   | `DB_NAME` | `kishan_portfolio` |
   | `AI_API_KEY` | Your Google AI Studio key (backend secret) |
   | `AI_PROVIDER` | `gemini` |
   | `AI_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta/openai` |
   | `AI_MODEL` | `gemini-3.5-flash-lite`, unless you selected another available model |
   | `ADMIN_KEY` | A unique random secret at least 32 characters long |
   | `CORS_ORIGINS` | Exact Pages URL plus `http://localhost:3000` during development, comma-separated, no trailing slashes |
   | `OWNER_EMAIL` | `k.kishankg120@gmail.com` or the inbox you want to receive notifications |
   | `BREVO_API_KEY` | Optional; required for email notifications |
   | `BREVO_FROM_EMAIL` | Required for email delivery; use a sender verified in Brevo |
   | `EMAIL_REPLY_TO` | Optional reply-to address; can be left empty |
   | `CONTACT_RETENTION_DAYS` | `7` (default) |
   | `CHAT_RETENTION_DAYS` | `7` (default) |

4. Deploy and open `https://YOUR-API.onrender.com/api/health`. It should return `status: ok`, `database: reachable`, and whether AI is configured. A database outage causes health checks to return `503`.
5. Optional email setup: configure `BREVO_API_KEY` and a sender address verified in Brevo. A provider authorization or sender-verification error requires correcting the Brevo configuration; bounded retries will not fix it.

**Free-service caveat:** Render free services can sleep after inactivity and cold-start. Its local filesystem is ephemeral; MongoDB Atlas is used for messages and chat history. Check Render's current limits before deployment.

## 3. Deploy the frontend to Cloudflare Pages

1. Create a Pages project connected to the repository.
2. Set the project root to `frontend`, build command to `npm run build`, and output directory to `dist`.
3. Add `VITE_BACKEND_URL` with the API origin, for example `https://YOUR-API.onrender.com`. Do not append `/api` or a trailing slash.
4. Deploy. `frontend/public/_redirects` contains the single-page-app fallback for routes such as `/project/...`.
5. Add the deployed `https://YOUR-PROJECT.pages.dev` origin to `CORS_ORIGINS` in Render and redeploy the API if you did not include it before.

`VITE_*` values are embedded into public frontend assets at build time. Never put API keys, database URIs, or `ADMIN_KEY` in frontend environment variables.

## 4. CORS and optional custom domain

- Set `CORS_ORIGINS` to exact trusted origins, comma-separated, without paths or trailing slashes. Keep localhost only while you need local development.
- To use a custom domain, add it under Cloudflare Pages → Custom domains and follow Cloudflare's instructions. Add the final HTTPS origin to Render's `CORS_ORIGINS` and redeploy/restart the API.
- Do not trust a successful browser preflight alone; test actual chat/contact requests from the deployed site.

## 5. Final smoke test

- [ ] `GET /api/health` returns `200` and `database: reachable`.
- [ ] The browser's Network tab shows requests to your Render API, never `127.0.0.1` on the deployed site.
- [ ] Refresh the homepage and a `/project/...` URL directly.
- [ ] Ask the chatbot a project question; confirm SSE streaming, source labels, history reload, and the 30-message daily session limit.
- [ ] Submit a contact message; confirm it appears in `/admin` even when email is not configured.
- [ ] Configure Brevo with a verified sender and, only when authorized, confirm email delivery. Test a provider error and confirm the admin page shows status/attempt count and offers retry.
- [ ] Check that `/admin` requires `X-Admin-Key` via its UI and that `/api/admin/messages` rejects missing/wrong keys.
- [ ] Confirm no secret or connection string appears in health output or frontend build assets.

## 6. Operations and retention

- Temporary email/network failures get a small bounded retry sequence in the contact request. Permanent provider errors (such as invalid credentials or an unverified sender) are recorded for manual recovery in `/admin`; retry after fixing the Brevo configuration. There is no second out-of-band alert channel by default, so check `/admin` and Render logs for failed notifications.
- Contact submissions are stored before notification. The visitor-facing success message only says the email was sent if the backend confirms Brevo accepted it. The per-session chatbot limit is a usage guardrail rather than an anti-abuse guarantee because a visitor can create a new browser session.
- Contact messages and chat history expire after seven days by default. MongoDB TTL deletion is asynchronous, so expiry is not guaranteed at the exact second. Check `CONTACT_RETENTION_DAYS`/`CHAT_RETENTION_DAYS` before changing the policy.
- Failed/unfinished chat turns do not appear in history/context. Chat session IDs are random UUIDs stored in browser local storage; they act like bearer tokens, so clear browser storage on shared computers.

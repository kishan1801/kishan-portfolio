# Kishan Kumar — AI-ready portfolio

A React portfolio with motion design, project case studies, a streaming Ask Kishan AI chat, and a Python FastAPI backend. The assistant uses a small, auditable retrieval-augmented generation (RAG) pipeline: BM25-style lexical retrieval over curated portfolio facts, followed by a configurable language model.

## Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Framer Motion, Lucide icons
- **Backend:** Python 3.11+, FastAPI, Motor / MongoDB Atlas, HTTPX
- **AI:** Gemini through an OpenAI-compatible endpoint, or local Ollama for development
- **Contact notifications:** Resend (optional; contacts are saved to MongoDB first)
- **Deployment:** Cloudflare Pages + Render + MongoDB Atlas

## Run locally on Windows

### 1. Backend configuration

Create a MongoDB Atlas cluster or run MongoDB locally. In PowerShell, open `backend` and copy the example environment file:

```powershell
Copy-Item .env.example .env
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Edit `backend/.env`. Set `MONGO_URL`, `AI_API_KEY`, and a unique `ADMIN_KEY` of at least 32 characters. Email notifications are optional; configure `RESEND_API_KEY`, a Resend-verified `RESEND_FROM_EMAIL`, and `OWNER_EMAIL` to enable them. Never commit `.env` or put the AI/email keys in frontend variables.

Start the API:

```powershell
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Check `http://127.0.0.1:8000/api/health`. The readiness endpoint pings MongoDB and returns a service-unavailable status if the database cannot be reached.

### 2. Frontend configuration

In a second terminal, open `frontend`:

```powershell
Copy-Item .env.example .env
npm.cmd install
npm.cmd start
```

Open `http://localhost:3000`. `REACT_APP_BACKEND_URL` must be the backend origin only (for example, `http://127.0.0.1:8000`), not a URL ending in `/api`.

### 3. AI provider

Create a key in [Google AI Studio](https://aistudio.google.com/apikey) and set it as `AI_API_KEY` in `backend/.env`. Model access and free quota depend on Google's current policy and region. For local-only chat, install [Ollama](https://ollama.com/), download a model, and set `AI_PROVIDER=ollama`, `AI_MODEL=qwen2.5-coder:3b`, and `OLLAMA_BASE_URL=http://127.0.0.1:11434`. A public website cannot connect to Ollama running only on your laptop.

## Contact messages, email delivery, and retention

- Contact form submissions are saved to MongoDB before email is attempted. Visitor success means the message was saved; it does not imply the notification email was delivered.
- Temporary Resend/network failures are retried a bounded number of times (`EMAIL_RETRY_ATTEMPTS`, default 3), using Resend idempotency keys to reduce duplicate notifications. Failed/permanent notifications retain a status and safe error summary for admin recovery.
- Open `/admin`, enter the server-side `ADMIN_KEY`, and use **Retry email** on a failed/not-configured notification after fixing its configuration. Do not expose or commit that key. Persistent failures are visible in `/admin` and Render logs; no second alert channel is configured by default.
- Contact records and chat history automatically expire after seven days by default (`CONTACT_RETENTION_DAYS` and `CHAT_RETENTION_DAYS`). Set these values intentionally if you change the retention period. Existing records are migrated to BSON timestamps/expiry fields when the app starts.
- Chat requests that fail are marked failed and excluded from future assistant context/history. Only successful turns are included as conversation history. The session ID is a random UUID and should be treated as a bearer token.

## Deploy

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the Render, Cloudflare Pages, MongoDB Atlas, CORS, Resend, and final smoke-test checklist. `render.yaml` is a Blueprint starter for the API. The frontend includes a Pages SPA fallback for React Router routes.

## RAG notes

The assistant answers from curated records in `backend/knowledge_base.py`. It uses lightweight BM25-style lexical ranking rather than embeddings/vector search, and it does not browse the web or execute arbitrary tools. Add semantic retrieval only if test results justify the added complexity.

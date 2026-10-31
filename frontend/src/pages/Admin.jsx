import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Inbox, RefreshCw, CheckCircle2, AlertTriangle, Clock3 } from "lucide-react";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const API = `${BACKEND_URL}/api`;

const statusPresentation = (status) => {
  switch (status) {
    case "sent": return { label: "Email sent", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", Icon: CheckCircle2 };
    case "failed": return { label: "Email failed", className: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300", Icon: AlertTriangle };
    case "sending": return { label: "Sending", className: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300", Icon: Loader2 };
    case "pending": return { label: "Pending", className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", Icon: Clock3 };
    case "not_configured": return { label: "Not configured", className: "border-border bg-secondary text-muted-foreground", Icon: AlertTriangle };
    default: return { label: "Status unknown (legacy)", className: "border-border bg-secondary text-muted-foreground", Icon: AlertTriangle };
  }
};

const Admin = () => {
  const [key, setKey] = useState("");
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState("");

  const fetchMessages = async () => {
    const response = await fetch(`${API}/admin/messages`, {
      headers: { "X-Admin-Key": key },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(response.status === 401 ? "Invalid admin key" : (data.detail || `Request failed (${response.status})`));
    }
    return Array.isArray(data.messages) ? data.messages : [];
  };

  const load = async () => {
    if (!key.trim() || loading) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      setMessages(await fetchMessages());
    } catch (e) {
      setMessages(null);
      setError(e instanceof Error ? e.message : "Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  const retryNotification = async (message) => {
    if (!key.trim() || retryingId) return;
    setRetryingId(message.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API}/admin/messages/${encodeURIComponent(message.id)}/retry`, {
        method: "POST",
        headers: { "X-Admin-Key": key },
      });
      const data = await response.json().catch(() => ({}));
      // Refresh the list even when a provider rejects the retry, so the latest status is visible.
      try { setMessages(await fetchMessages()); } catch { /* keep the original retry error */ }
      if (!response.ok) throw new Error(data.detail || `Retry failed (${response.status})`);
      setNotice(`Email notification sent for “${message.subject}”.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not retry notification");
    } finally {
      setRetryingId("");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} /> Back to portfolio
        </Link>
        <h1 className="mb-2 font-display text-3xl font-bold">Contact messages</h1>
        <p className="mb-8 text-sm text-muted-foreground">Enter your configured admin key to read contact submissions and retry failed email notifications. The key is used only for requests from this page.</p>
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            autoComplete="current-password"
            placeholder="Admin key"
            aria-label="Admin key"
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm focus:outline-none"
          />
          <button type="submit" disabled={!key.trim() || loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Loading…" : "Load messages"}
          </button>
        </form>
        {error && <p role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-600">{error}</p>}
        {notice && <p role="status" className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-700 dark:text-emerald-300">{notice}</p>}
        {messages && messages.length === 0 && <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-muted-foreground"><Inbox size={28} /><p className="text-sm">No messages yet.</p></div>}
        {messages?.length > 0 && <div className="space-y-4">
          {messages.map((message) => {
            const status = statusPresentation(message.email_status);
            const StatusIcon = status.Icon;
            const canRetry = message.email_status !== "sent";
            return (
              <article key={message.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{message.name} <span className="font-normal text-muted-foreground">&lt;{message.email}&gt;</span></p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{message.created_at ? new Date(message.created_at).toLocaleString() : "Date unavailable"}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${status.className}`}>
                    <StatusIcon size={13} className={message.email_status === "sending" ? "animate-spin" : ""} /> {status.label}
                  </span>
                </div>
                <p className="mb-2 font-mono text-xs text-cyan-600 dark:text-cyan-300">{message.subject}</p>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{message.message}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="text-xs text-muted-foreground">
                    Attempts: {Number(message.email_attempts || 0)}
                    {message.email_last_attempt_at && <> · Last attempt: {new Date(message.email_last_attempt_at).toLocaleString()}</>}
                    {message.email_last_error && <p className="mt-1 max-w-xl text-red-600 dark:text-red-300">{message.email_last_error}</p>}
                  </div>
                  {canRetry && <button
                    type="button"
                    onClick={() => retryNotification(message)}
                    disabled={Boolean(retryingId) || message.email_status === "sending"}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors hover:border-blue-500/50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {retryingId === message.id ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    {retryingId === message.id ? "Retrying…" : "Retry email"}
                  </button>}
                </div>
              </article>
            );
          })}
        </div>}
      </div>
    </main>
  );
};

export default Admin;

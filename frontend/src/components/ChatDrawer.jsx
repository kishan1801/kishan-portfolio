import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "@/context/AppContexts";
import Logo from "@/components/Logo";
import { SUGGESTED_QUESTIONS } from "@/data/portfolio";

const BACKEND_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const API = `${BACKEND_URL}/api`;

const getSessionId = () => {
  let id = localStorage.getItem("kk-chat-session");
  const validUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!id || !validUuid.test(id)) {
    id = crypto.randomUUID();
    localStorage.setItem("kk-chat-session", id);
  }
  return id;
};

const renderInline = (text) => {
  const parts = String(text).split(
    /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+)/g,
  );
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const markdownLink = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(part);
    if (markdownLink) {
      return (
        <a
          key={i}
          href={markdownLink[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-cyan-600 dark:text-cyan-300"
        >
          {markdownLink[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const cleanUrl = part.replace(/[.,;!?]+$/, "");
      const tail = part.slice(cleanUrl.length);
      return (
        <span key={i}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline underline-offset-2 text-cyan-600 dark:text-cyan-300"
          >
            {cleanUrl}
          </a>
          {tail}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const MessageBody = ({ text }) => (
  <div className="space-y-1.5">
    {String(text || "")
      .split(/\r?\n/)
      .map((line, i) => {
        if (line.startsWith("### ")) {
          return (
            <p key={i} className="pt-1 font-display text-sm font-semibold">
              {renderInline(line.slice(4))}
            </p>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="pt-1 font-display text-sm font-semibold">
              {renderInline(line.slice(3))}
            </p>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <p key={i} className="flex gap-2 pl-1">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
              <span>{renderInline(line.slice(2))}</span>
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return <p key={i}>{renderInline(line)}</p>;
      })}
  </div>
);

const TypingDots = ({ label = "Thinking…" }) => (
  <div
    className="chat-thinking flex items-center gap-3 px-4 py-3"
    data-testid="chat-typing-indicator"
    aria-live="polite"
  >
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-cyan-400"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
      />
    ))}
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const ChatDrawer = () => {
  const { open, setOpen } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [activity, setActivity] = useState("");
  const [reduceMotion, setReduceMotion] = useState(false);
  const scrollRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const sessionRef = useRef(getSessionId());

  useEffect(() => {
    if (!open) return undefined;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousStyles = {
      htmlOverflow: html.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
    };

    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousStyles.htmlOverflow;
      body.style.position = previousStyles.bodyPosition;
      body.style.top = previousStyles.bodyTop;
      body.style.left = previousStyles.bodyLeft;
      body.style.right = previousStyles.bodyRight;
      body.style.width = previousStyles.bodyWidth;
      body.style.overflow = previousStyles.bodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(media.matches);
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!open || messages.length > 0) return;

    let cancelled = false;

    fetch(`${API}/chat/history/${sessionRef.current}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            data.detail || "Chat history is temporarily unavailable.",
          );
        }
        return data;
      })
      .then((d) => {
        if (cancelled) return;

        setMessages((current) => {
          if (current.length > 0) return current;

          return Array.isArray(d.messages)
            ? d.messages.filter(
                (m) => m && typeof m === "object" && typeof m.role === "string",
              )
            : [];
        });
      })
      .catch((error) => {
        if (cancelled) return;
        setMessages((current) =>
          current.length > 0
            ? current
            : [
                {
                  role: "assistant",
                  content:
                    error.message || "Chat history is temporarily unavailable.",
                  error: true,
                },
              ],
        );
      });

    return () => {
      cancelled = true;
    };
  }, [open, messages.length]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: streaming ? "auto" : "smooth",
      });
    }
  }, [messages, streaming, activity]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || streaming || clearing) return;
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);
    setStreaming(true);
    setActivity("Preparing your question…");
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionRef.current, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.detail || "The AI assistant is temporarily unavailable.",
        );
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event;
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }
          if (event.type === "status") {
            setActivity(event.message || "Working on your question…");
          } else if (event.type === "delta") {
            setActivity("");
            setMessages((m) => {
              const copy = [...m];
              const last = copy[copy.length - 1];

              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  ...last,
                  content: (last.content || "") + (event.content || ""),
                };
              } else {
                copy.push({
                  role: "assistant",
                  content: event.content || "",
                });
              }

              return copy;
            });
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      }
    } catch (err) {
      setActivity("");
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            err.message ||
            "Something went wrong. Please try again or use the contact form.",
          error: true,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      setActivity("");
    }
  };

  const clearChat = async () => {
    if (streaming || clearing) return;
    setClearing(true);
    try {
      const response = await fetch(
        `${API}/chat/history/${sessionRef.current}`,
        { method: "DELETE" },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || "Could not clear chat history.");
      }

      const id = crypto.randomUUID();
      localStorage.setItem("kk-chat-session", id);
      sessionRef.current = id;
      setMessages([]);
      setActivity("");
      shouldAutoScrollRef.current = true;
    } catch (error) {
      toast.error(error.message || "Could not clear chat history.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            data-testid="floating-chat-button"
            aria-label="Open Ask Kishan AI chat"
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_36px_-6px_rgba(99,102,241,0.6)] hover:shadow-[0_0_46px_-4px_rgba(99,102,241,0.8)] transition-shadow duration-300"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">Ask Kishan AI</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              data-testid="chat-backdrop"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              data-testid="ai-chat-drawer"
              className="fixed inset-y-0 right-0 z-50 w-full overflow-hidden overscroll-none glass-panel bg-slate-50/95 dark:bg-slate-950/90 flex flex-col border-l border-border sm:w-[430px]"
              role="dialog"
              aria-label="Ask Kishan AI chat"
            >
              <div className="flex shrink-0 items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Logo size={32} />
                  <div>
                    <p className="font-display font-bold text-sm tracking-tight">
                      Ask Kishan AI
                    </p>
                    <p className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                      RAG-powered · portfolio-grounded
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearChat}
                    disabled={streaming || clearing || messages.length === 0}
                    data-testid="chat-clear-button"
                    aria-label="Clear chat history"
                    title="Clear chat history"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    data-testid="chat-close-button"
                    aria-label="Close chat"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <section
                className={`chat-companion ${streaming ? "chat-companion--active" : ""}`}
                data-testid="chat-companion"
                aria-label={`Kishan's AI companion is ${streaming ? "thinking" : "ready to chat"}`}
              >
                <div className="chat-companion__glow" aria-hidden="true" />
                <div
                  className="chat-companion__orbit chat-companion__orbit--one"
                  aria-hidden="true"
                />
                <div
                  className="chat-companion__orbit chat-companion__orbit--two"
                  aria-hidden="true"
                />
                <span
                  className="chat-companion__spark chat-companion__spark--one"
                  aria-hidden="true"
                />
                <span
                  className="chat-companion__spark chat-companion__spark--two"
                  aria-hidden="true"
                />
                <span
                  className="chat-companion__spark chat-companion__spark--three"
                  aria-hidden="true"
                />
                <div className="chat-companion__copy">
                  <p className="chat-companion__eyebrow">
                    <Sparkles size={11} /> KISHAN'S AI SIDEKICK
                  </p>
                  <p className="chat-companion__headline">
                    {streaming ? "Connecting the dots…" : "Ask me anything."}
                  </p>
                  <p className="chat-companion__subtitle">
                    {streaming
                      ? activity || "Searching relevant portfolio facts…"
                      : "Projects, skills, and the story behind them."}
                  </p>
                  <span className="chat-companion__status">
                    <span className="chat-companion__status-dot" />
                    {streaming ? "THINKING" : "READY TO CHAT"}
                  </span>
                </div>
                <div className="chat-companion__art" aria-hidden="true">
                  <img
                    src={
                      reduceMotion
                        ? "/ai-companion-static.webp"
                        : "/ai-companion.webp"
                    }
                    alt=""
                    draggable="false"
                    loading="eager"
                  />
                </div>
              </section>

              <div
                ref={scrollRef}
                onScroll={(event) => {
                  const element = event.currentTarget;
                  shouldAutoScrollRef.current =
                    element.scrollHeight -
                      element.scrollTop -
                      element.clientHeight <
                    64;
                }}
                tabIndex={0}
                aria-label="Chat messages"
                className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y px-5 py-5 space-y-4"
                data-testid="chat-messages"
                data-lenis-prevent
              >
                {messages.length === 0 && (
                  <div className="pt-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      Hi! I'm Kishan's portfolio assistant. Ask me about his
                      projects, skills, education, or the roles he's looking for
                      — I only answer from verified information.
                    </p>
                    <div
                      className="flex flex-wrap gap-2"
                      data-testid="chat-suggestions"
                    >
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          data-testid={`chat-suggestion-${q
                            .slice(0, 20)
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")}`}
                          onClick={() => send(q)}
                          className="rounded-full border border-violet-500/30 bg-violet-500/5 px-3.5 py-2 text-xs text-violet-600 dark:text-violet-300 hover:bg-violet-500/15 transition-colors text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <motion.div
                    key={`${m.role}-${i}`}
                    initial={{ opacity: 0, y: 9, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      data-testid={`chat-message-${m.role}-${i}`}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : m.error
                            ? "bg-destructive/10 text-destructive border border-destructive/30 rounded-bl-md"
                            : "bg-secondary text-secondary-foreground rounded-bl-md"
                      }`}
                    >
                      {m.error && (
                        <AlertCircle
                          size={14}
                          className="inline mr-2 -mt-0.5"
                        />
                      )}
                      {m.role === "assistant" ? (
                        <MessageBody text={m.content} />
                      ) : (
                        m.content
                      )}
                      {streaming &&
                        m.role === "assistant" &&
                        i === messages.length - 1 &&
                        !m.error && (
                          <span className="inline-block w-1.5 h-4 bg-cyan-400 animate-blink ml-1 -mb-0.5" />
                        )}
                    </div>
                  </motion.div>
                ))}
                {streaming && messages[messages.length - 1]?.content === "" && (
                  <TypingDots label={activity || "Writing response…"} />
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="shrink-0 border-t border-border p-4 flex items-center gap-2.5"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  data-testid="ai-chat-input"
                  placeholder="Ask about projects, skills, roles…"
                  maxLength={2000}
                  disabled={streaming || clearing}
                  className="flex-1 rounded-full border border-border bg-card px-4.5 py-3 pl-5 text-sm placeholder:text-muted-foreground/60 focus:border-violet-500/60 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming || clearing}
                  data-testid="ai-chat-send-button"
                  aria-label="Send message"
                  className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white disabled:opacity-40 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatDrawer;

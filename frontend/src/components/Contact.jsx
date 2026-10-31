import { useState } from "react";
import { Mail, Github, Linkedin, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { PROFILE } from "@/data/portfolio";

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.REACT_APP_BACKEND_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");
const API = `${BACKEND_URL}/api`;

const EMPTY_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;
    setSending(true);

    try {
      const response = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Your message could not be submitted. Please try again.",
        );
      }

      // The API intentionally returns "received" for honeypot submissions too.
      // Do not tell a visitor that an email was sent unless the backend confirms it.
      if (data.email_notified === true) {
        toast.success("Message sent successfully", {
          description:
            "Your message was received and an email notification was sent.",
        });
      } else if (data.email_notified === false) {
        toast.warning("Message saved, email not sent", {
          description:
            "Your message was received, but the email notification could not be sent. Please email Kishan directly for a time-sensitive enquiry.",
          duration: 7000,
        });
      } else {
        toast.success("Message received", {
          description:
            "Your submission was accepted. For a time-sensitive enquiry, please email Kishan directly.",
        });
      }

      setForm({ ...EMPTY_FORM });
    } catch (error) {
      toast.error("Could not submit your message", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again or email Kishan directly.",
        duration: 7000,
      });
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-blue-500/60 focus:outline-none";

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-20 lg:py-32"
    >
      <div className="pointer-events-none absolute left-[-120px] top-10 h-[380px] w-[380px] rounded-full bg-blue-600/10 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact & Hiring"
          title="Let's build something"
          description="Entry-level roles, internships, or collaborations — I welcome genuine opportunities to learn and contribute."
        />
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="space-y-4 lg:col-span-5">
            {PROFILE.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-cyan-400/50"
              >
                <span className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600 dark:text-cyan-300">
                  <Mail size={17} />
                </span>
                <span className="break-all text-sm text-muted-foreground group-hover:text-foreground">
                  {email}
                </span>
              </a>
            ))}
            <div className="flex gap-4">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground hover:text-foreground"
              >
                <Github size={17} /> GitHub
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground hover:text-foreground"
              >
                <Linkedin size={17} /> LinkedIn
              </a>
            </div>
            <p className="flex items-center gap-2 pt-2 font-mono text-xs text-muted-foreground">
              <MapPin size={13} className="text-cyan-500" />
              {PROFILE.location} · IST (UTC+5:30)
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
              data-testid="contact-form"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block font-mono text-xs text-muted-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block font-mono text-xs text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block font-mono text-xs text-muted-foreground"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  required
                  maxLength={200}
                  value={form.subject}
                  onChange={update("subject")}
                  placeholder="Entry-level opportunity / collaboration"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-mono text-xs text-muted-foreground"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell me about the role or project…"
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update("website")}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;

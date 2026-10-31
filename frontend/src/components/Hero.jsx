import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageSquare, Github, Linkedin, MapPin, Terminal } from "lucide-react";
import { useChat } from "@/context/AppContexts";
import { PROFILE } from "@/data/portfolio";

const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className="block overflow-hidden pb-1">
    <motion.span
      className={`block ${className}`}
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const CODE_LINES = [
  { text: "const developer = {", cls: "text-slate-500 dark:text-slate-400" },
  { text: '  name: "Kishan Kumar",', cls: "text-cyan-600 dark:text-cyan-300" },
  { text: '  stack: ["React", "FastAPI",', cls: "text-violet-600 dark:text-violet-300" },
  { text: '          "Python", "MongoDB"],', cls: "text-violet-600 dark:text-violet-300" },
  { text: '  project: "RAG-powered portfolio AI",', cls: "text-cyan-600 dark:text-cyan-300" },
  { text: "  openToWork: true,", cls: "text-emerald-600 dark:text-emerald-300" },
  { text: "};", cls: "text-slate-500 dark:text-slate-400" },
];

const Hero = () => {
  const { setOpen } = useChat();
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const orbX = useTransform(sx, (v) => v * 46);
  const orbY = useTransform(sy, (v) => v * 32);
  const cardX = useTransform(sx, (v) => v * -18);
  const cardY = useTransform(sy, (v) => v * -14);
  const chipX = useTransform(sx, (v) => v * 26);
  const chipY = useTransform(sy, (v) => v * 20);

  const onMouseMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      data-testid="hero-section"
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden grid-lines noise pt-16"
    >
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-blue-600/15 dark:bg-blue-600/15 blur-[130px] pointer-events-none"
      />
      <div className="absolute bottom-[-160px] right-[-100px] w-[420px] h-[420px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-12 gap-14 items-center w-full">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 mb-8"
            data-testid="open-to-work-badge"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <span className="text-xs font-mono tracking-wide text-emerald-600 dark:text-emerald-300">
              Open to entry-level developer roles
            </span>
          </motion.div>

          <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-5xl lg:text-6xl leading-[1.05]" data-testid="hero-title">
            <MaskedLine delay={0.15}>{PROFILE.name}</MaskedLine>
            <MaskedLine delay={0.3} className="text-gradient">
              MERN Stack Developer
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-5 font-mono text-xs sm:text-sm text-muted-foreground tracking-wide"
            data-testid="hero-roles"
          >
            Backend Developer <span className="text-blue-500 mx-1">/</span> Problem Solver
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground"
            data-testid="hero-intro"
          >
            {PROFILE.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              data-testid="hero-explore-button"
              className="group inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_36px_-6px_rgba(59,130,246,0.55)] transition-all duration-300 hover:shadow-[0_0_46px_-4px_rgba(59,130,246,0.7)]"
            >
              Explore My Projects
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <button
              data-testid="hero-chat-button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 px-7 py-3.5 text-sm font-semibold text-violet-600 dark:text-violet-200 transition-colors duration-300"
            >
              <MessageSquare size={16} /> Chat With Me
            </button>
            <div className="flex items-center gap-3 ml-1">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-github-link"
                aria-label="Kishan's GitHub profile"
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-cyan-400/50 transition-colors duration-200"
              >
                <Github size={18} />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-linkedin-link"
                aria-label="Kishan's LinkedIn profile"
                className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-cyan-400/50 transition-colors duration-200"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 flex items-center gap-2 text-xs font-mono text-muted-foreground"
          >
            <MapPin size={13} className="text-cyan-500" /> {PROFILE.location}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative hidden md:block"
        >
          <motion.div style={{ x: cardX, y: cardY }} className="relative">
            <div className="rounded-2xl glass-panel shadow-2xl overflow-hidden" data-testid="hero-terminal-card">
              <div className="h-px bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <span className="h-3 w-3 rounded-full bg-green-400/80" />
                <span className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <Terminal size={12} /> developer.js
                </span>
              </div>
              <div className="p-6 font-mono text-[13px] leading-7">
                {CODE_LINES.map((l, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.12 }}
                    className={l.cls}
                  >
                    {l.text}
                  </motion.p>
                ))}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="inline-block w-2.5 h-5 bg-cyan-400 animate-blink mt-1"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ x: chipX, y: chipY }}
            className="absolute -top-6 -right-4 rounded-full glass-panel px-4 py-2 font-mono text-xs text-cyan-500 dark:text-cyan-300 animate-float"
          >
            BM25 · source-grounded RAG
          </motion.div>
          <motion.div
            style={{ x: cardX, y: chipY }}
            className="absolute -bottom-6 -left-6 rounded-full glass-panel px-4 py-2 font-mono text-xs text-violet-500 dark:text-violet-300 animate-float"
          >
            Gemini API · streamed answers
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

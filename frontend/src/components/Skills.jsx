import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Server, Wrench, Cloud, Terminal } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { SKILLS } from "@/data/portfolio";

const ICONS = {
  frontend: LayoutGrid,
  backend: Server,
  "data-cloud": Cloud,
  tools: Wrench,
  additional: Terminal,
};

const Skills = () => {
  const [active, setActive] = useState(SKILLS[0]?.id ?? "frontend");
  const current = SKILLS.find((s) => s.id === active) ?? SKILLS[0];

  return (
    <section id="skills" data-testid="skills-section" className="relative py-20 lg:py-32">
      <div className="absolute top-1/3 left-[-140px] h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I build with"
          description="A practical stack demonstrated through independent projects, implementation, and debugging — not a claim of company employment."
        />
        <Reveal>
          <div className="mb-10 inline-flex flex-wrap gap-1 rounded-full border border-border bg-card p-1" data-testid="skills-tabs">
            {SKILLS.map((cat) => {
              const Icon = ICONS[cat.id] ?? Wrench;
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  data-testid={`skills-tab-${cat.id}`}
                  aria-pressed={isActive}
                  onClick={() => setActive(cat.id)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skill-tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-600"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={15} className="relative z-10" />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-testid="skills-grid"
        >
          {(current?.items ?? []).map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              data-testid={`skill-item-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_-8px_rgba(59,130,246,0.35)]"
            >
              <p className="mb-2 font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
              <p className="font-display text-base font-semibold transition-all duration-300 group-hover:text-gradient">{skill}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;

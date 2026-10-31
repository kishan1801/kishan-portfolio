import { GraduationCap, Rocket, FolderGit2, Briefcase, LineChart, ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { TIMELINE } from "@/data/portfolio";

const TYPE_STYLE = {
  Education: { icon: GraduationCap, cls: "bg-blue-500/10 text-blue-500 dark:text-cyan-400 border-blue-500/30" },
  Training: { icon: Rocket, cls: "bg-violet-500/10 text-violet-500 dark:text-violet-400 border-violet-500/30" },
  "Personal Projects": { icon: FolderGit2, cls: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/30" },
  "Independent Research": { icon: LineChart, cls: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30" },
  "Open to Work": { icon: Briefcase, cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30" },
};

const Timeline = () => (
  <section id="journey" data-testid="timeline-section" className="relative py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Experience & Education"
        title="An honest timeline"
        description="Education, training, independent project work, and finance research — clearly separated from company software employment."
      />
      <div className="relative max-w-3xl">
        <div className="absolute bottom-2 left-[22px] top-2 w-px bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500 opacity-40" />
        <div className="space-y-10">
          {TIMELINE.map((item, i) => {
            const style = TYPE_STYLE[item.type] ?? TYPE_STYLE["Personal Projects"];
            const Icon = style.icon;
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <article className="relative flex gap-6" data-testid={`timeline-item-${i}`}>
                  <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-card ${style.cls}`}>
                    <Icon size={17} />
                  </span>
                  <div className="pb-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{item.period}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${style.cls}`}>{item.type}</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-300 transition-colors">
                        {item.urlLabel || "View credential"}<ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default Timeline;

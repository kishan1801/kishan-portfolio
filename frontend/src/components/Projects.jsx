import { useMemo, useState } from "react";
import { ArrowUpRight, Github, ExternalLink, Code2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { PROJECTS } from "@/data/portfolio";

const FILTERS = ["All", "Full Stack", "Backend", "React", "Real-time", "Cloud", "Security"];

const ExternalProjectLink = ({ href, children, label }) => {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-cyan-400/50 hover:text-foreground">
      {children}
    </a>
  );
};

const Projects = () => {
  const [active, setActive] = useState("All");
  const filtered = useMemo(() => active === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags?.includes(active)), [active]);

  return (
    <section id="projects" data-testid="projects-section" className="relative py-20 lg:py-32">
      <div className="absolute right-[-120px] top-1/4 h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Selected Projects"
          title="Built, tested, and deployed"
          description="Independent full-stack projects that show how I approach APIs, authentication, cloud media, and application state. Each case study links to its live demo and source repositories."
        />
        <Reveal>
          <div className="mb-8 flex flex-wrap gap-2" data-testid="project-filters" role="group" aria-label="Filter projects">
            {FILTERS.map((filter) => (
              <button key={filter} type="button" onClick={() => setActive(filter)} aria-pressed={active === filter} data-testid={`project-filter-${filter.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${active === filter ? "border-blue-500 bg-blue-600 text-white" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2" data-testid="projects-grid">
          {filtered.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_18px_55px_-35px_rgba(59,130,246,0.55)]" data-testid={`project-card-${project.id}`}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">{project.category}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{project.period}</span>
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(project.stack || []).slice(0, 7).map((tech) => <span key={tech} className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] text-muted-foreground">{tech}</span>)}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <ExternalProjectLink href={project.live} label={`Open live demo for ${project.title}`}><ExternalLink size={13} /> Live demo</ExternalProjectLink>
                  <ExternalProjectLink href={project.frontendUrl || project.github} label={`Open frontend repository for ${project.title}`}><Github size={13} /> Frontend</ExternalProjectLink>
                  <ExternalProjectLink href={project.backendUrl} label={`Open backend repository for ${project.title}`}><Code2 size={13} /> Backend</ExternalProjectLink>
                </div>
                <div className="mt-auto pt-6">
                  {project.disclaimer && <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{project.disclaimer}</p>}
                  <Link to={`/project/${project.id}`} data-testid={`project-details-${project.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-cyan-500">
                    Read case study <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

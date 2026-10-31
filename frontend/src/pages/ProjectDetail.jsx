import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Code2, CheckCircle2, Lightbulb } from "lucide-react";
import { PROJECTS, PROFILE } from "@/data/portfolio";

const ProjectLink = ({ href, children, label }) => href ? (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-cyan-400/50 hover:text-foreground">
    {children}
  </a>
) : null;

const ProjectDetail = () => {
  const { projectId } = useParams();
  const project = PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-foreground">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold">Project not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">This case study may have moved or the URL may be incorrect.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={15} /> Back to portfolio</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground" data-testid="project-detail-page">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Link to="/#projects" data-testid="project-detail-back" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft size={15} /> All projects</Link>

        <header className="mt-12 border-b border-border pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">{project.category}</p>
          <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
              <p className="mt-3 font-mono text-xs text-muted-foreground">{project.period}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ProjectLink href={project.live} label={`Open live demo for ${project.title}`}><ExternalLink size={15} /> Live demo</ProjectLink>
              <ProjectLink href={project.frontendUrl || project.github} label={`Open frontend source for ${project.title}`}><Github size={15} /> Frontend</ProjectLink>
              <ProjectLink href={project.backendUrl} label={`Open backend source for ${project.title}`}><Code2 size={15} /> Backend</ProjectLink>
            </div>
          </div>
          <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{project.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">{project.stack.map((tech) => <span key={tech} className="rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground">{tech}</span>)}</div>
        </header>

        <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-10">
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold"><Lightbulb size={18} className="text-cyan-500" /> Problem & approach</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.problem}</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{project.architecture}</p>
            </section>
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold"><CheckCircle2 size={18} className="text-cyan-500" /> Implemented features</h2>
              <ul className="mt-4 space-y-3">
                {project.features.map((feature) => <li key={feature} className="flex gap-3 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />{feature}</li>)}
              </ul>
            </section>
            {project.challenges?.length > 0 && (
              <section>
                <h2 className="font-display text-xl font-bold">Engineering notes</h2>
                <div className="mt-4 space-y-4">
                  {project.challenges.map((item) => <article key={item.title} className="rounded-xl border border-border bg-card p-5"><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p></article>)}
                </div>
              </section>
            )}
            {project.disclaimer && <p className="rounded-xl border border-border bg-card/60 p-4 text-xs leading-relaxed text-muted-foreground">{project.disclaimer}</p>}
            <Link to="/#contact" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500">Discuss this project with Kishan <ArrowUpRight size={15} /></Link>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Project links</p>
            <div className="mt-4 space-y-2">
              {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:border-cyan-400/50"><span>Live application</span><ExternalLink size={14} /></a>}
              {(project.frontendUrl || project.github) && <a href={project.frontendUrl || project.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:border-cyan-400/50"><span>Frontend repository</span><Github size={14} /></a>}
              {project.backendUrl && <a href={project.backendUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:border-cyan-400/50"><span>Backend repository</span><Code2 size={14} /></a>}
            </div>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Part of {PROFILE.name}'s independent project portfolio.</p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetail;

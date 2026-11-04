import { Code2, GraduationCap, Target, MapPin } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { PROFILE } from "@/data/portfolio";

const ICONS = [Code2, GraduationCap, Target, MapPin];
const About = () => (
  <section id="about" data-testid="about-section" className="relative py-20 lg:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="About me" title="Building Practical Full-Stack Solutions — through real projects" description="A practical introduction to what I've built, how I work, and where I want to go next." />
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="space-y-4 lg:col-span-7">{PROFILE.about.map((paragraph, i) => <p key={i} className="text-sm leading-7 text-muted-foreground sm:text-base">{paragraph}</p>)}<div className="flex flex-wrap gap-2 pt-2"><span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-300">Open to entry-level roles</span><span className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">Independent project experience</span></div></Reveal>
        <Reveal delay={0.1} className="grid gap-3 sm:grid-cols-2 lg:col-span-5">{PROFILE.stats.map((item, i) => { const Icon = ICONS[i] || Code2; return <article key={item.label} className="rounded-2xl border border-border bg-card p-5"><Icon size={17} className="mb-5 text-cyan-500" /><p className="font-display text-2xl font-bold tracking-tight">{item.value}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.label}</p></article>; })}</Reveal>
      </div>
    </div>
  </section>
);
export default About;

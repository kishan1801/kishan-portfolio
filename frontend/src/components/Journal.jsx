import { PenLine } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { JOURNAL_TOPICS } from "@/data/portfolio";

const Journal = () => (
  <section id="journal" data-testid="journal-section" className="relative py-20 lg:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Learning Journal" title="Notes from the build log" description="Topics I'm documenting as I build and learn. Articles will appear here only when they are actually written." />
      <Reveal><div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 sm:p-12" data-testid="journal-empty-state"><div className="mb-5 flex items-center gap-3"><span className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-600 dark:text-cyan-300"><PenLine size={18} /></span><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Writing queue</p></div><p className="mb-6 max-w-xl text-sm text-muted-foreground">Current topics on the writing desk:</p><div className="grid gap-4 sm:grid-cols-3">{JOURNAL_TOPICS.map((topic, i) => <article key={topic} className="rounded-xl border border-border bg-card p-5"><p className="mb-2 font-mono text-[10px] text-cyan-600 dark:text-cyan-300">DRAFT {String(i + 1).padStart(2, "0")}</p><p className="font-display text-sm font-semibold leading-snug">{topic}</p></article>)}</div></div></Reveal>
    </div>
  </section>
);
export default Journal;

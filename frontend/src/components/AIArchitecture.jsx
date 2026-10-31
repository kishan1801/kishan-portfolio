import { Database, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";

const STEPS = [
  { icon: MessageCircle, number: "01", title: "Ask a question", detail: "A recruiter can ask about a specific project, technology, career goal, or public credential." },
  { icon: Search, number: "02", title: "Retrieve relevant records", detail: "A lightweight BM25-style ranker selects curated portfolio passages without paying for an embedding service or vector database." },
  { icon: Database, number: "03", title: "Generate a grounded answer", detail: "The model is instructed to answer only from the supplied records and to name the sources it used." },
  { icon: ShieldCheck, number: "04", title: "Keep the scope honest", detail: "The assistant distinguishes project experience from company employment and does not claim tools or credentials that are not in the records." },
];

const AIArchitecture = () => (
  <section id="ask-kishan-ai" data-testid="ai-architecture-section" className="relative py-20 lg:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="AI Under the Hood"
        title="A portfolio assistant with a source of truth"
        description="Ask Kishan AI uses retrieval-augmented generation (RAG) over curated portfolio records. A BM25-style lexical ranker finds relevant facts, then a configurable language model streams a grounded answer with source labels. It keeps hosting simple and avoids a paid vector database for this small knowledge base."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.number} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-border bg-card p-5" data-testid={`ai-architecture-step-${step.number}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{step.number}</span>
                  <span className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5 text-cyan-600 dark:text-cyan-300"><Icon size={18} /></span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Current scope: grounded Q&A and public-link discovery. This version uses lexical retrieval, not semantic embeddings, external web browsing, or autonomous write-actions. That is deliberate: for a small portfolio knowledge base it is fast, auditable, and inexpensive; semantic embeddings can be added later if retrieval tests show a real need.</p>
    </div>
  </section>
);

export default AIArchitecture;

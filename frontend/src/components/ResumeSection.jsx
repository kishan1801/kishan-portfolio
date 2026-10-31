import { FileDown, Mail, ExternalLink } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { PROFILE } from "@/data/portfolio";

const ResumeSection = () => (
  <section id="resume" data-testid="resume-section" className="relative py-20 lg:py-32">
    <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Resume" title="The one-page version" description="A quick view of my technical background and the kind of opportunity I'm looking for." />
      <Reveal>
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-9 lg:col-span-7" data-testid="resume-summary-card">
            <div className="mb-7 h-px w-24 bg-gradient-to-r from-cyan-400 to-violet-500" />
            <dl className="space-y-6">
              <div>
                <dt className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-blue-500 dark:text-cyan-400">Summary</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">BCA graduate (CMR University, 2024) with hands-on experience from independent full-stack projects. Seeking a first company-based software development role or internship.</dd>
              </div>
              <div>
                <dt className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-blue-500 dark:text-cyan-400">Core Stack</dt>
                <dd className="text-sm text-muted-foreground">React · JavaScript · Node.js · Express · MongoDB · REST APIs · JWT · Socket.IO · AWS S3 · Cloudinary</dd>
              </div>
              <div>
                <dt className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-blue-500 dark:text-cyan-400">Selected Project</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">Habitat Digital — role-based real-estate platform with protected APIs, S3 pre-signed URLs, and real-time Socket.IO view counts.</dd>
              </div>
              <div>
                <dt className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-blue-500 dark:text-cyan-400">Independent Research</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">WorldQuant BRAIN — quantitative finance alpha exploration and simulations; Quantitative Finance Starter Level completed in June 2026.</dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-border bg-gradient-to-br from-blue-600/10 via-card to-violet-600/10 p-7 sm:p-9 lg:col-span-5" data-testid="resume-download-card">
            <h3 className="mb-3 font-display text-xl font-bold tracking-tight">Review my resume</h3>
            <p className="mb-7 text-sm leading-relaxed text-muted-foreground">Download the PDF or email me about an entry-level role, internship, or project collaboration.</p>
            <div className="flex flex-wrap gap-3">
              <a href={PROFILE.resumeUrl || "/resume.pdf"} download data-testid="resume-download-button" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-500">
                <FileDown size={16} /> Download PDF
              </a>
              <a href={`mailto:${PROFILE.emails[0]}?subject=Software%20Developer%20Opportunity`} data-testid="resume-email-button" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-cyan-400/50 hover:text-foreground">
                <Mail size={16} /> Contact me
              </a>
            </div>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"><ExternalLink size={12} /> LinkedIn profile</a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default ResumeSection;

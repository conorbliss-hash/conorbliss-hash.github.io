import { ArrowRight } from "lucide-react";

import { trackEvent } from "@/lib/analytics";

const preview = [
  { status: "Applies now", law: "DORA, through bank customers", tone: "bg-primary text-primary-foreground" },
  { status: "Applies now", law: "AI Act, Art. 50 transparency", tone: "bg-primary text-primary-foreground" },
  { status: "Coming", law: "AI Act high-risk, 2 Dec 2027", tone: "bg-accent/15 text-accent border border-accent/30" },
  { status: "Watch", law: "Norway's AI law, 2027", tone: "bg-muted text-muted-foreground border border-border" },
];

const ToolSection = () => (
  <section id="tools" className="py-14 md:py-20">
    <div className="section-container">
      <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 font-display text-xl font-semibold text-primary md:text-2xl">Free tool</p>
          <h3 className="mb-3 font-display text-2xl font-semibold leading-snug md:text-3xl">
            Intelligence on Tap: which AI rules apply to your company?
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
            Answer a few questions and get a map of the EU and Nordic rules that touch your AI: the AI Act, GDPR, DORA,
            NIS2 and the Cyber Resilience Act. You get deadlines, what to do, and the questions your customers will ask,
            each linked to its source.
          </p>
          <a
            href="/intelligence-on-tap"
            onClick={() => trackEvent("Outbound Click", { destination: "intelligence-on-tap" })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get your rule map
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="space-y-2.5" aria-hidden>
          {preview.map((p) => (
            <div key={p.law} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.tone}`}>{p.status}</span>
              <span className="truncate text-sm">{p.law}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ToolSection;

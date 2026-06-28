import { ArrowRight, Github } from "lucide-react";

import coachInboxImg from "@/assets/articles/coach-inbox.png";

const OpenSourceSection = () => {
  return (
    <section id="open-source" className="py-10 md:py-12">
      <div className="section-container">
        <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase mb-4 text-center">
          Open source
        </p>
        <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[240px] lg:min-h-[340px] bg-[#0f172a]">
              <img
                src={coachInboxImg}
                alt="Health Coach before and after interface showing the shift from scattered inputs to a report view"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 md:p-10">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase mb-3">
                  Open source build proof
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 leading-tight">
                  Health Coach - governance patterns in a personal demo
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5">
                  A public demo showing schema validation, audit logging, and automated reporting applied to Google Fit → Google Sheets.
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    "Public repo",
                    "Validation gates",
                    "Audit logging",
                    "Automated reporting",
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Google Fit</span>
                  <ArrowRight className="mx-2 inline-block h-4 w-4 align-[-2px]" />
                  <span className="font-medium text-foreground">validation</span>
                  <ArrowRight className="mx-2 inline-block h-4 w-4 align-[-2px]" />
                  <span className="font-medium text-foreground">audit log</span>
                  <ArrowRight className="mx-2 inline-block h-4 w-4 align-[-2px]" />
                  <span className="font-medium text-foreground">Sheets</span>
                </div>

                <a
                  href="https://github.com/conorbliss-hash/health-coach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;

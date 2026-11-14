import { ArrowRight, Github } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import HealthCoachMock from "@/components/portfolio/HealthCoachMock";

const OpenSourceSection = () => {
  return (
    <section id="open-source" className="surface-dark py-14 md:py-20">
      <div className="section-container">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[240px] lg:min-h-[340px] overflow-hidden bg-[#0f172a]">
              <HealthCoachMock />
            </div>

            <div className="flex flex-col justify-between gap-7 p-6 sm:p-8 md:p-10">
              <div>
                <p className="font-display text-primary text-xl md:text-2xl font-semibold mb-4">
                  Personal project
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 leading-snug">
                  Health Coach: fitness data turned into useful reports
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">
                  A personal project that takes fitness data from Google Fit, checks it for errors, and creates reports in Google Sheets. Included here to show how I build reliable data workflows, not just plan them.
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
                <div className="text-sm text-muted-foreground leading-relaxed">
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
                  onClick={() => trackEvent("Outbound Click", { destination: "health-coach-github" })}
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

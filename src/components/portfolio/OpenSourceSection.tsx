import { Github } from "lucide-react";

const OpenSourceSection = () => {
  return (
    <section id="open-source" className="py-10 md:py-12">
      <div className="section-container">
        <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase mb-4 text-center">
          Open source
        </p>
        <div className="max-w-3xl mx-auto p-5 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-semibold mb-1">
              Health Coach - governance patterns in a personal demo
            </h3>
            <p className="text-muted-foreground text-sm">
              Schema validation, audit logging, and automated reporting applied to Google Fit → Google Sheets.
            </p>
          </div>
          <a
            href="https://github.com/conorbliss-hash/health-coach"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;

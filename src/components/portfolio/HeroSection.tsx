import { motion } from "framer-motion";
import { ArrowRight, Code2, Rocket, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import profileImage from "@/assets/profile.png";

const buildSignals = [
  {
    label: "Shipped systems",
    icon: Rocket,
    href: "#projects",
    summary: "Production delivery and rollout experience",
    expandedTitle: "Shipped systems",
    expandedPoints: [
      "Production systems shipped to live environments",
      "Rollout experience across multiple workstreams",
      "Delivery work tied to measurable business outcomes",
    ],
  },
  {
    label: "Public code",
    icon: Code2,
    href: "#open-source",
    summary: "Inspectable work outside employer context",
    expandedTitle: "Public code",
    expandedPoints: [
      "Health Coach demo in a public repo",
      "Validation gates and audit logging visible in code",
      "A concrete build signal without confidentiality risk",
    ],
  },
  {
    label: "Governed delivery",
    icon: ShieldCheck,
    href: "#about",
    summary: "Supported ISO 42001 certification and audit prep",
    expandedTitle: "Governed delivery",
    expandedPoints: [
      "Supported ISO 42001 certification",
      "Responsible for AI documentation and audit preparation",
      "Controlled access, logging, and readiness built into delivery",
    ],
  },
];

const HeroSection = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const updateLayout = () => {
      setIsDesktop(mediaQuery.matches);
      setActiveSignal((currentSignal) => (mediaQuery.matches ? currentSignal : null));
    };

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  const selectedSignal = buildSignals.find((signal) => signal.label === activeSignal) ?? null;

  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-28 pb-8 md:pt-32 md:pb-8">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />

      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6"
        >
          <img
            src={profileImage}
            alt="Conor Bliss"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-sm md:text-base mb-3 tracking-widest uppercase font-body">
            AI Lead: Strategy, Governance, Data Platforms
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="font-display text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 max-w-6xl mx-auto leading-tight"
        >
          I take AI from strategy to production -{" "}
          <span className="text-gradient">and make sure it stays there.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-4 font-body px-2"
        >
          Use-case portfolios, business cases, production systems - with validation, logging, and access controls built in.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="mb-0"
        >
          <div className="flex flex-wrap gap-2 justify-center px-4">
            {[
              "Supported ISO 42001 certification",
              "AIGP Certified",
              "External Pentest Passed",
              "C1 Swedish",
              "Stockholm-based",
            ].map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          className="mt-6 max-w-6xl mx-auto"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {buildSignals.map((signal) => {
              const Icon = signal.icon;

              const cardContent = (
                <>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{signal.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{signal.summary}</p>
                      </div>
                    </div>
                    {isDesktop ? (
                      <span className="text-xs text-muted-foreground">Click to expand</span>
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {signal.summary}
                  </p>
                </>
              );

              if (!isDesktop) {
                return (
                  <a
                    key={signal.label}
                    href={signal.href}
                    className="group rounded-2xl border border-border bg-card/80 px-5 py-4 text-left transition-all hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <button
                  key={signal.label}
                  type="button"
                  onClick={() => setActiveSignal((currentSignal) => (currentSignal === signal.label ? null : signal.label))}
                  className={`group rounded-2xl border px-5 py-4 text-left transition-all hover:shadow-md hover:shadow-primary/5 ${
                    activeSignal === signal.label
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card/80 hover:border-primary/40"
                  }`}
                  aria-expanded={activeSignal === signal.label}
                  aria-controls="hero-build-proof-details"
                >
                  {cardContent}
                </button>
              );
            })}
          </div>

          {isDesktop && selectedSignal && (
            <motion.div
              id="hero-build-proof-details"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-4 rounded-2xl border border-border bg-background/70 p-5 text-left backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">
                    More detail
                  </p>
                  <h3 className="font-display text-lg font-semibold">{selectedSignal.expandedTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSignal(null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {selectedSignal.expandedPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-xl border border-border bg-card/80 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

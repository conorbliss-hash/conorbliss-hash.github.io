import { motion } from "framer-motion";
import { Code2, Rocket, ShieldCheck } from "lucide-react";

import profileImage from "@/assets/profile.png";

const buildSignals = [
  {
    label: "Shipped systems",
    icon: Rocket,
    detail: "Production delivery, not just recommendations",
  },
  {
    label: "Public code",
    icon: Code2,
    detail: "Inspectable work outside employer context",
  },
  {
    label: "Governed delivery",
    icon: ShieldCheck,
    detail: "Validation, logging, and access controls built in",
  },
];

const HeroSection = () => {
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
              "ISO 42001 Certified",
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
          className="mt-7 max-w-4xl mx-auto"
        >
          <div className="grid gap-3 sm:grid-cols-3 rounded-2xl border border-border/80 bg-background/70 p-3 sm:p-4 backdrop-blur-sm">
            {buildSignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <div
                  key={signal.label}
                  className="rounded-xl border border-border bg-card/80 p-4 text-left shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{signal.label}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{signal.detail}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

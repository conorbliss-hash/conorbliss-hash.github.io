import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const methodologySteps = [
  "Validation gates",
  "Structured outputs", 
  "Logging/traceability",
  "Rollback-ready deployments"
];

const decisions = [
  "When AI must be constrained, not improved",
  "When data is unsafe to reuse (even if it's technically clean)",
  "Where human judgment must be explicit and recorded",
  "How to surface failures early, not at scale"
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-10 md:py-16" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Methodology
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            How I <span className="text-gradient">Build</span>
          </h2>
        </motion.div>

        {/* Methodology Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 md:mb-20"
        >
          {methodologySteps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-card border border-border rounded-lg font-medium text-foreground text-sm sm:text-base text-center">
                {step}
              </div>
              {index < methodologySteps.length - 1 && (
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Decisions I'm accountable for */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center">
            Decisions I'm accountable for
          </h3>
          <div className="space-y-4">
            {decisions.map((decision, index) => (
              <motion.div
                key={decision}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                className="flex items-start gap-4 p-4 bg-card/50 rounded-lg border border-border/50"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground font-body">{decision}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

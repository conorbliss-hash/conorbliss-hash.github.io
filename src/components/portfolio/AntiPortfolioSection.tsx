import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { XCircle } from "lucide-react";

const antiPatterns = [
  "Fully autonomous AI in business-critical workflows",
  "AI systems without named data owners",
  "Dashboards without decision accountability",
  "Automation that cannot be rolled back cleanly",
];

const AntiPortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="anti-portfolio" className="py-32" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Boundaries
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            What I deliberately <span className="text-gradient">do not</span> build
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {antiPatterns.map((pattern, index) => (
              <motion.div
                key={pattern}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="flex items-center gap-4 p-5 rounded-lg border border-border/50 bg-card/50"
              >
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-foreground font-body">{pattern}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AntiPortfolioSection;

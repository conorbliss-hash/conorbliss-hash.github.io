import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const designBets = [
  {
    title: "Deterministic before probabilistic",
    content: "Trust cannot be inferred. AI introduces variance into systems. Before adding that variance, I exhaust deterministic options: rules, lookups, structured logic. AI solves the residual ambiguity, not the whole problem.",
    mechanism: "Schema validation + explicit rules"
  },
  {
    title: "Governance before scale",
    content: "Speed amplifies ambiguity. Scaling ungoverned AI creates compounding risk. I design validation layers, ownership boundaries, and audit trails before expanding scope.",
    mechanism: "Validation layers + audit trail"
  },
  {
    title: "Design for failure modes, not happy paths",
    content: "Happy paths are free. I focus on what happens when inputs are malformed, when models hallucinate, when upstream data is late. Systems that handle failure gracefully earn trust.",
    mechanism: "Rollback + anomaly detection"
  },
  {
    title: "Human checkpoints by default",
    content: "Judgment cannot be automated away. I build systems where humans review before consequential actions, not after failures. 'The AI said so' is never an acceptable answer.",
    mechanism: "Approval gates + review checkpoints"
  },
  {
    title: "Validation and auditability as requirements",
    content: "Memory and intent decay. If a system cannot explain its outputs or prove its inputs were valid, it should not run in production. I treat validation and audit trails as first-class requirements.",
    mechanism: "Input validation + audit logs"
  },
];

const DesignBetsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="principles" className="py-16 md:py-32 bg-card/50" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Philosophy
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 px-2">
            Design bets I'm willing to be <span className="text-gradient">wrong about</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {designBets.map((bet, index) => (
              <AccordionItem 
                key={bet.title} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-4 sm:px-6 bg-background data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-display text-base sm:text-lg font-medium hover:no-underline py-4 sm:py-5">
                  {bet.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body pb-5 space-y-3">
                  <p>{bet.content}</p>
                  <p className="text-xs text-primary/80 font-medium">{bet.mechanism}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default DesignBetsSection;

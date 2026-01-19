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
    content: "When possible, I design systems that produce consistent, reproducible outputs before introducing probabilistic AI elements. This makes debugging easier and builds trust with stakeholders."
  },
  {
    title: "Governance before scale",
    content: "It's tempting to scale quickly, but I prioritize establishing clear governance frameworks first. Controls that are retrofitted are weaker than controls designed in from the start."
  },
  {
    title: "Design for failure modes, not happy paths",
    content: "I spend more time thinking about how systems fail than how they succeed. Edge cases, bad data, and unexpected inputs reveal the true robustness of a design."
  },
  {
    title: "Human checkpoints by default",
    content: "Rather than building fully autonomous systems that require opt-in human oversight, I design for human involvement by default with clear criteria for when automation can proceed."
  },
  {
    title: "Validation and auditability as requirements",
    content: "These aren't nice-to-haves. Every system I build has validation at ingestion, transformation logging, and audit trails that can answer 'what happened and why' months later."
  },
];

const DesignBetsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="principles" className="py-32 bg-card/50" ref={ref}>
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
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
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
                className="border border-border rounded-lg px-6 bg-background data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-display text-lg font-medium hover:no-underline py-5">
                  {bet.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body pb-5">
                  {bet.content}
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

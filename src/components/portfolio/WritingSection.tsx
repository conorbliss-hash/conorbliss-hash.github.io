import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const articles = [
  {
    title: "How I code with agents, without being 'technical'",
    subtitle: "A 5 step process for consistent results",
    link: "#"
  },
  {
    title: "An Operating System for Data Authority",
    subtitle: "Designing an AI-Enabled Data Ingestion Pipeline",
    link: "#"
  },
  {
    title: "Making Data Authoritative: The Step Most AI Programs Skip",
    subtitle: "As companies push AI from experiments into real workflows",
    link: "#"
  },
  {
    title: "It's not another dashboard. It's a coach in your inbox.",
    subtitle: "From Data Overload to Clarity. One Email. One Decision for the Week.",
    link: "#"
  },
];

const WritingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="writing" className="py-32 bg-card/50" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Ideas
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            <span className="text-gradient">Writing</span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {articles.map((article, index) => (
              <motion.a
                key={article.title}
                href={article.link}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="group flex items-start justify-between p-6 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{article.subtitle}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WritingSection;

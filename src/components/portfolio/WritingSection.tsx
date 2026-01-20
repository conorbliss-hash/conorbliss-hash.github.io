import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import codingWithAgentsImg from "@/assets/articles/coding-with-agents.png";
import operatingSystemDataImg from "@/assets/articles/operating-system-data.png";
import dataAuthoritativeImg from "@/assets/articles/data-authoritative.png";
import coachInboxImg from "@/assets/articles/coach-inbox.png";

const articles = [
  {
    title: "How I code with agents, without being 'technical'",
    subtitle: "A 5 step process for consistent results",
    link: "https://medium.com/@conor.bliss.henaghan/how-i-code-with-agents-without-being-technical-d411e2cceb4d",
    image: codingWithAgentsImg
  },
  {
    title: "An Operating System for Data Authority",
    subtitle: "Designing an AI-Enabled Data Ingestion Pipeline",
    link: "https://medium.com/@conor.bliss.henaghan/an-operating-system-for-data-authority-cabf63b797d7",
    image: operatingSystemDataImg
  },
  {
    title: "Making Data Authoritative: The Step Most AI Programs Skip",
    subtitle: "As companies push AI from experiments into real workflows",
    link: "https://medium.com/@conor.bliss.henaghan/making-data-authoritative-the-step-most-ai-programs-skip-61c728612421",
    image: dataAuthoritativeImg
  },
  {
    title: "It's not another dashboard. It's a coach in your inbox.",
    subtitle: "From Data Overload to Clarity. One Email. One Decision for the Week.",
    link: "https://medium.com/@conor.bliss.henaghan/its-not-another-dashboard-it-s-a-coach-in-your-inbox-c95e3f9e6f44",
    image: coachInboxImg
  },
];

const ArticleCard = ({ article }: { article: typeof articles[0] }) => (
  <a
    href={article.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex-shrink-0 w-[300px] sm:w-[350px] rounded-lg border border-border bg-background hover:border-primary/50 transition-colors overflow-hidden"
  >
    <div className="aspect-[16/10] overflow-hidden">
      <img 
        src={article.image} 
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm sm:text-base font-semibold group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
      </div>
      <p className="text-muted-foreground text-xs sm:text-sm mt-2 line-clamp-2">{article.subtitle}</p>
    </div>
  </a>
);

const WritingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Duplicate articles for seamless loop
  const duplicatedArticles = [...articles, ...articles];

  return (
    <section id="writing" className="py-16 md:py-32 bg-card/50" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Ideas
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            <span className="text-gradient">Writing</span>
          </h2>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <div 
          className="flex gap-6 animate-scroll hover:pause-animation"
          style={{
            width: "max-content",
          }}
        >
          {duplicatedArticles.map((article, index) => (
            <ArticleCard key={`${article.title}-${index}`} article={article} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WritingSection;

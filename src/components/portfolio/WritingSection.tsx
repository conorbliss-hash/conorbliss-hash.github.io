import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import operatingSystemDataImg from "@/assets/articles/operating-system-data.png";
import aiCrmMigrationImg from "@/assets/articles/ai-crm-migration.png";
import euAiActImg from "@/assets/articles/eu-ai-act.png";
import aiInfrastructureImg from "@/assets/articles/ai-infrastructure.png";

const articles = [
  {
    title: "ISO 42001 in Practice: A Practitioner's Guide to AI Governance Certification",
    subtitle: "What the standard actually requires — and how to build a framework that passes",
    link: "https://medium.com/@conor.bliss.henaghan",
    image: euAiActImg
  },
  {
    title: "An Operating System for Data Authority",
    subtitle: "Designing an AI-Enabled Data Ingestion Pipeline",
    link: "https://medium.com/@conor.bliss.henaghan/an-operating-system-for-data-authority-cabf63b797d7",
    image: operatingSystemDataImg
  },
  {
    title: "Inside an AI-First CRM Migration",
    subtitle: "How to move a CRM from legacy to AI-first without breaking the business",
    link: "https://medium.com/@conor.bliss.henaghan/inside-an-ai-first-crm-migration-8995ef0b9a7c",
    image: aiCrmMigrationImg
  },
  {
    title: "The Real Bottleneck in Most AI Initiatives Isn't AI. It's Infrastructure",
    subtitle: "Why data pipelines and systems matter more than the model you choose",
    link: "https://medium.com/@conor.bliss.henaghan/the-real-bottleneck-in-most-ai-initiatives-isnt-ai-it-s-infrastructure-507c41d98a21",
    image: aiInfrastructureImg
  },
];

const ArticleCard = ({ article }: { article: typeof articles[0] }) => (
  <a
    href={article.link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex-shrink-0 w-[300px] sm:w-[350px] rounded-lg border border-border bg-background hover:border-primary/50 transition-all overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5"
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
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Selected Writing
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            <span className="text-gradient">Writing</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-4 font-body">
            Practical notes on AI governance, data infrastructure, and production delivery.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
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

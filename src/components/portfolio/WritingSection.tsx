import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import b13Img from "@/assets/articles/b13_tools.webp";
import b15Img from "@/assets/articles/b15_funnel.webp";
import b03Img from "@/assets/articles/b03_spend.webp";
import isoImg from "@/assets/articles/iso42001_order.webp";
import { trackEvent } from "@/lib/analytics";

// Recent Medium posts, newest first. Covers are the palette-matched site versions from Writing & research
// (linkedin/charts/site_covers.py, 960x600). Blog 12 ("Your AI register is only accurate on audit day")
// replaces the ISO 42001 card once it's published.
type Article = { title: string; subtitle: string; link: string; image?: string };

const articles: Article[] = [
  {
    title: "Your managers can now build their own software",
    subtitle: "Any manager can build a working tool in a week. Say yes, with rules for where customer data goes.",
    link: "https://medium.com/@conor.bliss.henaghan/your-managers-can-now-build-their-own-software-fc2141c89cfc",
    image: b13Img,
  },
  {
    title: "AI speeds up the work, not the results",
    subtitle: "Commits rose far faster than releases. Name the result before you count the output.",
    link: "https://medium.com/@conor.bliss.henaghan/ai-speeds-up-the-work-not-the-results-de962ad7572b",
    image: b15Img,
  },
  {
    title: "AI spend has flattened. Usage hasn't.",
    subtitle: "The top 1% of firms spend about 625 times the median on AI. What the leaders do differently.",
    link: "https://medium.com/@conor.bliss.henaghan/ai-spend-has-flattened-usage-hasnt-a9c050f8fa4d",
    image: b03Img,
  },
  {
    title: "ISO 42001 audits your process. It doesn't audit your AI.",
    subtitle: "What the standard actually requires, and the order to write the documents in.",
    link: "https://medium.com/@conor.bliss.henaghan/iso-42001-audits-your-process-it-doesnt-audit-your-ai-0a99d87b3dcc",
    image: isoImg,
  },
];

// Moves the card's spotlight (see .spotlight-card in index.css) to the cursor.
const trackSpotlight = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
};

const ArticleCard = ({ article }: { article: Article }) => (
  <a
    href={article.link}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackEvent("Outbound Click", { destination: article.title })}
    onPointerMove={trackSpotlight}
    className="spotlight-card group rounded-lg border border-border bg-background hover:border-primary/50 transition-all overflow-hidden shadow-sm hover:shadow-lg hover:shadow-primary/5"
  >
    <div className="aspect-[16/10] overflow-hidden">
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          width={960}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div aria-hidden className="flex h-full w-full items-end bg-gradient-to-br from-primary/25 via-primary/10 to-card p-4">
          <span className="font-display text-sm font-semibold text-primary/80">Cover coming</span>
        </div>
      )}
    </div>
    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-sm md:text-base font-semibold group-hover:text-primary transition-colors leading-snug line-clamp-2">
          {article.title}
        </h3>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
      </div>
      <p className="text-muted-foreground text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">{article.subtitle}</p>
    </div>
  </a>
);

const WritingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="writing" className="py-12 md:py-16 bg-card/50" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-3">
            Selected Writing
          </p>
          <h2 className="font-display text-[28px] md:text-5xl font-semibold">
            <span className="text-gradient">Writing</span>
          </h2>
        </motion.div>
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WritingSection;

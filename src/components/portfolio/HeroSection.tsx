import { motion } from "framer-motion";

import profileImage from "@/assets/profile.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />

      <div className="grid items-center gap-10 lg:grid-cols-[60fr_40fr] lg:gap-12">
        {/* Left column: text, aligned to the page content margin */}
        <div className="px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-0">
          <div className="max-w-2xl text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            >
              <p className="text-muted-foreground text-xs font-semibold mb-3 tracking-widest uppercase font-body">
                AI Lead: Strategy, Governance, Data Platforms
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
              className="font-display text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight"
            >
              I take AI from strategy to production -{" "}
              <span className="text-gradient">and make sure it stays there.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="text-muted-foreground text-base md:text-lg mb-6 font-body leading-relaxed"
            >
              Use-case portfolios, business cases, production systems - with validation, logging, and access controls built in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
            >
              <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        {/* Right column: visual, bleeds to the right edge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="order-last px-6 lg:px-0"
        >
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-secondary/40 lg:mx-0 lg:max-w-none lg:rounded-none lg:rounded-l-3xl">
            <img
              src={profileImage}
              alt="Conor Bliss"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";

import profileImage from "@/assets/portrait-city.jpg";

const chips = [
  "ISO 42001 certified",
  "AIGP Certified",
  "Strategy consulting",
  "ROI-focused delivery",
  "Cross-functional lead",
];

const CredentialPills = () => (
  <div className="flex flex-wrap gap-2">
    {chips.map((chip) => (
      <span
        key={chip}
        className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full"
      >
        {chip}
      </span>
    ))}
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-6 md:pt-28 md:pb-8">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />

      <div className="grid items-start gap-10 lg:grid-cols-[60fr_40fr] lg:items-center lg:gap-12">
        {/* Left column: text, aligned to the page content margin */}
        <div className="px-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2.5rem))] lg:pr-0">
          <div className="max-w-3xl text-left">
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
              className="font-display text-[26px] leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
            >
              I take AI programmes past the data and compliance hurdles:{" "}
              <span className="text-gradient">into production, and kept there.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="text-muted-foreground text-base md:text-lg mb-5 md:mb-6 font-body leading-relaxed"
            >
              Data foundations that clear legal, and AI governance that passes external audit.
            </motion.p>

            {/* Mobile: pills + portrait side by side */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              className="lg:hidden"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0 pt-1">
                  <CredentialPills />
                </div>
                <div className="w-36 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary/40">
                  <img
                    src={profileImage}
                    alt="Conor Bliss"
                    className="aspect-[4/5] w-full object-cover object-[42%_28%] scale-[1.08] origin-top"
                  />
                </div>
              </div>
            </motion.div>

            {/* Desktop: pills only */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              className="hidden lg:block mt-6"
            >
              <CredentialPills />
            </motion.div>
          </div>
        </div>

        {/* Right column: desktop portrait only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="hidden lg:block order-last px-6 pt-6 md:pt-2 lg:pr-[max(2rem,calc((100vw-80rem)/2+2.5rem))]"
        >
          <div className="mx-auto w-full max-w-[12rem] overflow-hidden rounded-2xl bg-secondary/40 sm:max-w-[14rem] md:max-w-[16rem] lg:mx-0 lg:ml-auto lg:max-w-[20rem]">
            <img
              src={profileImage}
              alt="Conor Bliss"
              className="aspect-square sm:aspect-[3/4] w-full object-cover object-[center_25%] sm:object-top scale-[1.12] origin-top"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";
import profileImage from "@/assets/profile.png";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-28 pb-8 md:pt-32 md:pb-8">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      {/* Floating accent orbs - smaller and more subtle */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6"
        >
          <img 
            src={profileImage} 
            alt="Conor Bliss" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-sm md:text-base mb-3 tracking-widest uppercase font-body">
            AI Lead — Strategy, Governance, Data Platforms
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="font-display text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 max-w-6xl mx-auto leading-tight"
        >
          I turn AI strategy into systems that ship —{" "}
          <span className="text-gradient">and the governance</span> that keeps them live.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-3xl mx-auto mb-4 font-body px-2"
        >
          From use-case portfolios and ROI models to production systems with validation, logging, rollback, and controlled access.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center px-4">
            {["AI Strategy", "ISO 42001 Certified", "External Pentest Passed", "C1 Swedish", "Stockholm-based"].map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full"
              >
                {chip}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 justify-center px-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            View Work
          </a>
          <a
            href="https://www.linkedin.com/in/conor-bliss/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border rounded-lg font-medium hover:bg-secondary transition-colors text-sm"
          >
            LinkedIn
          </a>
          <a
            href="https://medium.com/@conor.bliss.henaghan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border rounded-lg font-medium hover:bg-secondary transition-colors text-sm"
          >
            Writing
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

import { motion } from "framer-motion";
import profileImage from "@/assets/profile.png";

const HeroSection = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16">
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <img 
            src={profileImage} 
            alt="Conor Henaghan" 
            className="w-20 h-20 md:w-28 md:h-28 rounded-full mx-auto object-cover border-4 border-primary/20 shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <p className="text-muted-foreground text-sm md:text-base mb-3 tracking-widest uppercase font-body">
            Applied AI & Governance Lead
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4 max-w-4xl mx-auto leading-tight"
        >
          I design AI systems so organizations can{" "}
          <span className="text-gradient">trust decisions</span> before they scale them.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4 font-body px-2"
        >
          Built for production constraints: validation, logging, rollback, and controlled access.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="mb-8"
        >
          <p className="text-primary font-medium text-sm sm:text-base">
            Systems adopted as organizational defaults.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-3 justify-center px-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Projects
          </a>
          <a
            href="https://www.linkedin.com/in/conor-bliss/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors text-sm"
          >
            LinkedIn
          </a>
          <a
            href="https://medium.com/@conor.bliss.henaghan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-secondary transition-colors text-sm"
          >
            Writing
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

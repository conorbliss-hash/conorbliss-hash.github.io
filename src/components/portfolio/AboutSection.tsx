import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-10 md:py-12" ref={ref}>
      <div className="section-container">
        {/* Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            About
          </p>
          <div className="space-y-5 text-foreground font-body text-base md:text-lg leading-loose">
            <p>
              I'm an AI Lead based in Stockholm. I've spent the last few years doing the full stack of AI work that most people split across three roles: defining strategy, building the data infrastructure, and shipping production systems.
            </p>
            <p>
              I also support external audit readiness and governance work. I hold AIGP certification and have helped a company through ISO 42001 certification with Schellman. I work in English and Swedish (C1).
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

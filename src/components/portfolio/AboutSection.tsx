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
          <p className="text-foreground font-body text-base md:text-lg leading-relaxed">
            I'm an AI Lead based in Stockholm, working across AI strategy, governance, data infrastructure, and production automation. Recent work includes shaping an AI use-case portfolio and pilot roadmap, leading ISO 42001 certification, building a multi-source business intelligence platform, and shipping production automation. I operate across engineering, compliance, and executive stakeholders in English and Swedish (C1).
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

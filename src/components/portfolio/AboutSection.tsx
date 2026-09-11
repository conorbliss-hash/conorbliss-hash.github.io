import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-10 md:py-12" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-[38ch] text-left sm:max-w-[62ch]"
        >
          <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-3">
            About
          </p>
          <div className="border-b border-border mb-8" />
          <div className="space-y-5 text-foreground font-body text-base md:text-lg leading-loose">
            <p>
              I'm an AI Lead based in Stockholm. I set AI strategy, build the data infrastructure it runs on, and ship the production systems on top.
            </p>
            <p>
              I take those systems through external audit. I hold AIGP certification and have taken an organisation through ISO 42001 certification. I work in English and Swedish (C1).
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

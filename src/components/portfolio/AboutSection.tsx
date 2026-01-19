import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
              About Me
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
              Passionate About
              <br />
              <span className="text-gradient">Great Design</span>
            </h2>
            <div className="space-y-4 text-muted-foreground font-body">
              <p>
                With over 5 years of experience in web development, I specialize 
                in creating modern, performant applications that users love. 
              </p>
              <p>
                I believe great products come from the intersection of beautiful 
                design and clean code. Every project is an opportunity to craft 
                something meaningful.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, 
                contributing to open source, or enjoying a good cup of coffee.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div 
              className="aspect-square rounded-2xl overflow-hidden"
              style={{ background: "var(--gradient-card)" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-5xl">👨‍💻</span>
                  </div>
                  <p className="text-2xl font-display font-semibold mb-2">Your Name</p>
                  <p className="text-muted-foreground">Developer & Designer</p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-primary/20 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
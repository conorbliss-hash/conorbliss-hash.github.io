import React from 'react'
import siteData from '@/lib/content/site.json'

export default function SkillsSection() {
  // Fallback simple skills rendering
  const skills = siteData.skills || []
  return (
    <section className="py-8">
      <h2>Skills</h2>
      <ul>
        {skills.map((s: any, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </section>
  )
}
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "UI/UX Design", level: 80 },
  { name: "PostgreSQL", level: 75 },
  { name: "AWS / Cloud", level: 70 },
];

const SkillBar = ({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: "var(--gradient-accent)" }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32 bg-card/50" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
              Expertise
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
              Skills & <span className="text-gradient">Technologies</span>
            </h2>
            <p className="text-muted-foreground font-body mb-8">
              I'm constantly learning and adapting to new technologies. Here's 
              a snapshot of my current technical expertise and the tools I use 
              to bring ideas to life.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {["⚛️ React", "📘 TypeScript", "🎨 Tailwind", "🚀 Next.js", "🗄️ PostgreSQL", "☁️ AWS"].map((tech) => (
                <div 
                  key={tech}
                  className="px-4 py-3 bg-secondary rounded-lg text-center text-sm"
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {skills.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
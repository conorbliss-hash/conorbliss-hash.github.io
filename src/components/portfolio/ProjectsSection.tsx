import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Plus, Github } from "lucide-react";

const professionalProjects = [
  {
    title: "Governed Reporting Automation",
    subtitle: "Recurring monthly reporting, multi-team",
    tags: ["AI Governance", "Operating Model", "Validation"],
    outcome: "Consistent outputs with reduced manual effort",
  },
  {
    title: "Quality Controls for AI-Assisted Deliverables",
    subtitle: "Decision support for ambiguous business questions",
    tags: ["Decision Architecture", "Enablement", "Governance"],
    outcome: "Improved clarity and speed of decision-making",
  },
  {
    title: "Data Ingestion Gate for Remuneration Datasets",
    subtitle: "Client-data environment, validation and audit",
    tags: ["Data Authority", "Audit", "Risk Prevention"],
    outcome: "Safer foundations for automation and analysis",
  },
];

const openSourceProject = {
  title: "Health Coach",
  subtitle: "Google Fit → Google Sheets",
  tags: ["Data Governance", "Validation", "Audit"],
  description: "A fully open-source personal system that transforms raw activity data into structured, actionable guidance.",
  details: [
    "Built as a fully transparent, end-to-end system with clear boundaries between data ingestion, logic, and output.",
    "Demonstrates governance principles I apply at organizational scale: schema validation, deterministic transforms, and audit-ready outputs."
  ],
  techTags: ["Open Source", "Data Pipeline", "Health Tech"],
  link: "#"
};

const ProjectCard = ({ project, index }: { project: typeof professionalProjects[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-semibold mb-1">{project.title}</h3>
          <p className="text-muted-foreground text-sm">{project.subtitle}</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span 
            key={tag}
            className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-muted-foreground text-sm font-body">{project.outcome}</p>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const openSourceRef = useRef(null);
  const openSourceInView = useInView(openSourceRef, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-32" ref={ref}>
      <div className="section-container">
        {/* Professional Systems */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            Professional <span className="text-gradient">Systems</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {professionalProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* Open Source Featured */}
        <div ref={openSourceRef}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={openSourceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-2">
              Featured
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-semibold">
              Open <span className="text-gradient">Source</span>
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={openSourceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-4xl mx-auto p-8 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-display text-2xl font-semibold mb-1">{openSourceProject.title}</h4>
                <p className="text-muted-foreground">{openSourceProject.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {openSourceProject.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-foreground font-body mb-4">{openSourceProject.description}</p>
            
            <ul className="space-y-2 mb-6">
              {openSourceProject.details.map((detail, i) => (
                <li key={i} className="text-muted-foreground text-sm font-body pl-4 border-l-2 border-primary/30">
                  {detail}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mb-6">
              {openSourceProject.techTags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a 
              href={openSourceProject.link}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Github className="w-4 h-4" />
              View Project
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

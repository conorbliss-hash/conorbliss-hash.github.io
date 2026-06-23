import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus, Github } from "lucide-react";

interface ProjectDetail {
  context: string;
  systemDesign: string;
  keyDecisions: string[];
  governanceRisk: string[];
  outcome: string[];
}

const professionalProjects = [
  {
    id: "bi-platform",
    title: "Business Intelligence Platform",
    subtitle: "Unified executive reporting across CRM, finance, and operations",
    tags: ["Data Architecture", "Analytics", "Automation"],
    outcome: "Real-time executive dashboard replacing manual cross-system reporting",
    metric: "3 source systems unified; manual reconciliation removed from leadership reporting",
    mechanism: "HubSpot + Salesforce + NetSuite → Cloud Functions → Firestore → custom front-end",
    delta: "Three disconnected systems unified into a single source of truth"
  },
  {
    id: "iso-42001",
    title: "ISO 42001 Validated Governance Framework",
    subtitle: "First AI management system certification across the portfolio",
    tags: ["AI Governance", "Compliance", "Risk"],
    outcome: "Passed external ISO 42001 audit (Schellman) — production AI systems certified compliant",
    metric: "External Schellman audit passed; production AI governance baseline established",
    mechanism: "Risk registry  |  model documentation  |  human oversight controls  |  audit trail",
    delta: "Framework governs all production AI systems, serves as compliance baseline"
  },
  {
    id: "data-platform",
    title: "Centralized Data Platform",
    subtitle: "GDPR-compliant data foundation, validated by external penetration test",
    tags: ["Data Infrastructure", "Security", "GDPR"],
    outcome: "Passed external penetration test with zero critical findings",
    metric: "0 critical pentest findings; GDPR-ready controls validated before rollout",
    mechanism: "Ingestion pipeline  |  schema validation  |  access controls  |  audit logging",
    delta: "Foundation for all downstream AI and reporting systems"
  },
  {
    id: "slide-generator",
    title: "Slide Generator",
    subtitle: "Automated presentation generation from structured data inputs",
    tags: ["Automation", "LLM Integration", "Google Workspace"],
    outcome: "Presentation-ready outputs generated in minutes, replacing hours of manual work",
    metric: "Recurring reporting slides generated in minutes instead of hours",
    mechanism: "Google Apps Script  +  Gemini API  +  structured template engine",
    delta: "Used across multiple reporting cycles with human review checkpoint before distribution"
  },
];

const projectDetails: Record<string, ProjectDetail> = {
  "bi-platform": {
    context: "Three disconnected systems (CRM, ERP, finance) produced conflicting numbers and required manual reconciliation before each leadership meeting. Built a unified ingestion pipeline with automated transformation and a live dashboard.",
    systemDesign: "HubSpot + Salesforce + NetSuite → Cloud Functions → automated transformation → Firestore → custom front-end dashboard",
    keyDecisions: [
      "Single ingestion pipeline across three source systems to eliminate manual reconciliation",
      "Automated transformation layer ensures consistent data definitions across CRM, ERP, and finance",
      "Real-time updates replace batch reporting — no analyst time spent on data prep",
      "Custom front-end built for executive consumption, not technical users"
    ],
    governanceRisk: [
      "Ownership mapping across all three source systems",
      "Transformation logic versioned and auditable",
      "Access controls scoped by role — executives see aggregates, not raw records",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Leadership has a single source of truth, updated in real time",
      "No analyst time spent on data prep before leadership meetings",
      "Conflicting numbers across systems eliminated"
    ]
  },
  "iso-42001": {
    context: "Designed and implemented an AI governance framework from scratch, covering risk classification, model documentation, human oversight requirements, and incident response procedures.",
    systemDesign: "Risk registry → model documentation → human oversight controls → incident response procedures → audit trail → external audit (Schellman)",
    keyDecisions: [
      "Risk-based classification of all production AI systems before framework design",
      "Human oversight requirements defined per risk tier — not a blanket policy",
      "Audit trail architecture designed to satisfy external auditor requirements from day one",
      "Framework scoped to cover all production AI systems, not just high-risk ones"
    ],
    governanceRisk: [
      "Commissioned and passed Schellman external audit with no major findings",
      "Framework now governs all production AI systems",
      "Serves as the compliance baseline for all new AI deployments",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Passed external ISO 42001 audit (Schellman) — production AI systems certified compliant",
      "AI governance framework now serves as organizational default for new deployments",
      "Compliance baseline established for ongoing AI risk management"
    ]
  },
  "data-platform": {
    context: "Built the core data infrastructure underpinning analytics and AI workflows: structured ingestion with validation gates, ownership mapping, least-privilege access controls, and full audit logging.",
    systemDesign: "Ingestion layer → schema validation → ownership/lineage mapping → access controls (least-privilege) → audit logging → curated data layer → downstream AI and reporting systems",
    keyDecisions: [
      "Reject or flag bad data at ingestion — not downstream where the cost is higher",
      "Explicit ownership assignment for every data entity before it enters the platform",
      "Least-privilege access: consumers only see what they need",
      "Full audit logging from day one — not retrofitted after the pentest"
    ],
    governanceRisk: [
      "Commissioned and passed external penetration test with zero critical findings",
      "All findings addressed before production rollout",
      "GDPR-compliant by design: data categories mapped, access controls enforced",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Passed external penetration test with zero critical findings",
      "GDPR-compliant data foundation for all downstream AI and reporting systems",
      "Security posture validated independently before production rollout"
    ]
  },
  "slide-generator": {
    context: "Repetitive slide production was consuming significant analyst time across recurring reporting cycles. Built an automated generator that takes structured data inputs, applies business logic and formatting rules, and produces presentation-ready slides.",
    systemDesign: "Structured data inputs → Google Apps Script → business logic and formatting rules → Gemini API (narrative layer) → presentation-ready slides → human review checkpoint → distribution",
    keyDecisions: [
      "Deterministic formatting layer separated from AI-assisted narrative layer",
      "Structured template engine enforces consistency across report types",
      "Human review checkpoint before distribution — AI is not the final decision-maker",
      "Google Workspace stack chosen for zero adoption friction"
    ],
    governanceRisk: [
      "Human review gate before any outputs are distributed",
      "AI-assisted narrative layer is advisory — formatting logic is deterministic",
      "Versioned templates ensure consistency across reporting cycles",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Presentation-ready outputs generated in minutes, replacing hours of manual work",
      "Used across multiple recurring reporting cycles",
      "Deterministic and AI-assisted layers kept separate for auditability"
    ]
  }
};

const openSourceProject = {
  title: "Open-source governance demo: Health Coach",
  subtitle: "Google Fit → Google Sheets",
  description: "A compact demo of schema validation, audit logging, and automated reporting patterns applied to personal health data.",
  badges: ["Open source", "Daily automated sync", "Validation gates", "Audit-ready outputs"],
  link: "https://github.com/conorbliss/health-coach"
};

const ProjectCard = ({ 
  project, 
  index,
  isExpanded,
  onToggle 
}: { 
  project: typeof professionalProjects[0]; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const details = projectDetails[project.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className="group relative p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="font-display text-xl font-semibold mb-1">{project.title}</h3>
          <p className="text-muted-foreground text-sm">{project.subtitle}</p>
        </div>
        <button 
          onClick={onToggle}
          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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

      <p className="text-muted-foreground text-sm font-body mb-2">{project.outcome}</p>
    <p className="text-sm text-foreground font-medium mb-2">{project.metric}</p>
      <p className="text-xs text-primary/70 font-medium">{project.mechanism}</p>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-border space-y-5">
              {/* Context */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Context</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{details.context}</p>
              </div>

              {/* System Design */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">System Design</h4>
                <p className="text-sm text-muted-foreground leading-relaxed font-mono text-xs">{details.systemDesign}</p>
              </div>

              {/* Key Decisions */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Key Decisions</h4>
                <ul className="space-y-1.5">
                  {details.keyDecisions.map((decision, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-primary/40">
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Governance & Risk */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Governance & Risk</h4>
                <ul className="space-y-1.5">
                  {details.governanceRisk.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-muted-foreground/30">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcomes */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Outcomes</h4>
                <ul className="space-y-1.5">
                  {details.outcome.map((item, i) => (
                    <li key={i} className="text-sm text-primary/80 pl-3 border-l-2 border-primary/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const openSourceRef = useRef(null);
  const openSourceInView = useInView(openSourceRef, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projects" className="py-16 md:py-32" ref={ref}>
      <div className="section-container">
        {/* Professional Systems */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            Professional <span className="text-gradient">Systems</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-24">
          {professionalProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
              isExpanded={expandedId === project.id}
              onToggle={() => handleToggle(project.id)}
            />
          ))}
        </div>

        {/* Open Source Demo */}
        <div ref={openSourceRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={openSourceInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-2">
              Open Source
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-semibold">
              Governance patterns, <span className="text-gradient">publicly visible</span>
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={openSourceInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="flex-1">
                <h4 className="font-display text-xl sm:text-2xl font-semibold mb-1">{openSourceProject.title}</h4>
                <p className="text-muted-foreground text-sm mb-3">{openSourceProject.subtitle}</p>
                <p className="text-foreground font-body text-sm sm:text-base mb-4">{openSourceProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  {openSourceProject.badges.map((badge) => (
                    <span key={badge} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <a 
                href={openSourceProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

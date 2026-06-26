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
    id: "ai-strategy-roadmap",
    title: "AI Strategy & Use Case Portfolio",
    subtitle: "Prioritized AI roadmap for investment decisions",
    tags: ["AI Strategy", "Business Cases", "Pilot Roadmap"],
    outcome: "Turned scattered AI requests from 10+ departments into a ranked portfolio with business cases, owners, success metrics, and two selected pilots.",
    metric: "20+ opportunities assessed; two pilots selected; seven-figure annual efficiency opportunity identified",
    mechanism: "Department interviews | workflow baselines | impact/effort scoring | build-vs-buy review | pilot roadmap",
    delta: "Turned scattered AI demand into an executable portfolio and governance-backed roadmap"
  },
  {
    id: "bi-platform",
    title: "Business Intelligence Platform",
    subtitle: "Live reporting layer for leadership decisions",
    tags: ["System Integration", "Executive Reporting", "Automation"],
    outcome: "Connected CRM, finance, and operations data so leadership could review one consistent view instead of reconciling reports manually.",
    metric: "3 source systems unified; manual reconciliation removed from leadership reporting",
    mechanism: "Automated data ingestion | transformation rules | Firestore | role-scoped dashboard",
    delta: "Three disconnected systems unified into one consistent reporting view"
  },
  {
    id: "iso-42001",
    title: "ISO 42001 Validated Governance Framework",
    subtitle: "Controls for production AI, validated by external audit",
    tags: ["AI Governance", "External Audit", "Risk Controls"],
    outcome: "Built the framework used to classify AI risk, document systems, assign human oversight, and maintain an audit trail for production AI use.",
    metric: "External Schellman audit passed; production AI governance baseline established",
    mechanism: "Risk registry | model documentation | human oversight rules | incident response | audit trail",
    delta: "Framework governs all production AI systems, serves as compliance baseline"
  },
  {
    id: "data-platform",
    title: "Centralized Data Infrastructure",
    subtitle: "Secure data layer for analytics and AI workflows",
    tags: ["Data Infrastructure", "Access Controls", "Audit Logging"],
    outcome: "Built the ingestion, validation, access-control, and logging layer needed to make internal data usable for reporting and AI systems.",
    metric: "External penetration test passed with zero critical findings before rollout",
    mechanism: "Data ingestion | schema validation | ownership mapping | access controls | audit logging",
    delta: "Foundation for all downstream AI and reporting systems"
  },
];

const projectDetails: Record<string, ProjectDetail> = {
  "ai-strategy-roadmap": {
    context: "A multi-department organization had strong AI demand but fragmented experimentation, uneven data readiness, and no shared prioritization model. Led the strategy work to turn scattered ideas into an executive-ready portfolio of AI initiatives with quantified business cases and a staged implementation roadmap.",
    systemDesign: "Department interviews → KPI baselines → impact/effort scoring → PRDs + business cases → pilot selection → governance model → delivery roadmap",
    keyDecisions: [
      "Interviewed leaders across 10+ business departments to map current workflows, pain points, and adoption readiness",
      "Structured 20+ AI opportunities into product requirement documents and business cases",
      "Ranked use cases by annual savings, feasibility, and build-vs-buy suitability rather than novelty",
      "Selected two quick-win pilots where value, data access, and stakeholder ownership were strongest"
    ],
    governanceRisk: [
      "Identified shadow AI usage already occurring across departments and proposed centralized governance controls",
      "Separated near-term pilots from initiatives blocked by foundational data centralization work",
      "Defined human review, data ownership, and KPI measurement requirements before build",
      "Details redacted and generalized to protect employer context"
    ],
    outcome: [
      "Executive steering group received a clear go/no-go decision package for the next AI investment stage",
      "Seven-figure annual efficiency opportunity surfaced across the highest-impact use cases",
      "Two pilots moved forward with scoped PRDs, target KPIs, owners, and delivery timeline"
    ]
  },
  "bi-platform": {
    context: "Three disconnected systems (CRM, ERP, finance) produced conflicting numbers and required manual reconciliation before each leadership meeting. Built a unified ingestion pipeline with automated transformation and a live dashboard.",
    systemDesign: "HubSpot + Salesforce + NetSuite → Cloud Functions → automated transformation → Firestore → custom front-end dashboard",
    keyDecisions: [
      "Single ingestion pipeline across three source systems to eliminate manual reconciliation",
      "Automated transformation layer ensures consistent data definitions across CRM, ERP, and finance",
      "Real-time updates replace batch reporting, with no analyst time spent on data prep",
      "Custom front-end built for executive consumption, not technical users"
    ],
    governanceRisk: [
      "Ownership mapping across all three source systems",
      "Transformation logic versioned and auditable",
      "Access controls scoped by role, so executives see aggregates, not raw records",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Leadership has one consistent reporting view, updated in real time",
      "No analyst time spent on data prep before leadership meetings",
      "Conflicting numbers across systems eliminated"
    ]
  },
  "iso-42001": {
    context: "Designed and implemented an AI governance framework from scratch, covering risk classification, model documentation, human oversight requirements, and incident response procedures.",
    systemDesign: "Risk registry → model documentation → human oversight controls → incident response procedures → audit trail → external audit (Schellman)",
    keyDecisions: [
      "Risk-based classification of all production AI systems before framework design",
      "Human oversight requirements defined per risk tier, not as a blanket policy",
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
      "Passed external ISO 42001 audit (Schellman), certifying production AI systems as compliant",
      "AI governance framework now serves as organizational default for new deployments",
      "Compliance baseline established for ongoing AI risk management"
    ]
  },
  "data-platform": {
    context: "Built the core data infrastructure underpinning analytics and AI workflows: structured ingestion with validation gates, ownership mapping, least-privilege access controls, and full audit logging.",
    systemDesign: "Ingestion layer → schema validation → ownership/lineage mapping → access controls (least-privilege) → audit logging → curated data layer → downstream AI and reporting systems",
    keyDecisions: [
      "Reject or flag bad data at ingestion, not downstream where the cost is higher",
      "Explicit ownership assignment for every data entity before it enters the platform",
      "Least-privilege access: consumers only see what they need",
      "Full audit logging from day one, not retrofitted after the pentest"
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
  }
};

const openSourceProject = {
  title: "Open-source governance demo: Health Coach",
  subtitle: "Google Fit → Google Sheets",
  description: "A compact demo of schema validation, audit logging, and automated reporting patterns applied to personal health data.",
  badges: ["Open source", "Daily automated sync", "Validation gates", "Audit-ready outputs"],
  link: "https://github.com/conorbliss-hash/health-coach"
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
      
      <p className="text-sm text-foreground font-semibold mb-1">{project.metric}</p>
      <p className="text-muted-foreground text-sm font-body mb-3">{project.outcome}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {project.tags.map((tag) => (
          <span 
            key={tag}
            className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

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

              {/* Approach */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Approach</h4>
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
    <section id="projects" className="py-12 md:py-16" ref={ref}>
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
            Systems & <span className="text-gradient">Strategy</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mt-4 font-body">
            Selected work turning AI priorities into governed systems, usable data, and measurable business outcomes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-14">
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

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Plus, Minus, Github, ArrowRight, Shield, FileText, Clock, Database, CheckCircle, Activity } from "lucide-react";

interface ProjectDetail {
  context: string;
  systemDesign: string;
  keyDecisions: string[];
  governanceRisk: string[];
  outcome: string[];
}

const professionalProjects = [
  {
    id: "workflow-automation",
    title: "Governed Reporting Automation",
    subtitle: "Recurring monthly reporting, multi-team",
    tags: ["AI Governance", "Operating Model", "Validation"],
    outcome: "Leadership gets consistent outputs without scaling headcount",
    mechanism: "Schema validation + human-in-loop approval gate",
    delta: "Reduced cycle time 60–80%, fewer escalations"
  },
  {
    id: "decision-support",
    title: "Quality Controls for AI-Assisted Deliverables",
    subtitle: "Decision support for ambiguous business questions",
    tags: ["Decision Architecture", "Enablement", "Governance"],
    outcome: "Executives can trust AI-assisted recommendations",
    mechanism: "Structured reasoning trace + audit logging",
    delta: "Faster decisions, defensible rationale on file"
  },
  {
    id: "governed-data",
    title: "Pre-Ingestion Validation Gate",
    subtitle: "Regulated data environments, validation and audit",
    tags: ["Data Authority", "Audit", "Risk Prevention"],
    outcome: "Bad data stopped before it creates downstream risk",
    mechanism: "Rejection gate + ownership registry + rollback",
    delta: "Fewer ingestion failures, audit-ready from day one"
  },
  {
    id: "anomaly-detection",
    title: "Outlier Detection for Sensitive Datasets",
    subtitle: "High-stakes data, ML-driven flagging",
    tags: ["ML Ops", "Risk Detection", "Data Governance"],
    outcome: "Leadership sees anomalies before they reach reports",
    mechanism: "Unsupervised model + threshold flagging + writeback to source",
    delta: "Proactive identification vs reactive investigation"
  },
];

const projectDetails: Record<string, ProjectDetail> = {
  "workflow-automation": {
    context: "Recurring reporting burden emerged from messy operational inputs that required manual synthesis. System designed to automate deterministic portions while containing AI usage to ambiguous summarization tasks only.",
    systemDesign: "Intake layer → normalization and validation → deterministic pipeline for structured transforms → AI boundary for ambiguous summarization → output generation (documents/slides/reports) → human review checkpoint before distribution.",
    keyDecisions: [
      "Deterministic-first approach: AI only where ambiguity genuinely exists",
      "Schema constraints enforce structured inputs and prevent drift",
      "Human review gate before any outputs leave the system",
      "Versioned audit trail of inputs and outputs for accountability"
    ],
    governanceRisk: [
      "Auditability: all inputs and outputs logged with timestamps",
      "Versioned transformations enable rollback and investigation",
      "No client data shown. Details abstracted.",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Reduced manual effort in recurring reporting workflows",
      "More consistent output quality across report cycles",
      "Clear boundaries between deterministic and AI-assisted steps"
    ]
  },
  "decision-support": {
    context: "Ambiguous business questions lacked repeatable decision logic, leading to inconsistent narratives. System translates open-ended inputs into structured, reviewable recommendations with explicit reasoning chains.",
    systemDesign: "Structured intake form → rubric/framework application → constrained generation with explicit criteria → reviewable recommendation output → decision narrative with reasoning → human checkpoint for final approval.",
    keyDecisions: [
      "Explicit gates and kill-criteria defined upfront for each decision type",
      "Transparency in reasoning: show how inputs map to recommendations",
      "Separation of facts (data) vs suggestions (AI-assisted interpretation)",
      "Structured templates enforce consistency across decision types"
    ],
    governanceRisk: [
      "Traceability of all inputs to outputs via decision logs",
      "Human checkpoints at recommendation stage before any action",
      "No client data shown. Details abstracted.",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Faster clarity on ambiguous questions",
      "Improved consistency of decision narratives",
      "Reviewable reasoning chains enable better stakeholder communication"
    ]
  },
  "governed-data": {
    context: "Unvalidated data creates downstream risk for AI and automation systems. Designed validation, ownership mapping, and audit-ready ingestion layers to establish safer foundations for analytics and automation workflows.",
    systemDesign: "Ingestion layer → validation rules (schema, range, consistency checks) → ownership/lineage mapping → audit log generation → curated data layer → controlled access for downstream consumers.",
    keyDecisions: [
      "Reject or flag bad data early at ingestion boundaries",
      "Explicit ownership assignment for every data entity",
      "Minimal access principle: consumers only see what they need",
      "Reversible transformations to enable root cause investigation"
    ],
    governanceRisk: [
      "Audit trails capture all data movements and transformations",
      "Access control boundaries enforce least-privilege principles",
      "No client data shown. Details abstracted.",
      "Anonymized by design: no client-specific schemas shown"
    ],
    outcome: [
      "Safer foundations for downstream automation and AI systems",
      "Reduced risk from unvalidated or unowned data",
      "Clear audit trail enables compliance and investigation workflows"
    ]
  },
  "anomaly-detection": {
    context: "High-stakes datasets require proactive quality checks before downstream reporting. Manual review cannot scale. Designed an ML-driven anomaly detection system to flag outliers early, reducing reactive investigation cycles.",
    systemDesign: "Feature engineering layer (ratios, normalizations) → unsupervised model training → anomaly scoring → threshold-based flagging → writeback to source system → human review queue for flagged records.",
    keyDecisions: [
      "Unsupervised approach: no labeled training data required",
      "Feature engineering focused on domain-relevant ratios and comparisons",
      "Contamination parameter tuned to expected outlier rate",
      "Scores persisted for audit trail and threshold adjustment"
    ],
    governanceRisk: [
      "All flagged records logged with scores for review",
      "Model outputs are advisory, not autonomous—human review required",
      "No client data shown. Details abstracted.",
      "Threshold adjustments versioned and documented"
    ],
    outcome: [
      "Early visibility into data anomalies",
      "Reduced reactive investigation cycles",
      "Audit-ready flagging with explainable scores"
    ]
  }
};

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
  link: "https://github.com/conorbliss/health-coach"
};

const pipelineSteps = [
  { label: "Google Fit API", icon: Activity },
  { label: "Sync Engine", icon: Clock },
  { label: "Validation Gate", icon: Shield },
  { label: "Google Sheets", icon: Database },
  { label: "Weekly Reports", icon: FileText },
];

const governanceBadges = [
  { label: "Schema Validation", icon: CheckCircle },
  { label: "Audit Logging", icon: FileText },
  { label: "Decision Log", icon: Shield },
  { label: "Cron Automation", icon: Clock },
  { label: "Data Ownership", icon: Database },
];

const maturityMetrics = [
  { value: "14+", label: "Docs" },
  { value: "5", label: "Pipeline Stages" },
  { value: "Daily", label: "Automated Sync" },
  { value: "100%", label: "Open Source" },
];

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

        {/* Open Source Featured */}
        <div ref={openSourceRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={openSourceInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
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
            initial={{ opacity: 0 }}
            animate={openSourceInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="max-w-4xl mx-auto p-5 sm:p-8 rounded-2xl border border-border bg-card"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h4 className="font-display text-2xl font-semibold mb-1">{openSourceProject.title}</h4>
                <p className="text-muted-foreground">{openSourceProject.subtitle}</p>
              </div>
              <a 
                href={openSourceProject.link}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shrink-0"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>

            <p className="text-foreground font-body mb-2">{openSourceProject.description}</p>
            <p className="text-sm text-primary/70 italic mb-6">Same governance patterns I apply at organizational scale — fully transparent.</p>

            {/* Architecture Pipeline — lightweight */}
            <div className="mb-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Data Pipeline</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-center text-sm">
                {pipelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <span key={step.label} className="inline-flex items-center gap-1.5 text-foreground/80">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium">{step.label}</span>
                      {i < pipelineSteps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-muted-foreground ml-1" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Metrics + Governance — compact */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Project Maturity</p>
                <div className="grid grid-cols-2 gap-3">
                  {maturityMetrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <p className="text-lg font-display font-semibold text-primary">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Governance Controls</p>
                <div className="flex flex-wrap gap-1.5">
                  {governanceBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <span key={badge.label} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-primary/80 rounded-full bg-primary/5">
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import aiStrategyImage from "@/assets/projects/ai-strategy.jpg";
import biPlatformImage from "@/assets/projects/bi-platform.jpg";
import isoGovernanceImage from "@/assets/projects/iso-governance.jpg";
import dataPlatformImage from "@/assets/projects/data-platform.jpg";

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
    outcome: "Turned 23 use cases into a governed investment roadmap across four countries.",
    metric: "Seven-figure annual savings pipeline across 10+ departments",
    category: "Strategy",
    image: aiStrategyImage,
    imageAlt: "Impact versus effort chart showing 23 candidate use cases prioritized into 2 funded pilots",
  },
  {
    id: "bi-platform",
    title: "Business Intelligence Platform",
    subtitle: "Live reporting layer for leadership decisions",
    outcome: "Unified CRM, finance and operations data into one leadership view.",
    metric: "3 source systems unified; manual reconciliation removed from leadership reporting",
    category: "Intelligence",
    image: biPlatformImage,
    imageAlt: "Executive analytics display combining several data streams",
  },
  {
    id: "iso-42001",
    title: "ISO 42001 Validated Governance Framework",
    subtitle: "Controls for production AI, validated by external audit",
    outcome: "Aligned Technology, Legal and Compliance around one auditable framework.",
    metric: "External Schellman audit passed; production AI governance baseline established",
    category: "Governance",
    image: isoGovernanceImage,
    imageAlt: "AI governance audit evidence arranged in a modern boardroom",
  },
  {
    id: "data-platform",
    title: "Centralized Data Infrastructure",
    subtitle: "Secure data layer for analytics and AI workflows",
    outcome: "Built the secure data layer supporting reporting and production AI.",
    metric: "External penetration test passed with zero critical findings before rollout",
    category: "Infrastructure",
    image: dataPlatformImage,
    imageAlt: "Secure centralized data infrastructure in a bright modern facility",
  },
];

const projectDetails: Record<string, ProjectDetail> = {
  "ai-strategy-roadmap": {
    context: "Strong AI demand across departments, but fragmented experimentation and no shared prioritization model. I turned scattered ideas into an executive-ready portfolio with quantified business cases and a staged roadmap.",
    systemDesign: "Department interviews → KPI baselines → impact/effort scoring → PRDs + business cases → pilot selection → governance model → delivery roadmap",
    keyDecisions: [
      "Mapped workflows, pain points, and adoption readiness across 10+ departments",
      "Structured 20+ AI opportunities into product requirement documents and business cases",
      "Ranked use cases by annual savings, feasibility, and build-vs-buy fit",
      "Selected two quick-win pilots with the strongest value, data access, and ownership"
    ],
    governanceRisk: [
      "Mapped shadow AI usage and proposed centralized governance controls",
      "Separated near-term pilots from initiatives blocked by foundational data work",
      "Defined human review, ownership, and KPI requirements before build",
      "Details redacted and generalized to protect employer context"
    ],
    outcome: [
      "SteerCo received a clear go/no-go package for the next investment stage",
      "Seven-figure annual efficiency opportunity surfaced across the highest-impact use cases",
      "Two pilots moved forward with scoped PRDs, owners, and delivery timeline"
    ]
  },
  "bi-platform": {
    context: "Three disconnected systems produced conflicting numbers and required manual reconciliation before every leadership meeting. I built a unified ingestion pipeline and live dashboard.",
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
      "One consistent, real-time reporting view for leadership",
      "No analyst time spent on data prep before leadership meetings",
      "Conflicting numbers across systems eliminated"
    ]
  },
  "iso-42001": {
    context: "Designed and implemented an AI governance framework from scratch covering risk classification, model documentation, human oversight, and incident response.",
    systemDesign: "Risk registry → model documentation → human oversight controls → incident response procedures → audit trail → external audit (Schellman)",
    keyDecisions: [
      "Risk-based classification of all production AI systems before framework design",
      "Human oversight requirements defined per risk tier, not as a blanket policy",
      "Audit trail architecture designed to satisfy external auditor requirements from day one",
      "Framework scoped to cover all production AI systems, not just high-risk ones"
    ],
    governanceRisk: [
      "Passed Schellman external audit with no major findings",
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
    context: "Built the core data infrastructure for analytics and AI: structured ingestion, validation gates, ownership mapping, least-privilege access, and audit logging.",
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
    <motion.article
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className="group"
    >
      <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md bg-secondary">
        <img
          src={project.image}
          alt={project.imageAlt}
          width={1200}
          height={912}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
        />
        <span className="absolute right-4 top-4 rounded-sm border border-border/70 bg-card/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur-sm">
          {project.category}
        </span>
      </div>

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">0{index + 1} / {project.subtitle}</p>
          <h3 className="font-display text-xl font-semibold leading-snug md:text-2xl">{project.title}</h3>
          <p className="mt-3 max-w-xl text-base font-semibold leading-relaxed text-foreground">{project.metric}</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{project.outcome}</p>
        </div>
        <Button
          onClick={onToggle}
          variant="outline"
          size="icon"
          className="mt-7 h-9 w-9 shrink-0 rounded-full bg-card"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </Button>
      </div>

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
            <div className="mt-6 space-y-5 border-t border-border pt-6">
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
                <ul className="space-y-1.5 leading-relaxed">
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
                <ul className="space-y-1.5 leading-relaxed">
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
                <ul className="space-y-1.5 leading-relaxed">
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
    </motion.article>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projects" className="py-16 md:py-24" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-12 flex flex-col items-start justify-between gap-5 border-b border-border pb-8 md:mb-16 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Selected work</p>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Systems & Strategy</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Four case studies spanning strategy, governance, intelligence and infrastructure.
          </p>
        </motion.div>

        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-16">
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
      </div>
    </section>
  );
};


export default ProjectsSection;

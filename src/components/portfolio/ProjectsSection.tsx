import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import dataFoundationDiagram from "@/assets/diagrams/data-foundation-diagram.svg";
import markGovernance from "@/assets/diagrams/mark-02-governance.svg";
import markPortfolio from "@/assets/diagrams/mark-03-portfolio.svg";
import markBi from "@/assets/diagrams/mark-04-bi.svg";

interface ProjectDetail {
  context: string;
  systemDesign: string;
  keyDecisions: string[];
  governanceRisk: string[];
  outcome: string[];
}

const professionalProjects = [
  {
    id: "data-platform",
    title: "Compliant Data Foundation for AI",
    subtitle: "The foundation everything else runs on",
    outcome:
      "Aligned with Delivery, Legal, Compliance and IT; external penetration test passed with zero critical findings before rollout.",
    metric:
      "Three access perimeters with de-identification at every crossing - compliant by design, and built so it doesn't slow consulting delivery.",
    category: "Infrastructure",
    image: dataFoundationDiagram,
    imageAlt:
      "Three zones left to right: project-scoped ring, shared access layer and core store, with de-identification steps on the paths between them",
  },
  {
    id: "iso-42001",
    title: "ISO 42001 Validated Governance Framework",
    subtitle: "The controls that keep it compliant",
    outcome: "External audit passed. Technology, Legal and Compliance aligned around one auditable framework.",
    metric: "External audit passed with no major findings",
    category: "Governance",
    image: markGovernance,
    imageAlt: "Three identical bars with a solid disc beside them",
  },
  {
    id: "ai-strategy-roadmap",
    title: "AI Strategy & Use Case Portfolio",
    subtitle: "Where the capability gets pointed",
    outcome: "23 initiatives triaged into a governed roadmap across four countries.",
    metric: "23 initiatives triaged into a governed roadmap",
    category: "Strategy",
    image: markPortfolio,
    imageAlt: "Three tapering blocks narrowing left to right",
  },
  {
    id: "bi-platform",
    title: "Business Intelligence Platform",
    subtitle: "What leadership sees",
    outcome: "Three source systems unified; manual reconciliation removed from leadership reporting.",
    metric: "Three source systems unified",
    category: "Intelligence",
    image: markBi,
    imageAlt: "Three separate blocks feeding into a single framed panel containing three rows",
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
      "Modelled (not realised) seven-figure annual efficiency pipeline across the highest-impact use cases",
      "Two pilots moved forward with scoped PRDs, owners, and delivery timeline"
    ]
  },
  "bi-platform": {
    context: "Three disconnected systems produced conflicting numbers and required manual reconciliation before every leadership meeting. I built a unified ingestion pipeline and live dashboard.",
    systemDesign: "Three source systems → cloud functions → automated transformation → document store → custom front-end dashboard",
    keyDecisions: [
      "Single ingestion pipeline across three source systems to eliminate manual reconciliation",
      "Automated transformation layer ensures consistent data definitions across all sources",
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
    systemDesign: "Risk registry → model documentation → human oversight controls → incident response procedures → audit trail → external audit",
    keyDecisions: [
      "Risk-based classification of all production AI systems before framework design",
      "Human oversight requirements defined per risk tier, not as a blanket policy",
      "Audit trail architecture designed to satisfy external auditor requirements from day one",
      "Framework scoped to cover all production AI systems, not just high-risk ones"
    ],
    governanceRisk: [
      "Passed external audit with no major findings",
      "Framework now governs all production AI systems",
      "Serves as the compliance baseline for all new AI deployments",
      "Details abstracted to protect employer context"
    ],
    outcome: [
      "Passed external ISO 42001 audit, certifying production AI systems as compliant",
      "AI governance framework now serves as organizational default for new deployments",
      "Compliance baseline established for ongoing AI risk management"
    ]
  },
  "data-platform": {
    context: "Built the core data foundation for analytics and AI: three access perimeters, de-identification at every crossing, ownership mapping, least-privilege access, and audit logging.",
    systemDesign: "Ingestion → hard de-identification → field mapping and pseudonymisation → core store → shared access layer → project-scoped ring (soft de-identification)",
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

const ProjectDetails = ({ details }: { details: ProjectDetail }) => (
  <div className="mt-6 space-y-5 border-t border-border pt-6">
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2">Context</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{details.context}</p>
    </div>

    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2">Approach</h4>
      <p className="text-muted-foreground leading-relaxed font-mono text-xs">{details.systemDesign}</p>
    </div>

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

    <div>
      <h4 className="text-sm font-semibold text-foreground mb-2">Governance &amp; Risk</h4>
      <ul className="space-y-1.5 leading-relaxed">
        {details.governanceRisk.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground pl-3 border-l-2 border-muted-foreground/30">
            {item}
          </li>
        ))}
      </ul>
    </div>

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
);

const ProjectCard = ({
  project,
  index,
  isExpanded,
  onToggle,
  featured = false
}: {
  project: typeof professionalProjects[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  featured?: boolean;
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
      {featured ? (
        <div className="mb-8 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            className="h-auto w-full min-w-[700px] max-w-4xl"
          />
        </div>
      ) : (
        <div className="mb-5 flex aspect-[19/11] items-center justify-center overflow-hidden">
          <img
            src={project.image}
            alt={project.imageAlt}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary">0{index + 1} / {project.subtitle}</p>
          <h3 className="font-display text-xl font-semibold leading-snug md:text-2xl">{project.title}</h3>
          <p className="mt-3 max-w-xl text-base font-semibold leading-relaxed text-foreground">{project.metric}</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{project.outcome}</p>
        </div>
        {!featured && (
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
        )}
      </div>

      {!featured && (
        <AnimatePresence>
          {isExpanded && details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <ProjectDetails details={details} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
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

  const featured = professionalProjects[0];
  const featuredExpanded = expandedId === featured.id;

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
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Systems &amp; Strategy</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Four case studies spanning infrastructure, governance, strategy and intelligence.
          </p>
        </motion.div>

        <div className="space-y-14 md:space-y-16">
          <div>
            <ProjectCard
              project={featured}
              index={0}
              featured
              isExpanded={featuredExpanded}
              onToggle={() => handleToggle(featured.id)}
            />

            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleToggle(featured.id)}
                aria-expanded={featuredExpanded}
                className="inline-flex items-center gap-2 border-b border-border pb-1.5 text-[10px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {featuredExpanded ? "Hide controls" : "The controls"}
                {featuredExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </button>

              <AnimatePresence>
                {featuredExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <ProjectDetails details={projectDetails[featured.id]} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-14 md:grid-cols-3 md:gap-y-16">
            {professionalProjects.slice(1).map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i + 1}
                isExpanded={expandedId === project.id}
                onToggle={() => handleToggle(project.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


export default ProjectsSection;

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import dataFoundationDiagram from "@/assets/diagrams/data-foundation-diagram.svg";
import dataFoundationDiagramTall from "@/assets/diagrams/data-foundation-diagram-tall.svg";
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
    title: "Data foundations that clear legal the first time",
    subtitle: "Data legal can approve",
    outcome:
      "Legal signed off, compliance signed off, and delivery never stopped. Most data programmes manage two of those.",
    metric: "Sensitive data usable for AI without a legal veto.",
    category: "Infrastructure",
    image: dataFoundationDiagram,
    imageAlt:
      "Three access tiers - restricted, shared and a protected core. Data from outside passes de-identification and tokenisation into the core; it returns outward through the tiers and through a re-scoping control before leaving.",
  },
  {
    id: "iso-42001",
    title: "AI governance that passed external audit",
    subtitle: "Governance that passed audit",
    outcome: "New AI deployments now ship against one framework by default.",
    metric: "Built the AI governance framework that cleared external certification",
    category: "Governance",
    image: markGovernance,
    imageAlt: "Three identical bars with a solid disc beside them",
  },
  {
    id: "ai-strategy-roadmap",
    title: "AI Strategy & Use Case Portfolio",
    subtitle: "Choosing what to build first",
    outcome: "From scattered experimentation to a funded, staged pilot programme.",
    metric: "20+ AI ideas ranked into a funded plan",
    category: "Strategy",
    image: markPortfolio,
    imageAlt: "Three tapering blocks narrowing left to right",
  },
  {
    id: "bi-platform",
    title: "Business Intelligence Platform",
    subtitle: "Reporting leadership trusts",
    outcome: "Three source systems unified behind one reporting layer.",
    metric: "Leadership reporting with no manual reconciliation",
    category: "Reporting",
    image: markBi,
    imageAlt: "Three separate blocks feeding into a single framed panel containing three rows",
  },
];

const projectDetails: Record<string, ProjectDetail> = {
  "ai-strategy-roadmap": {
    context: "High AI demand with no shared prioritisation model is the common starting position. I turned scattered ideas into an executive-ready portfolio with quantified business cases and a staged roadmap.",
    systemDesign: "Department interviews → KPI baselines → impact/effort scoring → PRDs + business cases → pilot selection → governance model → delivery roadmap",
    keyDecisions: [
      "Mapped workflows, pain points and adoption readiness across every business unit",
      "Structured 20+ AI opportunities into product requirement documents and business cases",
      "Ranked use cases by annual savings, feasibility, and build-vs-buy fit",
      "Selected a small number of quick-win pilots with the strongest value, data access, and ownership"
    ],
    governanceRisk: [
      "Separated near-term pilots from initiatives blocked by foundational data work",
      "Defined human review, ownership, and KPI requirements before build"
    ],
    outcome: [
      "Leadership received a clear go/no-go package for the next investment stage",
      "Fewer than three initiatives reached pilot, each with scoped PRDs, owners and a delivery timeline"
    ]
  },
  "bi-platform": {
    context: "Disconnected source systems producing conflicting numbers is a common reporting failure. I built a unified ingestion pipeline and live dashboard to remove the manual reconciliation it forces.",
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
      "Access controls scoped by role, so executives see aggregates, not raw records"
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
      "Risk tiers, oversight duties and incident routes documented per system",
      "Audit trail covers every production AI system"
    ],
    outcome: [
      "Framework cleared external ISO 42001 certification audit",
      "New AI deployments are built against this framework by default"
    ]
  },
  "data-platform": {
    context: "A pattern, not a system diagram: three access tiers - restricted, shared and a protected core - with a control at every crossing, each sized to who can read the data next.",
    systemDesign: "External → de-identify → tokenise → protected core → shared tier → restricted tier (re-scope on egress)",
    keyDecisions: [
      "Minimise at intake, not later: a field never collected cannot leak or be subject-accessed, and every downstream control is cheaper for it",
      "Separate the keys from the data: tokenisation only helps if the lookup lives elsewhere under different access",
      "Set the boundary by audience, not by role: start from the smallest group that can still do the work - roles drift, this boundary survives audit",
      "Review what leaves: egress is where re-identification actually happens, and the stage auditors ask about after everything else has passed"
    ],
    governanceRisk: [
      "Security review built into the rollout gate, not run after it",
      "Legal and compliance involved from the start, not consulted at the end"
    ],
    outcome: [
      "Cleared legal review without redesign",
      "Pattern reused for downstream analytics and AI systems"
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
      {!featured && (
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
          {featured && (
            <div className="mt-6">
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={isExpanded}
                className="inline-flex items-center gap-2 border-b border-border pb-1.5 text-[10px] font-medium uppercase tracking-[0.13em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                {isExpanded ? "Hide controls" : "The controls"}
                {isExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
              </button>

              <AnimatePresence>
                {isExpanded && details && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <ProjectDetails details={details} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
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
    <section id="projects" className="pt-6 pb-16 md:pt-10 md:pb-24" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-10 flex flex-col items-start justify-between gap-5 border-b border-border pb-8 md:mb-12 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Selected work</p>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Systems &amp; Strategy</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Details are generalised. Patterns and decisions are described rather than specific systems.
          </p>
        </motion.div>

        <div className="space-y-14 md:space-y-16">
          <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-12">
            <div className="lg:order-first">
              <picture>
                <source media="(max-width: 760px)" srcSet={dataFoundationDiagramTall} />
                <img
                  src={featured.image}
                  alt={featured.imageAlt}
                  loading="lazy"
                  className="mx-auto h-auto w-full max-w-[440px] sm:max-w-none"
                />
              </picture>
            </div>
            <ProjectCard
              project={featured}
              index={0}
              featured
              isExpanded={featuredExpanded}
              onToggle={() => handleToggle(featured.id)}
            />
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

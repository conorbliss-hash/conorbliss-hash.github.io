// Intelligence on Tap: a transparent, rule-based map of the EU and Nordic rules that touch a
// company's use of AI. Deterministic on purpose: every result traces to a rule below and a source.
// Reviewed: 19 Nov 2026. General information, not legal advice.

export const REVIEWED = "19 Nov 2026";

export type Country = "SE" | "NO" | "DK" | "FI" | "EU";
export type Customer = "finance" | "insurance" | "health" | "public" | "infra" | "consumers";
export type FirmType = "software" | "msp" | "financial" | "other";
export type Size = "small" | "medium" | "large";
export type AiUse = "none" | "internal" | "product" | "own_models";
export type HighRisk =
  | "credit"
  | "insurance_pricing"
  | "hr"
  | "education"
  | "public_services"
  | "biometrics"
  | "critical_infra"
  | "medical";

export type Profile = {
  countries: Country[];
  firmType: FirmType;
  size: Size;
  customers: Customer[];
  aiUse: AiUse;
  facesUsers: boolean; // chatbot, or generates text/images/audio/video people see
  personalData: "yes" | "no" | "unsure";
  highRisk: HighRisk[];
  installable: boolean; // installable software or connected devices, not only SaaS
};

export type Status = "now" | "soon" | "watch";

export type Source = { label: string; url: string };

export type RuleResult = {
  id: string;
  law: string;
  title: string;
  status: Status;
  date?: string; // ISO date the duty applies (or applied) from
  dateLabel: string;
  why: string;
  actions: string[];
  asks: string[];
  sources: Source[];
};

export const EXAMPLE_PROFILE: Profile = {
  countries: ["SE", "EU"],
  firmType: "software",
  size: "medium",
  customers: ["finance", "insurance"],
  aiUse: "product",
  facesUsers: true,
  personalData: "yes",
  highRisk: ["credit"],
  installable: false,
};

export const BLANK_PROFILE: Profile = {
  countries: [],
  firmType: "software",
  size: "medium",
  customers: [],
  aiUse: "none",
  facesUsers: false,
  personalData: "unsure",
  highRisk: [],
  installable: false,
};

const SRC = {
  aiAct: { label: "AI Act, Regulation (EU) 2024/1689", url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
  omnibus: { label: "Digital Omnibus on AI, Regulation (EU) 2026/1744", url: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj" },
  aiActTimeline: { label: "AI Act implementation timeline", url: "https://artificialintelligenceact.eu/implementation-timeline/" },
  checker: { label: "EU AI Act Service Desk checker", url: "https://ai-act-service-desk.ec.europa.eu/en/eu-ai-act-compliance-checker" },
  gdpr: { label: "GDPR, Regulation (EU) 2016/679", url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj" },
  dora: { label: "DORA, Regulation (EU) 2022/2554", url: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj" },
  nis2: { label: "NIS2, Directive (EU) 2022/2555", url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj" },
  nis2Impl: { label: "NIS2 Implementing Regulation (EU) 2024/2690", url: "https://eur-lex.europa.eu/eli/reg_impl/2024/2690/oj" },
  doraNo: { label: "Finanstilsynet: DORA in Norway", url: "https://www.finanstilsynet.no/nyhetsarkiv/nyheter/2025/ny-lov-om-digital-operasjonell-motstandsdyktighet-i-finanssektoren-dora-loven-trer-i-kraft-1.-juli" },
  mdcg: { label: "MDCG 2019-11: software as a medical device", url: "https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en" },
  cra: { label: "Cyber Resilience Act, Regulation (EU) 2024/2847", url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj" },
  craReporting: { label: "European Commission: CRA reporting", url: "https://digital-strategy.ec.europa.eu/en/policies/cra-reporting" },
  ccd2: { label: "Consumer Credit Directive (EU) 2023/2225", url: "https://eur-lex.europa.eu/eli/dir/2023/2225/oj" },
  pld: { label: "Product Liability Directive (EU) 2024/2853", url: "https://eur-lex.europa.eu/eli/dir/2024/2853/oj" },
  schufa: { label: "CJEU, SCHUFA (C-634/21)", url: "https://curia.europa.eu/juris/liste.jsf?num=C-634/21" },
  noOmnibus: { label: "Regjeringen: consultation on the AI Act changes", url: "https://www.regjeringen.no/id3187283/" },
  mdr: { label: "Medical Devices Regulation (EU) 2017/745", url: "https://eur-lex.europa.eu/eli/reg/2017/745/oj" },
  noAiLaw: { label: "Regjeringen: Norway's AI law consultation", url: "https://www.regjeringen.no/id3112327/" },
  procurement: { label: "EU Public Buyers Community: AI procurement", url: "https://public-buyers-community.ec.europa.eu/communities/procurement-ai" },
  imy: { label: "IMY (Sweden)", url: "https://www.imy.se/" },
  dtNo: { label: "Datatilsynet (Norway)", url: "https://www.datatilsynet.no/" },
  dtDk: { label: "Datatilsynet (Denmark)", url: "https://www.datatilsynet.dk/" },
  dtFi: { label: "Tietosuojavaltuutettu (Finland)", url: "https://tietosuoja.fi/en" },
} satisfies Record<string, Source>;

const HIGH_RISK_LABEL: Record<HighRisk, string> = {
  credit: "credit scoring or creditworthiness",
  insurance_pricing: "life or health insurance pricing",
  hr: "recruitment or managing staff",
  education: "education or exams",
  public_services: "access to public benefits or essential services",
  biometrics: "biometric identification or categorisation",
  critical_infra: "safety parts of critical infrastructure",
  medical: "medical diagnosis or treatment",
};

const list = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

export function buildMap(p: Profile, today = new Date()): RuleResult[] {
  const out: RuleResult[] = [];
  const hasAI = p.aiUse !== "none";
  const builds = p.aiUse === "product" || p.aiUse === "own_models";
  const euMarket = p.countries.some((c) => c !== "NO");
  const has = (c: Customer) => p.customers.includes(c);
  const annexIII = p.highRisk.filter((h) => h !== "medical");

  if (hasAI && euMarket) {
    out.push({
      id: "ai-act-baseline",
      law: "EU AI Act",
      title: "AI literacy and the banned-practices check",
      status: "now",
      date: "2025-02-02",
      dateLabel: "Since 2 Feb 2025",
      why: `You ${builds ? "build" : "use"} AI in the EU, so you must take steps to support your staff's AI literacy (since the 2026 Omnibus, no set level is required), and no system may fall into a banned practice.`,
      actions: [
        "Keep a short register of every AI system, its owner and who uses it.",
        "Record the training or guidance each group has had.",
        "Screen each system against the banned list, such as emotion recognition at work and social scoring.",
        ...(builds && p.facesUsers
          ? ["If you offer image, video or audio generation, put safeguards against sexual deepfakes and abuse material in place before 2 Dec 2026 (new bans added by the Omnibus)."]
          : []),
      ],
      asks: ["Can you list every AI feature in the product, with its model and vendor?"],
      sources: [SRC.aiAct, SRC.omnibus, SRC.checker],
    });
  }

  if (hasAI && euMarket && p.facesUsers) {
    out.push({
      id: "ai-act-transparency",
      law: "EU AI Act, Art. 50",
      title: "Tell people when they're dealing with AI",
      status: "now",
      // Disclosure applies since 2 Aug 2026; the Omnibus gave generative systems already on the
      // market until 2 Dec 2026 for machine-readable marking (Art. 50(2)), so that's the date to show.
      date: "2026-12-02",
      dateLabel: "Since 2 Aug 2026 · marking for older systems by 2 Dec 2026",
      why: builds
        ? "Your AI talks to people or produces content they see. As its provider, you must tell users it's AI and mark generated content in a machine-readable way. If your generative AI was on the market before 2 Aug 2026, the marking is due by 2 Dec 2026."
        : "Your AI talks to people or produces content they see. The vendor that provides it handles the AI notice and machine-readable marking; as the user, you label deepfakes and AI-written text you publish on matters of public interest.",
      actions: builds
        ? ["Add a clear notice wherever a user chats with AI.", "Mark AI-generated text, images, audio or video in a machine-readable way."]
        : ["Label deepfakes and AI-written public-interest text you publish.", "Check that your vendor tells users it's AI and marks its output."],
      asks: ["How do you tell end users that they're interacting with AI?"],
      sources: [SRC.aiAct, SRC.omnibus],
    });
  }

  if (hasAI && euMarket && annexIII.length) {
    out.push({
      id: "ai-act-high-risk",
      law: "EU AI Act, Annex III",
      title: "High-risk AI duties",
      status: "soon",
      date: "2027-12-02",
      dateLabel: "From 2 Dec 2027",
      why: `You ${builds ? "build AI" : "use AI"} for ${list(annexIII.map((h) => HIGH_RISK_LABEL[h]))}, which the AI Act treats as high-risk. The 2026 Digital Omnibus moved this date from Aug 2026. A use isn't high-risk if it poses no significant risk, but profiling people always is, and you must document that call (Art. 6(3)).`,
      actions: builds
        ? [
            "Decide in writing whether each use is really high-risk (Art. 6(3)).",
            "Set up risk management, data governance and a quality management system (simplified for SMEs and small mid-caps).",
            "Prepare technical documentation and logging, then plan the conformity assessment and EU database registration.",
          ]
        : [
            "Assign human oversight with the authority to stop the system.",
            "Keep the system's logs and use it as the provider's instructions say. Rebranding or substantially changing it makes you the provider.",
            "Tell staff and their representatives before using it at work, and tell people when it helps decide about them.",
            "Check whether you need a fundamental-rights impact assessment (public bodies, firms providing public services, credit scoring, and life or health insurance pricing). You can reuse your DPIA.",
          ],
      asks: ["Is any feature high-risk under the AI Act, and who is the provider?"],
      sources: [SRC.aiAct, SRC.omnibus, SRC.aiActTimeline],
    });
  }

  if (hasAI && p.highRisk.includes("medical")) {
    out.push({
      id: "medical",
      law: "MDR + EU AI Act, Annex I",
      title: "AI as medical device software",
      status: "now",
      date: "2028-08-02",
      dateLabel: "MDR now · AI Act from 2 Aug 2028",
      why: "If the AI's intended purpose is diagnosis or treatment of individual patients, it is likely medical device software, usually class IIa or higher, so a notified body is needed. The MDR applies now, and the AI Act's high-risk duties follow from 2 Aug 2028 for devices that need a notified body. Diagnostic AI for lab tests falls under the IVDR instead.",
      actions: [
        "Confirm whether the feature is a medical device, and its risk class.",
        "Line up MDR technical documentation with the AI Act's requirements.",
      ],
      asks: ["Is the AI feature CE-marked as a medical device?"],
      sources: [SRC.mdr, SRC.mdcg, SRC.aiAct, SRC.omnibus],
    });
  }

  if (p.aiUse === "own_models") {
    out.push({
      id: "gpai",
      law: "EU AI Act, Chapter V",
      title: "General-purpose model provider duties",
      status: "watch",
      date: "2025-08-02",
      dateLabel: "Since 2 Aug 2025, if they apply",
      why: "Duties apply if you place a general-purpose model on the market. Fine-tuning usually doesn't make you a provider of one, unless it uses more than a third of the original model's training compute. Models on the market before 2 Aug 2025 have until 2 Aug 2027.",
      actions: [
        "Decide in writing whether you're a general-purpose model provider.",
        "If you are: technical documentation, a copyright policy and a training-data summary.",
      ],
      asks: [],
      sources: [SRC.aiAct],
    });
  }

  if (hasAI && p.personalData !== "no") {
    const dpas = [
      p.countries.includes("SE") && SRC.imy,
      p.countries.includes("NO") && SRC.dtNo,
      p.countries.includes("DK") && SRC.dtDk,
      p.countries.includes("FI") && SRC.dtFi,
    ].filter(Boolean) as Source[];
    out.push({
      id: "gdpr-ai",
      law: "GDPR",
      title: "Personal data in AI features",
      status: "now",
      dateLabel: "Applies now",
      why: `${p.personalData === "unsure" ? "You may be" : "You're"} putting personal data through AI, so GDPR applies to it, including the rules on automated decisions (Art. 22) and impact assessments (Art. 35).`,
      actions: [
        "Screen each AI feature and run a data protection impact assessment (DPIA) where risk is likely high: profiling, new technology at scale, or sensitive data.",
        "Confirm the legal basis and how long data is kept, including at the model vendor.",
        "Check whether any decision, or a score that largely drives one, is made without a human (Art. 22 and the SCHUFA ruling).",
      ],
      asks: ["Does customer data go to an AI provider, where is it processed, and is it used for training?"],
      sources: [SRC.gdpr, SRC.schufa, ...dpas],
    });
  }

  // Norway applies DORA through DORA-loven from 1 Jul 2025, not 17 Jan 2025.
  const doraDate = euMarket ? "2025-01-17" : "2025-07-01";
  const doraLabel = euMarket ? "Since 17 Jan 2025" : "Since 1 Jul 2025 in Norway";
  const doraSrc = euMarket ? [SRC.dora] : [SRC.dora, SRC.doraNo];
  if ((has("finance") || has("insurance")) && p.firmType !== "financial") {
    out.push({
      id: "dora-supplier",
      law: "DORA (through your customers)",
      title: "ICT supplier duties to banks and insurers",
      status: "now",
      date: doraDate,
      dateLabel: doraLabel,
      why: "DORA binds your financial customers, and they pass it on to you through contracts. That covers minimum contract terms (Art. 30), data for their register of ICT suppliers (Art. 28), and clauses from the subcontracting rules (Delegated Regulation 2025/532). For banks and insurers DORA replaces NIS2's security and incident-reporting rules, so this is the card that matters for them.",
      actions: [
        "Prepare a standard DORA addendum: audit rights, incident support, exit plan.",
        "List your subcontractors, including AI model providers, for their register.",
      ],
      asks: [
        "Which subcontractors, including AI model providers, support this service?",
        "How will you support us during an ICT incident or an exit?",
        "Where is our data stored, and can it stay in the EU/EEA?",
      ],
      sources: doraSrc,
    });
  }

  if (p.firmType === "financial") {
    out.push({
      id: "dora-direct",
      law: "DORA",
      title: "ICT risk management, directly",
      status: "now",
      date: doraDate,
      dateLabel: doraLabel,
      why: "As a financial entity, DORA applies to you directly, including AI services bought from third parties.",
      actions: [
        "Add AI providers to your ICT supplier register and assess how critical each one is.",
        "Report major ICT incidents (Art. 19) and submit your register of information each year.",
      ],
      asks: [],
      sources: doraSrc,
    });
  }

  // CCD2 isn't EEA law yet, so Norway-only firms don't get this card.
  if (euMarket && p.highRisk.includes("credit") && (has("consumers") || has("finance"))) {
    const lender = p.firmType === "financial" && has("consumers");
    out.push({
      id: "ccd2",
      law: "Consumer Credit Directive",
      title: lender ? "Automated credit decisions for consumers" : "Your lender customers' new consumer credit rules",
      // Applies from 20 Nov 2026; show it as coming until then so the card and timeline agree.
      status: today >= new Date("2026-11-20") ? "now" : "soon",
      date: "2026-11-20",
      dateLabel: "From 20 Nov 2026, through national law",
      why: lender
        ? "When creditworthiness is assessed by automated processing, consumers can ask for a human to review the decision, get a meaningful explanation of it, and contest it (Art. 18(8)). Special-category data such as health may not be used (Art. 18(3)). Sweden, Denmark and Finland apply it from 20 Nov 2026; Norway hasn't adopted it yet."
        : "Your lender customers must explain automated credit decisions and offer human review (Art. 18(8)). They will ask you to make that possible.",
      actions: lender
        ? [
            "Map every automated step in the credit decision and who can review it.",
            "Write the plain-language explanation a rejected applicant would get.",
            "Remove special-category data, such as health, from scoring inputs.",
          ]
        : [
            "Prepare a short explanation of how your model scores, which a lender can pass on to a consumer.",
            "Confirm no special-category data, such as health, feeds the score (Art. 18(3)).",
          ],
      asks: lender ? [] : ["Can you explain an individual credit score in plain language, and support human review?"],
      sources: [SRC.ccd2, SRC.gdpr],
    });
  }

  const nis2Status = "In force in Finland (Apr 2025), Denmark (Jul 2025) and Sweden (Jan 2026). Norway still runs NIS1-level rules.";
  if (p.firmType === "msp" && p.size !== "small") {
    out.push({
      id: "nis2-direct",
      law: "NIS2",
      title: "Cybersecurity duties as a managed service provider",
      status: p.countries.some((c) => c !== "NO") ? "now" : "watch",
      dateLabel: "Depends on country",
      why: `Managed (security) service providers that are medium-sized or larger (50+ staff, or over €10m turnover and balance sheet) are in scope. You answer to the country of your main EU establishment only. ${nis2Status}`,
      actions: [
        "Register with the authority in the country of your main EU establishment.",
        "Set up the risk measures in Implementing Regulation 2024/2690 and management sign-off.",
        "Set up incident reporting: early warning in 24 hours, notification in 72 hours, final report in a month.",
      ],
      asks: ["Are you covered by NIS2, and who is your supervisory authority?"],
      sources: [SRC.nis2, SRC.nis2Impl],
    });
  } else if (p.firmType === "software" && p.size !== "small" && euMarket) {
    out.push({
      id: "nis2-cloud",
      law: "NIS2",
      title: "Check whether you're in scope as a cloud provider",
      status: "watch",
      dateLabel: "Depends on country",
      why: `Medium-sized and larger cloud computing service providers are covered by NIS2 directly. Whether a SaaS product counts depends on how your national authority reads "cloud computing service". ${nis2Status}`,
      actions: ["Get a written view on whether you're a cloud computing service provider, and if so, register in your main EU establishment country."],
      asks: ["Are you covered by NIS2, and who is your supervisory authority?"],
      sources: [SRC.nis2, SRC.nis2Impl],
    });
  }
  if (!(p.firmType === "msp" && p.size !== "small") && (has("public") || has("health") || has("infra"))) {
    // Finance customers deliberately excluded: for banks and insurers DORA is the sector rule
    // (lex specialis to NIS2), so their supplier demands arrive through the DORA card.
    out.push({
      id: "nis2-supply",
      law: "NIS2 (through your customers)",
      title: "Supply-chain security requirements",
      status: "now",
      dateLabel: "Your customers' duty, in force now",
      why: `NIS2 doesn't bind you directly; it reaches you through contracts. Your customers in ${list(
        [has("public") && "the public sector", has("health") && "health", has("infra") && "critical infrastructure"].filter(Boolean) as string[],
      )} must manage supply-chain risk, so expect security clauses and questionnaires. ${nis2Status}`,
      actions: [
        "Keep a current security pack: controls, certifications, incident process.",
        "Name a contact for customer incident notifications.",
      ],
      asks: ["How do you notify us of a security incident, and how fast?"],
      sources: [SRC.nis2],
    });
  }

  if (p.installable) {
    out.push({
      id: "cra",
      law: "Cyber Resilience Act",
      title: "Security for products with digital elements",
      // Like the AI Act, the CRA isn't part of the EEA Agreement yet, so Norway-only sellers watch it.
      status: euMarket ? "now" : "watch",
      date: euMarket ? "2027-12-11" : undefined,
      dateLabel: euMarket ? "Reporting since 11 Sep 2026 · all duties from 11 Dec 2027" : "Not yet EEA law in Norway",
      why: euMarket
        ? "You sell installable software or connected devices. Actively exploited vulnerabilities and severe incidents already have to be reported through ENISA's platform (an early warning within 24 hours), and the rest of the CRA follows in Dec 2027. SaaS alone is out, unless it's the remote back end a product needs to work. Medical devices under the MDR are excluded."
        : "You sell installable software or connected devices, but only in Norway. The CRA isn't part of the EEA Agreement yet, so it doesn't bind you today. Expect it to follow, and it applies the moment you sell into the EU.",
      actions: [
        "Set up vulnerability handling and the 24-hour reporting route.",
        "Plan secure-by-default design and a software bill of materials (SBOM).",
      ],
      asks: ["Do you have a vulnerability disclosure process and an SBOM?"],
      sources: [SRC.cra, SRC.craReporting],
    });
  }

  if (euMarket && (builds || p.installable) && p.firmType !== "financial" && p.firmType !== "msp") {
    out.push({
      id: "pld",
      law: "Product Liability Directive",
      title: "Strict liability for software and AI",
      status: "soon",
      date: "2026-12-09",
      dateLabel: "For products placed on the market from 9 Dec 2026",
      why: "Software, including AI systems, now counts as a product. If a defect causes damage, you can be liable without fault, and a missing security update can count as a defect. Courts can order you to disclose evidence and presume a defect in complex cases.",
      actions: [
        "Check your product-liability insurance covers software and AI.",
        "Keep records of testing, updates and known issues for each release.",
      ],
      asks: [],
      sources: [SRC.pld],
    });
  }

  if (has("public") && hasAI && builds) {
    out.push({
      id: "procurement",
      law: "Public procurement",
      title: "AI clauses in public tenders",
      status: "watch",
      dateLabel: "In tenders now",
      why: "Public buyers increasingly add AI terms to contracts, often based on the EU's model AI clauses: transparency, documentation, human oversight.",
      actions: ["Prepare standard answers on data, models, oversight and audit for tenders."],
      asks: ["Can you meet the EU model contractual clauses for AI (MCC-AI, high-risk or light version)?"],
      sources: [SRC.procurement],
    });
  }

  if (hasAI && p.countries.includes("NO")) {
    out.push({
      id: "norway",
      law: "Norway: AI law (KI-loven)",
      title: "The AI Act's arrival in Norway",
      status: "watch",
      dateLabel: "Bill aimed for spring 2027, depends on EEA",
      why: "The AI Act isn't part of the EEA Agreement yet. The government aims to put its AI law to the Storting in spring 2027, but that depends on the AI Act being added to the EEA Agreement. A further consultation on the 2026 changes opened on 30 Oct 2026. Anything you sell into the EU is covered already.",
      actions: ["Build to the AI Act now so Norwegian customers are covered when it arrives."],
      asks: [],
      sources: [SRC.noAiLaw, SRC.noOmnibus],
    });
  }

  // Within each status, the cards specific to this profile lead; the ones every AI user gets go last.
  const order: Record<Status, number> = { now: 0, soon: 1, watch: 2 };
  const generic = (r: RuleResult) => (r.id === "ai-act-baseline" || r.id === "gdpr-ai" ? 1 : 0);
  return out.sort((a, b) => order[a.status] - order[b.status] || generic(a) - generic(b));
}

export function customerQuestions(results: RuleResult[]): string[] {
  return [...new Set(results.flatMap((r) => r.asks))];
}

export function upcoming(results: RuleResult[], today = new Date()): RuleResult[] {
  return results
    .filter((r) => r.date && new Date(r.date) > today)
    .sort((a, b) => (a.date! < b.date! ? -1 : 1));
}

export function asText(p: Profile, results: RuleResult[]): string {
  const head = `AI rules map (Intelligence on Tap, reviewed ${REVIEWED})\nGeneral information, not legal advice.\n`;
  const body = results
    .map((r) => `\n[${r.status === "now" ? "Applies now" : r.status === "soon" ? "Coming" : "Watch"}] ${r.law}: ${r.title} (${r.dateLabel})\n${r.why}\n${r.actions.map((a) => `- ${a}`).join("\n")}`)
    .join("\n");
  return `${head}${body}\n\nMade with conorbliss.com/intelligence-on-tap`;
}

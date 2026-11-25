// The AI Answer Pack: a draft answer to each of the 20 AI questions customers send, built only
// from quotes the scanner found on the company's own pages. Nothing is invented: where the site is
// silent, the draft says what evidence the answer needs instead.
//
// The 20 questions, their order and the evidence line come from the shared bank in the scanner
// repo (src/bank.generated.ts, synced from ai-evidence-check/bank/crosswalk.csv, verified 23 Nov 2026).
// "web" marks the nine a public website can answer; the scanner returns a status only for those.

export type Evidence = { quote: string; url: string };
export type WebStatus = "answered" | "contradicted" | "claimed" | "silent";
export type Readiness = {
  checked: { n: number; id: string; short: string; status: WebStatus; note: string; evidence: Evidence[] }[];
  answered: number;
  contradicted: number;
  web: number;
  total: number;
};

export type PackStatus = "answered" | "contradicted" | "thin" | "missing" | "private";

export const BANK: { n: number; id: string; short: string; text: string; evidence: string; web: boolean }[] = [
  { n: 1, id: "testing", short: "How it was tested", text: "How was the AI tested (accuracy, bias, robustness) before release?", evidence: "A dated test report for each AI feature.", web: true },
  { n: 2, id: "providers", short: "Which AI providers see our data", text: "Which third-party models or AI providers process our data?", evidence: "The model and provider for each feature, as a sub-processor list.", web: true },
  { n: 3, id: "monitoring", short: "How it's monitored", text: "How do you monitor the AI in production (drift, errors, misuse)?", evidence: "A named monitoring owner, the metric watched and the alert.", web: false },
  { n: 4, id: "assessment", short: "Risk assessment before release", text: "Was a risk or impact assessment done before release?", evidence: "A signed, dated risk or impact assessment.", web: false },
  { n: 5, id: "logging", short: "Logging and traceability", text: "What is logged, and can an output be traced back?", evidence: "Log scope and how long logs are kept.", web: false },
  { n: 6, id: "documentation", short: "Documentation we get", text: "What documentation do we get (model card, instructions for use, known limits)?", evidence: "A customer-facing AI fact sheet for the feature.", web: false },
  { n: 7, id: "incidents", short: "AI incident handling", text: "How do you handle AI incidents, and how will you tell us?", evidence: "An incident process that names AI incidents, with a customer notice step.", web: false },
  { n: 8, id: "accountability", short: "Who's accountable, AI policy", text: "Who is accountable for the AI, and is there an AI policy?", evidence: "A named accountable role, a policy, and an approval record per feature.", web: true },
  { n: 9, id: "oversight", short: "Human oversight", text: "Is there human oversight of the AI's outputs, and where?", evidence: "The oversight step for each feature and who performs it.", web: true },
  { n: 10, id: "attacks", short: "Defence against model attacks", text: "How do you defend against prompt injection and attacks on the model?", evidence: "A dated security test or red-team record.", web: false },
  { n: 11, id: "audit", short: "Audit rights", text: "Can we audit you and get evidence on request?", evidence: "An audit clause and an evidence pack you can send.", web: false },
  { n: 12, id: "literacy", short: "Staff AI training", text: "Are your staff trained on AI (AI literacy)?", evidence: "A training record for staff who build or operate the AI.", web: false },
  { n: 13, id: "exit", short: "Exit and portability", text: "Can we exit and take our data and outputs with us?", evidence: "Exit and data portability terms.", web: false },
  { n: 14, id: "location", short: "Where our data is processed", text: "Where is our data processed, how long is it kept, and how is it deleted?", evidence: "Processing region, retention period and deletion route.", web: true },
  { n: 15, id: "ip", short: "Output ownership, IP", text: "Who owns the outputs, and do you indemnify us against IP claims?", evidence: "The output ownership and IP indemnity clause.", web: false },
  { n: 16, id: "training", short: "Is our data used for training", text: "Is our data used to train or improve any model?", evidence: "The provider's terms plus the setting that shows training is switched off.", web: true },
  { n: 17, id: "disclosure", short: "Users told it's AI", text: "Are end users told they are dealing with AI, and is generated content labelled?", evidence: "The interface text or screenshot that discloses AI, and the labelling method.", web: true },
  { n: 18, id: "change-notice", short: "Notice of model changes", text: "Will you tell us before the model or the AI's behaviour changes?", evidence: "A change-notice clause and a log of past changes.", web: false },
  { n: 19, id: "features", short: "Which features use AI", text: "Which features in your product use AI?", evidence: "An AI inventory listing every AI feature.", web: true },
  { n: 20, id: "ai-act-role", short: "AI Act role and risk class", text: "What is your EU AI Act role and risk class for each AI feature?", evidence: "The role (provider or deployer) and risk classification per feature.", web: true },
];

export type PackItem = {
  n: number;
  id: string;
  short: string;
  question: string;
  status: PackStatus;
  /** Paste-ready draft. Quotes are the company's own words; brackets mark what they must add. */
  draft: string;
  /** What a reviewer will want attached. */
  needs: string;
  evidence: Evidence[];
};

export type Pack = {
  items: PackItem[];
  counts: Record<PackStatus, number>;
  total: number;
};

export const STATUS_LABEL: Record<PackStatus, string> = {
  answered: "Drafted from your site",
  contradicted: "Your pages disagree",
  thin: "Mentioned, no detail",
  missing: "Not on your site",
  private: "Needs your own records",
};

export const pageName = (u: string) => {
  try {
    const { hostname, pathname } = new URL(u);
    return `${hostname.replace(/^www\./, "")}${decodeURI(pathname).replace(/\/$/, "")}`;
  } catch {
    return u;
  }
};

/** Quotes grouped by page, so a page is named once: "a" "b" (page). */
const quoted = (e: Evidence[]) => {
  const byPage = new Map<string, string[]>();
  for (const x of e) byPage.set(x.url, [...(byPage.get(x.url) ?? []), `"${x.quote.trim()}"`]);
  return [...byPage].map(([url, qs]) => `${qs.join(" ")} (${pageName(url)})`).join(" ");
};

function draftFor(status: PackStatus, evidence: Evidence[], needs: string): string {
  switch (status) {
    case "answered":
      return `As stated on our website: ${quoted(evidence)} [Attach if asked: ${needs}]`;
    case "contradicted":
      return `[Fix before answering: two of your pages disagree. ${quoted(evidence)} Decide which is true, correct the other page, then answer with that.]`;
    case "thin":
      return `Our website says: ${quoted(evidence)} [A reviewer will ask for the detail behind this: ${needs}]`;
    case "missing":
      return `[Not on your public pages. To answer, you need: ${needs}]`;
    case "private":
      return `[A website can't show this. To answer, you need: ${needs}]`;
  }
}

const WEB_TO_PACK: Record<WebStatus, PackStatus> = { answered: "answered", contradicted: "contradicted", claimed: "thin", silent: "missing" };

export function buildPack(r: Readiness): Pack {
  const byId = new Map(r.checked.map((c) => [c.id, c]));
  const items = BANK.map((q): PackItem => {
    const c = q.web ? byId.get(q.id) : undefined;
    const status: PackStatus = c ? WEB_TO_PACK[c.status] : q.web ? "missing" : "private";
    const evidence = c?.evidence ?? [];
    return { n: q.n, id: q.id, short: q.short, question: q.text, status, draft: draftFor(status, evidence, q.evidence), needs: q.evidence, evidence };
  });
  const counts = { answered: 0, contradicted: 0, thin: 0, missing: 0, private: 0 } as Record<PackStatus, number>;
  for (const i of items) counts[i.status]++;
  return { items, counts, total: items.length };
}

const csvCell = (s: string) => `"${s.replace(/"/g, '""')}"`;

/** One row per question, ready to paste into a spreadsheet questionnaire. */
export function packCsv(p: Pack, site: string): string {
  const head = ["#", "Question", "Status", "Draft answer", "Evidence a reviewer will ask for", "Source pages"];
  const rows = p.items.map((i) => [String(i.n), i.question, STATUS_LABEL[i.status], i.draft, i.needs, i.evidence.map((e) => e.url).join(" ")]);
  const note = [`AI Answer Pack for ${site}. Drafted from public pages by Intelligence on Tap (conorbliss.com/intelligence-on-tap). Check every answer before you send it. General information, not legal advice.`];
  // BOM so Excel reads the quotes' accents correctly.
  return "﻿" + [note, head, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** A first draft of a public "How we use AI" page, from the same answers. */
export function aiPageMarkdown(p: Pack, company: string): string {
  const get = (id: string) => p.items.find((i) => i.id === id)!;
  const section = (title: string, id: string) => {
    const i = get(id);
    const body =
      i.status === "answered" || i.status === "thin"
        ? i.evidence.map((e) => `> ${e.quote.trim()}`).join("\n>\n") + (i.status === "thin" ? `\n\n[Add the detail: ${i.needs}]` : "")
        : i.status === "contradicted"
          ? `[Your pages disagree on this. Settle it first:]\n\n${i.evidence.map((e) => `> ${e.quote.trim()} (${pageName(e.url)})`).join("\n>\n")}`
          : `[Write this: ${i.needs}]`;
    return `## ${title}\n\n${body}\n`;
  };
  return [
    `# How ${company} uses AI\n`,
    `[Draft built from your own website by Intelligence on Tap. Quotes are your words; brackets are what to add. Check it before you publish.]\n`,
    section("Where we use AI", "features"),
    section("Which AI providers process your data", "providers"),
    section("Where your data is processed and kept", "location"),
    section("Whether your data trains any model", "training"),
    section("Where a person checks the AI", "oversight"),
    section("How we tell users they're dealing with AI", "disclosure"),
    section("How we test the AI", "testing"),
    section("Who is accountable", "accountability"),
    section("Our role under the EU AI Act", "ai-act-role"),
    `## Questions\n\n[Name a contact for customers' AI questions.]\n`,
  ].join("\n");
}

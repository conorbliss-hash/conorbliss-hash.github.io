import { describe, expect, it } from "vitest";

import { aiPageMarkdown, BANK, buildPack, packCsv, type Readiness } from "./answerPack";

const r: Readiness = {
  answered: 2,
  contradicted: 1,
  web: 9,
  total: 20,
  checked: [
    { n: 19, id: "features", short: "", status: "answered", note: "", evidence: [{ quote: "Visiba Triage is our AI-powered triage tool", url: "https://www.visibagroup.com/en/" }] },
    { n: 14, id: "location", short: "", status: "contradicted", note: "", evidence: [{ quote: "Data stays in Sweden", url: "https://x.se/a" }, { quote: "Support may access data from the US", url: "https://x.se/b" }] },
    { n: 20, id: "ai-act-role", short: "", status: "claimed", note: "", evidence: [{ quote: "We follow the AI Act", url: "https://x.se/c" }] },
    { n: 2, id: "providers", short: "", status: "silent", note: "", evidence: [] },
  ],
};

describe("answer pack", () => {
  it("covers all 20 bank questions once, in bank order", () => {
    const p = buildPack(r);
    expect(p.total).toBe(20);
    expect(new Set(p.items.map((i) => i.id)).size).toBe(20);
    expect(p.items.map((i) => i.n)).toEqual(BANK.map((q) => q.n));
    expect(BANK.filter((q) => q.web)).toHaveLength(9);
  });

  it("drafts only from the site's own quotes and marks what to add", () => {
    const p = buildPack(r);
    const by = (id: string) => p.items.find((i) => i.id === id)!;
    expect(by("features").status).toBe("answered");
    expect(by("features").draft).toContain('"Visiba Triage is our AI-powered triage tool" (visibagroup.com/en)');
    expect(by("location").status).toBe("contradicted");
    expect(by("location").draft).toMatch(/^\[Fix before answering/);
    expect(by("ai-act-role").status).toBe("thin");
    expect(by("providers").status).toBe("missing");
    expect(by("monitoring").status).toBe("private");
    // A web question the scanner didn't return counts as missing, never as answered.
    expect(by("training").status).toBe("missing");
    expect(p.counts).toEqual({ answered: 1, contradicted: 1, thin: 1, missing: 6, private: 11 });
  });

  it("exports a CSV with a header, a note and 20 rows, quotes escaped", () => {
    const csv = packCsv(buildPack(r), "visibagroup.com");
    const lines = csv.trim().split("\r\n");
    expect(lines).toHaveLength(22);
    expect(lines[1]).toBe('"#","Question","Status","Draft answer","Evidence a reviewer will ask for","Source pages"');
    expect(csv).toContain('""Visiba Triage is our AI-powered triage tool""');
  });

  it("builds a How-we-use-AI draft from the same answers", () => {
    const md = aiPageMarkdown(buildPack(r), "Visiba");
    expect(md).toMatch(/^# How Visiba uses AI/);
    expect(md).toContain("> Visiba Triage is our AI-powered triage tool");
    expect(md).toContain("[Your pages disagree on this.");
    expect(md).toContain("[Write this: The model and provider for each feature");
  });
});

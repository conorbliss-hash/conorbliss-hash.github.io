import { describe, expect, it } from "vitest";

import { BLANK_PROFILE, EXAMPLE_PROFILE, buildMap, type Profile } from "./rulemap";

// Golden profiles: the rule ids each one should switch on. When a rule changes, update the
// expectation deliberately and note why in the review log; a silent change here is a bug.
const ids = (p: Profile) => buildMap(p).map((r) => r.id).sort();
const with_ = (over: Partial<Profile>): Profile => ({ ...BLANK_PROFILE, ...over });

describe("rule map golden profiles", () => {
  it("example: Swedish SaaS with AI, selling to banks and insurers", () => {
    expect(ids(EXAMPLE_PROFILE)).toEqual(
      ["ai-act-baseline", "ai-act-high-risk", "ai-act-transparency", "dora-supplier", "gdpr-ai", "nis2-supply"].sort(),
    );
  });

  it("no AI, no regulated customers: nothing applies", () => {
    expect(ids(with_({ countries: ["SE"] }))).toEqual([]);
  });

  it("Norway-only AI user gets the Norway watch, not the EU AI Act duties", () => {
    const out = ids(with_({ countries: ["NO"], aiUse: "internal", personalData: "no" }));
    expect(out).toEqual(["norway"]);
  });

  it("managed service provider with 50+ staff is directly in NIS2, not via supply chain", () => {
    const out = ids(with_({ countries: ["FI"], firmType: "msp", customers: ["public"] }));
    expect(out).toContain("nis2-direct");
    expect(out).not.toContain("nis2-supply");
  });

  it("small managed service provider falls back to supply-chain NIS2", () => {
    const out = ids(with_({ countries: ["FI"], firmType: "msp", size: "small", customers: ["public"] }));
    expect(out).toEqual(["nis2-supply"]);
  });

  it("fintech gets DORA directly, never the supplier version", () => {
    const out = ids(with_({ countries: ["DK"], firmType: "financial", customers: ["finance"] }));
    expect(out).toContain("dora-direct");
    expect(out).not.toContain("dora-supplier");
  });

  it("medical AI gets MDR + Annex I but not the Annex III card", () => {
    const out = ids(with_({ countries: ["SE"], aiUse: "product", personalData: "yes", highRisk: ["medical"], customers: ["health"] }));
    expect(out).toContain("medical");
    expect(out).not.toContain("ai-act-high-risk");
  });

  it("installable software triggers the Cyber Resilience Act", () => {
    expect(ids(with_({ countries: ["SE"], installable: true }))).toEqual(["cra"]);
  });

  it("public-sector AI vendor sees procurement clauses", () => {
    expect(ids(with_({ countries: ["SE"], aiUse: "product", customers: ["public"], personalData: "no" }))).toContain("procurement");
  });

  it("every result has at least one source and an action", () => {
    const all = buildMap(
      with_({
        countries: ["SE", "NO", "DK", "FI", "EU"],
        firmType: "software",
        customers: ["finance", "insurance", "health", "public", "infra", "consumers"],
        aiUse: "own_models",
        facesUsers: true,
        personalData: "yes",
        highRisk: ["credit", "medical"],
        installable: true,
      }),
    );
    expect(all.length).toBeGreaterThan(8);
    for (const r of all) {
      expect(r.sources.length).toBeGreaterThan(0);
      expect(r.actions.length).toBeGreaterThan(0);
    }
  });
});

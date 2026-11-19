import { describe, expect, it } from "vitest";

import { BLANK_PROFILE, EXAMPLE_PROFILE, buildMap, type Profile } from "./rulemap";

// Golden profiles: the rule ids each one should switch on. When a rule changes, update the
// expectation deliberately and note why in the review log; a silent change here is a bug.
const ids = (p: Profile) => buildMap(p).map((r) => r.id).sort();
const with_ = (over: Partial<Profile>): Profile => ({ ...BLANK_PROFILE, ...over });

describe("rule map golden profiles", () => {
  it("example: Swedish SaaS with AI, selling to banks and insurers", () => {
    expect(ids(EXAMPLE_PROFILE)).toEqual(
      // 19 Nov expert review added nis2-cloud (medium SaaS) and pld (software as a product).
      ["ai-act-baseline", "ai-act-high-risk", "ai-act-transparency", "ccd2", "dora-supplier", "gdpr-ai", "nis2-cloud", "pld"].sort(),
    );
  });

  it("no AI, no regulated customers: nothing applies", () => {
    expect(ids(with_({ countries: ["SE"], size: "small" }))).toEqual([]);
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
    expect(ids(with_({ countries: ["SE"], size: "small", installable: true }))).toEqual(["cra", "pld"]);
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

  // Added 19 Nov 2026 after the persona test (TalkingHead/strategy/user_test_2026-11-19.md).
  it("finance-only customers get DORA, not NIS2 as well (DORA is the sector rule)", () => {
    const out = ids(with_({ countries: ["SE"], customers: ["finance", "insurance"] }));
    expect(out).toContain("dora-supplier");
    expect(out).not.toContain("nis2-supply");
  });

  it("Norway-only seller of installable software watches the CRA rather than applying it", () => {
    const cra = buildMap(with_({ countries: ["NO"], installable: true })).find((r) => r.id === "cra");
    expect(cra?.status).toBe("watch");
    expect(cra?.date).toBeUndefined();
    expect(buildMap(with_({ countries: ["SE"], installable: true })).find((r) => r.id === "cra")?.status).toBe("now");
  });

  it("consumer lender using automated credit scoring gets the Consumer Credit Directive", () => {
    const r = buildMap(with_({ countries: ["SE"], firmType: "financial", customers: ["consumers"], aiUse: "product", highRisk: ["credit"] }));
    expect(r.find((x) => x.id === "ccd2")?.title).toMatch(/consumers/);
    const lender = with_({ countries: ["SE"], firmType: "financial", customers: ["consumers"], aiUse: "product", highRisk: ["credit"] });
    expect(buildMap(lender, new Date("2026-11-19")).find((x) => x.id === "ccd2")?.status).toBe("soon");
    expect(buildMap(lender, new Date("2026-11-21")).find((x) => x.id === "ccd2")?.status).toBe("now");
  });

  it("no credit scoring, no Consumer Credit Directive", () => {
    expect(ids(with_({ countries: ["SE"], firmType: "financial", customers: ["consumers"], aiUse: "product" }))).not.toContain("ccd2");
  });

  it("medium SaaS firm is asked to check NIS2 cloud scope; a small one isn't", () => {
    expect(ids(with_({ countries: ["SE"], size: "medium" }))).toEqual(["nis2-cloud"]);
    expect(ids(with_({ countries: ["SE"], size: "small" }))).not.toContain("nis2-cloud");
  });

  it("Norway-only lender doesn't get the Consumer Credit Directive (not EEA law yet)", () => {
    const out = ids(
      with_({ countries: ["NO"], firmType: "financial", customers: ["consumers"], aiUse: "product", highRisk: ["credit"] }),
    );
    expect(out).not.toContain("ccd2");
  });

  it("Norway-only DORA supplier gets the Norwegian date", () => {
    const r = buildMap(with_({ countries: ["NO"], customers: ["finance"] })).find((x) => x.id === "dora-supplier");
    expect(r?.date).toBe("2025-07-01");
  });

  it("specific cards lead within a status; generic AI literacy and GDPR go last", () => {
    const now = buildMap(EXAMPLE_PROFILE).filter((r) => r.status === "now").map((r) => r.id);
    expect(now.slice(-2)).toEqual(["ai-act-baseline", "gdpr-ai"]);
  });

  it("product liability card is only for EU sellers of software products", () => {
    expect(ids(with_({ countries: ["NO"], aiUse: "product", personalData: "no" }))).not.toContain("pld");
    expect(ids(with_({ countries: ["SE"], size: "small", aiUse: "internal", personalData: "no" }))).not.toContain("pld");
  });
});

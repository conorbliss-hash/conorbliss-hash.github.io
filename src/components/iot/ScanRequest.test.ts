import { describe, expect, it } from "vitest";

import { normaliseSite } from "./ScanRequest";

describe("normaliseSite", () => {
  it("keeps only the site's origin", () => {
    expect(normaliseSite("WWW.Example-Vendor.se/about?x=1")).toBe("https://www.example-vendor.se");
    expect(normaliseSite("http://acme.no")).toBe("https://acme.no");
    expect(normaliseSite("  acme.fi  ")).toBe("https://acme.fi");
  });
  it("rejects things that aren't public websites", () => {
    for (const bad of ["", "acme", "localhost", "192.168.1.1", "http://10.0.0.1/x", "not a url"]) {
      expect(normaliseSite(bad)).toBeNull();
    }
  });
});

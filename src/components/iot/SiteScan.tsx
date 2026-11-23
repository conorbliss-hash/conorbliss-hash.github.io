import { useState } from "react";
import { AlertTriangle, ExternalLink, Globe, Loader2, Search } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import type { Profile } from "@/lib/rulemap";

// Talks to the scan-site edge function in the private intelligence-on-tap-scanner repo.
// Until VITE_SCAN_ENDPOINT is set at build time, the box shows a "not switched on yet" state.
const ENDPOINT = import.meta.env.VITE_SCAN_ENDPOINT as string | undefined;
export const SCAN_ENABLED = Boolean(ENDPOINT);

type Confidence = "found" | "inferred" | "unknown";
type Evidence = { quote: string; url: string };
type Gap = { id: string; severity: "high" | "medium" | "low"; title: string; detail: string; evidence: Evidence[] };
export type ScanResult = {
  origin: string;
  scannedAt: string;
  pages: { url: string; kind: string; title: string }[];
  prefill: { profile: Profile; confidence: Record<keyof Profile, Confidence> };
  gaps: Gap[];
  cached?: boolean;
};

const SEVERITY: Record<Gap["severity"], { label: string; pill: string }> = {
  high: { label: "Check first", pill: "bg-destructive/10 text-destructive" },
  medium: { label: "Worth checking", pill: "bg-accent/15 text-foreground" },
  low: { label: "Minor", pill: "bg-muted text-muted-foreground" },
};

const FIELD_LABEL: Partial<Record<keyof Profile, string>> = {
  countries: "Where you sell",
  firmType: "Kind of company",
  size: "Staff",
  customers: "Customers",
  aiUse: "How you use AI",
  facesUsers: "AI talks to people",
  personalData: "Personal data in AI",
  highRisk: "High-risk uses",
  installable: "Installable software",
};

const host = (u: string) => {
  try {
    const { hostname, pathname } = new URL(u);
    return `${hostname.replace(/^www\./, "")}${pathname === "/" ? "" : pathname}`;
  } catch {
    return u;
  }
};

const cleanTitle = (t: string) => {
  const s = t.replace(/^Worth checking:\s*/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const GapCard = ({ g }: { g: Gap }) => (
  <article className="rounded-xl border border-border bg-background p-4">
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${SEVERITY[g.severity].pill}`}>
        {SEVERITY[g.severity].label}
      </span>
    </div>
    <h4 className="mt-2 font-medium leading-snug">{cleanTitle(g.title)}</h4>
    <p className="mt-1 text-sm text-muted-foreground">{g.detail}</p>
    {g.evidence.length > 0 && (
      <ul className="mt-3 space-y-2">
        {g.evidence.map((e, i) => (
          <li key={i} className="border-l-2 border-primary/40 pl-3 text-sm">
            <q className="italic">{e.quote}</q>{" "}
            <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline">
              {host(e.url)} <ExternalLink className="h-3 w-3" />
            </a>
          </li>
        ))}
      </ul>
    )}
  </article>
);

export const SiteScan = ({ onPrefill }: { onPrefill: (p: Profile) => void }) => {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const scan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ENDPOINT || !url.trim() || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 120_000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
        signal: ctrl.signal,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "The scan failed. Answer the questions instead.");
      setResult(body as ScanResult);
      onPrefill((body as ScanResult).prefill.profile);
      trackEvent("Site scanned", { gaps: (body as ScanResult).gaps.length, cached: Boolean(body.cached) });
    } catch (err) {
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "The scan took too long. Try again, or answer the questions instead."
          : err instanceof Error
            ? err.message
            : "The scan failed.",
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };

  const flagged = result ? result.gaps.filter((g) => g.severity !== "low").length : 0;
  const checked = result
    ? (Object.entries(result.prefill.confidence) as [keyof Profile, Confidence][]).filter(([k, c]) => c !== "unknown" && FIELD_LABEL[k])
    : [];

  return (
    <section aria-label="Scan your website" className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold">Is your website a compliance risk?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your website. We read your public pages (product, trust, privacy, subprocessors) the way a bank's vendor-risk team
            would, and show what they'd flag. Every finding quotes your own page. Free, about a minute.
          </p>
        </div>
      </div>

      <form onSubmit={scan} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="iot-url" className="sr-only">
          Company website
        </label>
        <input
          id="iot-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourcompany.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={!ENDPOINT || busy}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!ENDPOINT || busy || !url.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {busy ? "Reading your site…" : "Scan"}
        </button>
      </form>

      {!ENDPOINT && (
        <p className="mt-2 text-xs text-muted-foreground">Scanning isn't switched on yet in this beta. Answer the questions below for now.</p>
      )}
      {busy && <p className="mt-2 text-xs text-muted-foreground">This usually takes 30–60 seconds.</p>}
      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {result && (
        <div className="mt-5 space-y-5" aria-live="polite">
          <div>
            <h3 className="font-display text-base font-semibold">
              {flagged > 0
                ? `Yes: ${flagged} thing${flagged === 1 ? "" : "s"} a bank reviewer would likely flag`
                : "No big flags"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.gaps.length
                ? `${result.gaps.length} point${result.gaps.length === 1 ? "" : "s"} in all, from the ${result.pages.length} pages we read.`
                : `Nothing stood out on the ${result.pages.length} pages we read.`}{" "}
              We only read public pages, so treat these as questions a reviewer would ask, not verdicts. General information, not legal advice.
            </p>
          </div>
          {result.gaps.length > 0 && (
            <div className="space-y-3">
              {result.gaps.map((g) => (
                <GapCard key={g.id} g={g} />
              ))}
            </div>
          )}
          {checked.length > 0 && (
            <div className="rounded-xl bg-accent/10 p-4 text-sm">
              <p className="font-medium">We filled in your answers from the site. Please check them.</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {checked.map(([k, c]) => (
                  <li key={k} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs">
                    {FIELD_LABEL[k]} · <span className="text-muted-foreground">{c === "found" ? "found" : "our guess"}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer">Pages we read</summary>
            <ul className="mt-2 space-y-1">
              {result.pages.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                    {host(p.url)}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </section>
  );
};

import { useState } from "react";
import { AlertTriangle, ExternalLink, Loader2, Search } from "lucide-react";

import { AnswerPack } from "@/components/iot/AnswerPack";
import { FollowUp } from "@/components/iot/FollowUp";
import type { Evidence, Readiness } from "@/lib/answerPack";
import { trackEvent } from "@/lib/analytics";
import type { Profile } from "@/lib/rulemap";

// Talks to the scan-site edge function in the private intelligence-on-tap-scanner repo.
// Until VITE_SCAN_ENDPOINT is set at build time, the box shows a "not switched on yet" state.
const ENDPOINT = import.meta.env.VITE_SCAN_ENDPOINT as string | undefined;
export const SCAN_ENABLED = Boolean(ENDPOINT);

type Confidence = "found" | "inferred" | "unknown";
type Gap = { id: string; severity: "high" | "medium" | "low"; title: string; detail: string; evidence: Evidence[] };
export type ScanResult = {
  origin: string;
  scannedAt: string;
  pages: { url: string; kind: string; title: string }[];
  prefill: { profile: Profile; confidence: Record<keyof Profile, Confidence> };
  gaps: Gap[];
  readiness?: Readiness;
  claims?: { company_name?: string };
  cached?: boolean;
};

const SEVERITY: Record<Gap["severity"], { label: string; pill: string }> = {
  high: { label: "Check first", pill: "bg-destructive/10 text-destructive" },
  medium: { label: "Worth checking", pill: "bg-accent/15 text-foreground" },
  low: { label: "Minor", pill: "bg-muted text-muted-foreground" },
};

const packHeadline = (r: Readiness) => {
  const lead = r.answered
    ? `${r.answered} of the 20 questions customers ask about your AI, answered from your own pages`
    : "Your site doesn't yet answer any of the 20 questions customers ask about your AI";
  return r.contradicted ? `${lead}, and ${r.contradicted} where your pages disagree` : lead;
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
    <h3 className="mt-2 font-medium leading-snug">{cleanTitle(g.title)}</h3>
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
    if (!url.trim()) {
      document.getElementById("iot-url")?.focus();
      return;
    }
    if (!ENDPOINT || busy) return;
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
          : err instanceof TypeError
            ? "Couldn't reach the scanner. Try again, or answer the questions instead."
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
  const clashes = result ? result.gaps.filter((g) => g.id.startsWith("inconsistency")) : [];
  const others = result ? result.gaps.filter((g) => !g.id.startsWith("inconsistency")) : [];

  return (
    <section aria-label="Scan your website">
      <form onSubmit={scan} className="flex flex-col gap-2 sm:flex-row">
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
          className="h-12 w-full min-w-0 shrink-0 sm:flex-1 rounded-lg border border-border bg-card px-4 text-base shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!ENDPOINT || busy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {busy ? "Drafting your answers…" : "Get my free answers"}
        </button>
      </form>

      {!ENDPOINT && (
        <p className="mt-2 text-xs text-muted-foreground">Scanning isn't switched on in this build. Answer the questions instead.</p>
      )}
      {busy && <p className="mt-2 text-xs text-muted-foreground">This usually takes 30–60 seconds.</p>}
      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-5" aria-live="polite">
          {result.readiness && result.readiness.checked.length > 0 ? (
            <>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Your free AI answer pack</p>
                <h2 className="mt-1 font-display text-xl font-semibold leading-snug">
                  {packHeadline(result.readiness)}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  These are the 20 AI questions customers' security and procurement reviewers ask most. Open any question to see the draft,
                  copy it, or download all 20 for your next questionnaire. Read from {result.pages.length} public pages.
                </p>
              </div>
              {clashes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-base font-semibold">Fix first: your pages disagree</h3>
                  {clashes.map((g) => (
                    <GapCard key={g.id} g={g} />
                  ))}
                </div>
              )}
              <AnswerPack readiness={result.readiness} origin={result.origin} company={result.claims?.company_name} />
              {others.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer list-none text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
                    {others.length} other thing{others.length === 1 ? "" : "s"} a reviewer would notice
                  </summary>
                  <div className="mt-3 space-y-3">
                    {others.map((g) => (
                      <GapCard key={g.id} g={g} />
                    ))}
                  </div>
                </details>
              )}
              <FollowUp domain={result.origin} flags={flagged} only={["questionnaire", "watch"]} heading="Next, if you want it (also free)" />
            </>
          ) : (
            <>
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {flagged > 0
                    ? `Yes: ${flagged} thing${flagged === 1 ? "" : "s"} a customer's reviewer would likely flag`
                    : "No big flags"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  From the {result.pages.length} pages we read. Treat these as questions a reviewer would ask, not verdicts. General information,
                  not legal advice.
                </p>
              </div>
              <div className="space-y-3">
                {result.gaps.map((g) => (
                  <GapCard key={g.id} g={g} />
                ))}
              </div>
              <FollowUp domain={result.origin} flags={flagged} />
            </>
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

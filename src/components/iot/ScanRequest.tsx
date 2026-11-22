import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { REVIEWED, type Profile } from "@/lib/rulemap";

// Until the live scanner is switched on (VITE_SCAN_ENDPOINT), a visitor can still leave
// their company website. The request is stored as a scan_request event; Conor runs the
// scanner and emails the result.

const FREE_MAIL = /@(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|me|proton|protonmail|aol|gmx)\./i;

export const normaliseSite = (raw: string): string | null => {
  const s = raw.trim();
  if (!s) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    const host = u.hostname.toLowerCase();
    if (!host.includes(".") || /^\d+(\.\d+){3}$/.test(host) || host === "localhost") return null;
    if (!/\.[a-z]{2,}$/i.test(host)) return null;
    return `https://${host}`;
  } catch {
    return null;
  }
};

export const ScanRequest = ({ profile, isExample }: { profile: Profile; isExample: boolean }) => {
  const [site, setSite] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const url = normaliseSite(site);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const freeMail = emailOk && FREE_MAIL.test(email.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!url || !emailOk || !consent) return;
    setState("sending");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("site_events").insert({
        event_name: "scan_request",
        path: "/intelligence-on-tap",
        props: {
          url,
          email: email.trim().toLowerCase(),
          // The answers are only useful if the visitor changed them from the example.
          profile: isExample ? null : profile,
          reviewed: REVIEWED,
        },
      });
      if (error) throw error;
      trackEvent("Scan requested", { answered: !isExample });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div id="check-site" className="scroll-mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <p className="font-display text-lg font-semibold">Got it: {url?.replace(/^https:\/\/(www\.)?/, "")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          I'll read its public pages and email you what a customer's vendor-risk team would question, each point with the quote and
          the page it's on. It usually takes two working days.
        </p>
      </div>
    );
  }

  const bad = (ok: boolean) => touched && !ok;

  return (
    <form id="check-site" onSubmit={submit} noValidate className="scroll-mt-4 rounded-2xl border-2 border-primary/40 bg-card p-6">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
        <Globe className="h-3.5 w-3.5" /> Free website check
      </p>
      <p className="mt-2 font-display text-lg font-semibold leading-snug">What does your website promise a bank's risk team?</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Buyers read your site before they send the questionnaire. I'll check its public pages for what you say about AI, data and
        security, and send back the gaps they'd ask about, each with the quote. Free, by email.
      </p>
      <div className="mt-4 grid gap-2">
        <label htmlFor="iot-site" className="text-xs font-medium text-foreground">Company website</label>
        <input
          id="iot-site"
          inputMode="url"
          autoComplete="url"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          placeholder="yourcompany.com"
          aria-invalid={bad(!!url)}
          className={`h-11 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${bad(!!url) ? "border-destructive" : "border-input"}`}
        />
        {bad(!!url) && <p className="text-xs text-destructive">Enter your company's website, like yourcompany.com.</p>}
        <label htmlFor="iot-scan-email" className="mt-2 text-xs font-medium text-foreground">Work email</label>
        <input
          id="iot-scan-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourcompany.com"
          aria-invalid={bad(emailOk)}
          className={`h-11 rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${bad(emailOk) ? "border-destructive" : "border-input"}`}
        />
        {bad(emailOk) && <p className="text-xs text-destructive">Enter an email address so I can send the result.</p>}
        {freeMail && <p className="text-xs text-muted-foreground">A work address helps me check you're with the company. A personal one works too.</p>}
      </div>
      <label htmlFor="iot-scan-consent" className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <input id="iot-scan-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>
          Store my email{isExample ? "" : ", my answers above"} and this website to send the check. Used for nothing else; ask and it's deleted.
        </span>
      </label>
      {bad(consent) && <p className="mt-1 text-xs text-destructive">Tick the box so I can store the request.</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
      >
        {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === "sending" ? "Sending…" : "Check my website"}
      </button>
      {state === "error" && (
        <p className="mt-3 text-sm text-destructive">That didn't send. Try again, or email the website to conor.bliss.henaghan@gmail.com.</p>
      )}
    </form>
  );
};

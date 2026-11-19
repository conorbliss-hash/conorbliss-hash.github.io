import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ChevronDown, Copy, ExternalLink, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

import { SCAN_ENABLED, SiteScan } from "@/components/iot/SiteScan";
import { trackEvent, trackPageview } from "@/lib/analytics";
import {
  BLANK_PROFILE,
  EXAMPLE_PROFILE,
  REVIEWED,
  asText,
  buildMap,
  customerQuestions,
  upcoming,
  type AiUse,
  type Country,
  type Customer,
  type FirmType,
  type HighRisk,
  type Profile,
  type RuleResult,
  type Size,
  type Status,
} from "@/lib/rulemap";

type Opt<T extends string> = { value: T; label: string };

const COUNTRIES: Opt<Country>[] = [
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "EU", label: "Rest of EU" },
];
const FIRM: Opt<FirmType>[] = [
  { value: "software", label: "Software / SaaS" },
  { value: "msp", label: "Managed IT or security services" },
  { value: "financial", label: "Bank, insurer or fintech" },
  { value: "other", label: "Something else" },
];
const SIZES: Opt<Size>[] = [
  { value: "small", label: "Under 50" },
  { value: "medium", label: "50–249" },
  { value: "large", label: "250+" },
];
const CUSTOMERS: Opt<Customer>[] = [
  { value: "finance", label: "Banks" },
  { value: "insurance", label: "Insurers" },
  { value: "health", label: "Healthcare" },
  { value: "public", label: "Public sector" },
  { value: "infra", label: "Energy, transport, telecom" },
  { value: "consumers", label: "Consumers" },
];
const AI_USE: Opt<AiUse>[] = [
  { value: "none", label: "No AI" },
  { value: "internal", label: "Internal tools only" },
  { value: "product", label: "AI in our product (via APIs)" },
  { value: "own_models", label: "We train our own models" },
];
const HIGH_RISK: Opt<HighRisk>[] = [
  { value: "credit", label: "Credit scoring" },
  { value: "insurance_pricing", label: "Life/health insurance pricing" },
  { value: "hr", label: "Hiring or managing staff" },
  { value: "education", label: "Education or exams" },
  { value: "public_services", label: "Public benefits or services" },
  { value: "biometrics", label: "Biometrics" },
  { value: "critical_infra", label: "Critical infrastructure safety" },
  { value: "medical", label: "Medical diagnosis or treatment" },
];

const STATUS: Record<Status, { label: string; pill: string; bar: string }> = {
  now: { label: "Applies now", pill: "bg-primary text-primary-foreground", bar: "bg-primary" },
  soon: { label: "Coming", pill: "bg-accent/15 text-accent border border-accent/30", bar: "bg-accent" },
  watch: { label: "Watch", pill: "bg-muted text-muted-foreground border border-border", bar: "bg-muted-foreground/40" },
};

const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
      on ? "border-primary bg-primary/10 text-primary font-medium" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`}
  >
    {on && <Check className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />}
    {children}
  </button>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <fieldset className="border-t border-border pt-4">
    <legend className="text-sm font-semibold text-foreground">{label}</legend>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    <div className="mt-3 flex flex-wrap gap-2">{children}</div>
  </fieldset>
);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Progressive disclosure: the card shows what applies, when, and the one first step.
// Why it applies, the other steps, customer questions and sources sit one tap down.
const ResultCard = ({ r }: { r: RuleResult }) => (
  <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
    <span className={`absolute inset-y-0 left-0 w-1 ${STATUS[r.status].bar}`} aria-hidden />
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[r.status].pill}`}>{STATUS[r.status].label}</span>
      <span className="text-xs text-muted-foreground">{r.dateLabel}</span>
    </div>
    <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{r.title}</h3>
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.law}</p>
    <p className="mt-3 flex gap-2 text-sm">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>
        <span className="font-semibold">First step: </span>
        {r.actions[0]}
      </span>
    </p>
    <details className="group mt-3">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
        Why, next steps and sources
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 space-y-3 border-t border-border pt-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{r.why}</p>
        {r.actions.length > 1 && (
          <ul className="space-y-1.5">
            {r.actions.slice(1).map((a) => (
              <li key={a} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        )}
        {r.asks.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customers will ask</p>
            <ul className="mt-1 space-y-1">
              {r.asks.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {r.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              {s.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </details>
  </article>
);

const SignUp = ({ profile, count }: { profile: Profile; count: number }) => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !/^\S+@\S+\.\S+$/.test(email)) return;
    setState("sending");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("site_events").insert({
        event_name: "briefing_signup",
        path: "/intelligence-on-tap",
        props: { email: email.trim().toLowerCase(), profile, rules: count, reviewed: REVIEWED },
      });
      if (error) throw error;
      trackEvent("Briefing signup", { rules: count });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <p className="font-display text-lg font-semibold">You're on the list.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The first briefing goes out early next month: only the changes that matter for this profile, with sources.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6">
      <p className="font-display text-lg font-semibold">Get the changes for this profile, monthly</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Rules keep moving until 2028. One short email a month, only what changed for companies like yours. Free.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="iot-email" className="sr-only">Work email</label>
        <input
          id="iot-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={!consent || state === "sending"}
          className="h-11 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state === "sending" ? "Saving…" : "Send me the briefing"}
        </button>
      </div>
      <label htmlFor="iot-consent" className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <input id="iot-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
        <span>
          Store my email and the answers above to send this briefing. I can unsubscribe at any time, and the data is used for nothing else.
        </span>
      </label>
      {state === "error" && (
        <p className="mt-3 text-sm text-destructive">That didn't save. Try again, or email conor.bliss.henaghan@gmail.com.</p>
      )}
    </form>
  );
};

const Feedback = ({ profile, ruleIds }: { profile: Profile; ruleIds: string[] }) => {
  const [verdict, setVerdict] = useState<"right" | "partly" | "wrong" | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!verdict) return;
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("site_events").insert({
        event_name: "rulemap_feedback",
        path: "/intelligence-on-tap",
        props: { verdict, note: note.trim().slice(0, 1000), profile, rules: ruleIds, reviewed: REVIEWED },
      });
    } catch {
      /* feedback is best-effort */
    }
    trackEvent("Rule map feedback", { verdict });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-sm">
        <p className="font-semibold">Thanks, that helps.</p>
        <p className="mt-1 text-muted-foreground">Every answer is read, and the map improves from them.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-display text-base font-semibold">Was this map right for your company?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["right", "Yes, mostly right"],
            ["partly", "Partly"],
            ["wrong", "No, it's off"],
          ] as const
        ).map(([v, label]) => (
          <Chip key={v} on={verdict === v} onClick={() => setVerdict(v)}>
            {label}
          </Chip>
        ))}
      </div>
      {verdict && (
        <div className="mt-3 space-y-2">
          <label htmlFor="iot-note" className="block text-xs text-muted-foreground">
            {verdict === "right" ? "Anything you'd add? (optional)" : "What's missing or wrong?"}
          </label>
          <textarea
            id="iot-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={send}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Send feedback
          </button>
        </div>
      )}
    </div>
  );
};

const IntelligenceOnTap = () => {
  const [profile, setProfile] = useState<Profile>(EXAMPLE_PROFILE);
  const [isExample, setIsExample] = useState(true);
  const [copied, setCopied] = useState(false);
  // High-risk uses are behind a yes/no gate so most visitors never see the eight-way list.
  const [decidesAboutPeople, setDecidesAboutPeople] = useState(EXAMPLE_PROFILE.highRisk.length > 0);
  const [showWatch, setShowWatch] = useState(false);

  useEffect(() => {
    trackPageview();
    document.title = "Intelligence on Tap: which AI rules apply to you? | Conor Bliss";
  }, []);

  const results = useMemo(() => buildMap(profile), [profile]);
  const next = useMemo(() => upcoming(results), [results]);
  const asks = useMemo(() => customerQuestions(results), [results]);
  const main = results.filter((r) => r.status !== "watch");
  const watch = results.filter((r) => r.status === "watch");
  const nNow = results.filter((r) => r.status === "now").length;
  const nSoon = results.filter((r) => r.status === "soon").length;

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setIsExample(false);
    setProfile((p) => ({ ...p, [key]: value }));
  };
  const toggle = <T extends string>(key: "countries" | "customers" | "highRisk", value: T) => {
    setIsExample(false);
    setProfile((p) => {
      const cur = p[key] as string[];
      return { ...p, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });
  };
  const load = (p: Profile, example: boolean) => {
    setProfile(p);
    setIsExample(example);
    setDecidesAboutPeople(p.highRisk.length > 0);
  };

  const copy = async () => {
    const text = asText(profile, results);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent("Rule map copied", { rules: results.length });
    } catch {
      /* clipboard refused: nothing else to do */
    }
  };

  const summary = [nNow && `${nNow} ${nNow === 1 ? "applies" : "apply"} now`, nSoon && `${nSoon} coming`, watch.length && `${watch.length} to watch`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="section-container flex h-16 items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-display font-semibold text-gradient">Conor Bliss</span>
          </a>
          <span className="text-xs text-muted-foreground">Reviewed {REVIEWED}</span>
        </div>
      </header>

      <main className="section-container py-10 md:py-14">
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Intelligence on Tap · free tool
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Which AI rules apply to your company?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Answer a few questions. See which EU and Nordic rules apply, when, and the first step for each.
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              A transparent rule set, not a chatbot. Every line links to its source. General information, not legal advice. Built by
              Conor Bliss, AIGP and ISO/IEC 42001 certified.
            </span>
          </p>
        </div>

        {SCAN_ENABLED && (
          <div className="mt-8 max-w-3xl">
            <SiteScan
              onPrefill={(p) => {
                load(p, false);
              }}
            />
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
          {/* Questions: five core ones; follow-ups appear only when an answer makes them matter. */}
          <section id="your-company" aria-label="Your company" className="order-2 scroll-mt-4 rounded-2xl border border-border bg-card p-5 lg:order-1 lg:sticky lg:top-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold">Your company</h2>
              <button
                type="button"
                onClick={() => (isExample ? load(BLANK_PROFILE, false) : load(EXAMPLE_PROFILE, true))}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {isExample ? "Start blank" : "Load example"}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {isExample ? "Showing an example. Change any answer. " : ""}Nothing you enter is saved unless you sign up.
            </p>

            <div className="mt-4 space-y-4">
              <Field label="Where do you sell?">
                {COUNTRIES.map((o) => (
                  <Chip key={o.value} on={profile.countries.includes(o.value)} onClick={() => toggle("countries", o.value)}>
                    {o.label}
                  </Chip>
                ))}
              </Field>
              <Field label="What kind of company?">
                {FIRM.map((o) => (
                  <Chip key={o.value} on={profile.firmType === o.value} onClick={() => set("firmType", o.value)}>
                    {o.label}
                  </Chip>
                ))}
              </Field>
              {/* Size only changes the result for IT and SaaS firms (NIS2 size threshold). */}
              {(profile.firmType === "msp" || profile.firmType === "software") && (
                <Field label="How many staff?">
                  {SIZES.map((o) => (
                    <Chip key={o.value} on={profile.size === o.value} onClick={() => set("size", o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </Field>
              )}
              <Field label="Who are your customers?" hint="Pick all that apply.">
                {CUSTOMERS.map((o) => (
                  <Chip key={o.value} on={profile.customers.includes(o.value)} onClick={() => toggle("customers", o.value)}>
                    {o.label}
                  </Chip>
                ))}
              </Field>
              <Field label="How do you use AI?">
                {AI_USE.map((o) => (
                  <Chip key={o.value} on={profile.aiUse === o.value} onClick={() => set("aiUse", o.value)}>
                    {o.label}
                  </Chip>
                ))}
              </Field>
              <Field label="Do you sell installable software or connected devices?" hint="Not only SaaS.">
                <Chip on={profile.installable} onClick={() => set("installable", true)}>Yes</Chip>
                <Chip on={!profile.installable} onClick={() => set("installable", false)}>No</Chip>
              </Field>

              {profile.aiUse !== "none" && (
                <div className="space-y-4 rounded-xl bg-muted/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About your AI</p>
                  <Field label="Does it talk to people or create content they see?">
                    <Chip on={profile.facesUsers} onClick={() => set("facesUsers", true)}>Yes</Chip>
                    <Chip on={!profile.facesUsers} onClick={() => set("facesUsers", false)}>No</Chip>
                  </Field>
                  <Field label="Does personal data go through it?">
                    {(["yes", "no", "unsure"] as const).map((v) => (
                      <Chip key={v} on={profile.personalData === v} onClick={() => set("personalData", v)}>
                        {v === "yes" ? "Yes" : v === "no" ? "No" : "Not sure"}
                      </Chip>
                    ))}
                  </Field>
                  <Field label="Does it help decide things about people?" hint="Credit, insurance, jobs, exams, benefits, health, or biometrics.">
                    <Chip on={decidesAboutPeople} onClick={() => setDecidesAboutPeople(true)}>Yes</Chip>
                    <Chip
                      on={!decidesAboutPeople}
                      onClick={() => {
                        setDecidesAboutPeople(false);
                        set("highRisk", []);
                      }}
                    >
                      No
                    </Chip>
                  </Field>
                  {decidesAboutPeople && (
                    <Field label="Which ones?" hint="These are high-risk uses under the AI Act.">
                      {HIGH_RISK.map((o) => (
                        <Chip key={o.value} on={profile.highRisk.includes(o.value)} onClick={() => toggle("highRisk", o.value)}>
                          {o.label}
                        </Chip>
                      ))}
                    </Field>
                  )}
                </div>
              )}
            </div>
            <a href="#your-map" className="mt-5 flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground lg:hidden">
              See your map <ArrowUp className="h-4 w-4" />
            </a>
          </section>

          {/* Map: the answer first, then one card per rule, details one tap down. */}
          <section id="your-map" aria-label="Your rule map" aria-live="polite" className="order-1 scroll-mt-4 min-w-0 space-y-5 lg:order-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-2xl font-semibold">{isExample ? "Example rule map" : "Your rule map"}</h2>
              {isExample && (
                <p className="mt-1 text-sm text-muted-foreground">
                  A 120-person Swedish SaaS firm with AI in its product, selling to banks and insurers.{" "}
                  <a href="#your-company" className="font-medium text-primary hover:underline lg:hidden">
                    Check your own company
                  </a>
                </p>
              )}
              {results.length ? (
                <>
                  <p className="mt-1 text-base">{summary}</p>
                  {next[0] && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Next deadline: <strong className="text-foreground">{fmtDate(next[0].date!)}</strong>, {next[0].title.toLowerCase()} ({next[0].law}).
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copy}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary/50"
                  >
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy as text"}
                  </button>
                  {!isExample && (
                    <a href="#your-company" className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary/50 lg:hidden">
                      Change answers <ArrowDown className="h-3.5 w-3.5" />
                    </a>
                  )}
                  </div>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Pick where you sell and how you use AI to see your map.</p>
              )}
            </div>

            <div className="space-y-4">
              {main.map((r) => (
                <ResultCard key={r.id} r={r} />
              ))}
            </div>

            {watch.length > 0 && (
              <div>
                <button
                  type="button"
                  aria-expanded={showWatch}
                  onClick={() => setShowWatch((v) => !v)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  {showWatch ? "Hide" : "Show"} {watch.length} {watch.length === 1 ? "rule" : "rules"} to watch
                  <ChevronDown className={`h-4 w-4 transition-transform ${showWatch ? "rotate-180" : ""}`} />
                </button>
                {showWatch && (
                  <div className="mt-3 space-y-4">
                    {watch.map((r) => (
                      <ResultCard key={r.id} r={r} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {asks.length > 0 && (
              <details className="group rounded-2xl border border-border bg-card p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-base font-semibold [&::-webkit-details-marker]:hidden">
                  The {asks.length} questions your customers will ask
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <ol className="mt-3 space-y-2">
                  {asks.map((q, i) => (
                    <li key={q} className="flex gap-3 text-sm">
                      <span className="font-display text-primary">{i + 1}</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            {results.length > 0 && <Feedback profile={profile} ruleIds={results.map((r) => r.id)} />}

            {results.length > 0 && <SignUp profile={profile} count={results.length} />}
          </section>
        </div>

        <details className="group mt-16 border-t border-border pt-8">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
            How it works and what it covers
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-4 grid max-w-4xl gap-6 text-sm leading-relaxed text-muted-foreground md:grid-cols-3">
            <p>
              <strong className="text-foreground">How it works.</strong> Each answer switches specific rules on or off, and every
              result links to the law or regulator it comes from. The same answers always give the same map.
            </p>
            <p>
              <strong className="text-foreground">What it covers.</strong> The EU AI Act (including the 2026 Digital Omnibus dates),
              GDPR as it touches AI, DORA and NIS2 as they reach suppliers, the Consumer Credit Directive on automated credit
              decisions, the Cyber Resilience Act, the new Product Liability Directive, medical-device AI, and Nordic regulators. Rules reviewed {REVIEWED}.
            </p>
            <p>
              <strong className="text-foreground">What it isn't.</strong> General information, not legal advice. It flags what's
              likely to apply so you know where to look. Check anything important with your own counsel.
            </p>
          </div>
        </details>

        <p className="mt-10 text-sm text-muted-foreground">
          Built by{" "}
          <a href="/" className="font-medium text-foreground underline-offset-2 hover:underline">
            Conor Bliss
          </a>
          , AIGP and ISO/IEC 42001 certified. Views are my own.
        </p>
      </main>
    </div>
  );
};

export default IntelligenceOnTap;

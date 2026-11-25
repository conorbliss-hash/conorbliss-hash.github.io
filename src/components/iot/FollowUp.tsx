import { useState } from "react";
import { Bell, FileQuestion, Loader2, Wand2 } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { REVIEWED } from "@/lib/rulemap";

// The next steps under every scan result. Each press is stored as a scan_followup event:
// who has a live questionnaire to answer (the acute, paid problem), who wants suggested rewrites,
// and who wants a monthly re-check. Conor replies personally; nothing is sent automatically yet.

type Action = "questionnaire" | "fix" | "watch";

const FREE_MAIL = /@(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|me|proton|protonmail|aol|gmx)\./i;

const COPY: Record<Action, { button: string; title: string; body: string; done: string }> = {
  questionnaire: {
    button: "Answer a customer AI questionnaire",
    title: "Get your AI answers drafted",
    body: "Got a security or procurement questionnaire with AI questions from a customer? Tell me who sent it and when it's due. I'll draft the AI answers (and DORA, for banks and insurers), with evidence from your own pages, within 5 working days. Free during the pilot.",
    done: "Thanks. I'll reply within one working day to get the questionnaire from you.",
  },
  watch: {
    button: "Watch my site monthly",
    title: "Re-check this site every month",
    body: "You get an email only when something a reviewer would notice changes. Use an email on this website's domain, so nobody can watch a competitor.",
    done: "You're on the list. The first re-check runs next month.",
  },
  fix: {
    button: "Suggest fixes",
    title: "Get a suggested rewrite for each flag",
    body: "For each point above, a suggested sentence that makes your pages agree. I'll send them personally within a few days.",
    done: "Thanks. I'll send the suggested fixes by email within a few days.",
  },
};

export const FollowUp = ({
  domain,
  flags,
  only,
  heading = "What next?",
}: {
  domain: string;
  flags: number;
  only?: Action[];
  heading?: string;
}) => {
  const actions: Action[] = only ?? ["questionnaire", "fix", "watch"];
  const [action, setAction] = useState<Action | null>(actions.length === 1 ? actions[0] : null);
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const site = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  const clean = email.trim().toLowerCase();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
  const onDomain = emailOk && (clean.endsWith(`@${site}`) || clean.endsWith(`.${site}`));
  const valid = emailOk && consent && (action !== "watch" || onDomain);

  const choose = (a: Action) => {
    setAction(a);
    setState("idle");
    trackEvent("Scan follow-up opened", { action: a });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action || !valid) return;
    setState("sending");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.from("site_events").insert({
        event_name: "scan_followup",
        path: "/intelligence-on-tap",
        props: { action, domain: site || clean.split("@")[1], email: clean, flags, note: note.trim().slice(0, 300) || undefined, reviewed: REVIEWED },
      });
      if (error) throw error;
      trackEvent("Scan follow-up", { action });
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div className={only ? "" : "border-t border-border pt-5"}>
      <p className="font-display text-base font-semibold">{heading}</p>
      {actions.length > 1 && (
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {actions.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={action === a}
            onClick={() => choose(a)}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              action === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
            }`}
          >
            {a === "fix" ? <Wand2 className="h-4 w-4" /> : a === "watch" ? <Bell className="h-4 w-4" /> : <FileQuestion className="h-4 w-4" />}
            {COPY[a].button}
          </button>
        ))}
      </div>
      )}

      {action && state === "done" && <p className="mt-4 rounded-lg bg-primary/5 p-3 text-sm">{COPY[action].done}</p>}

      {action && state !== "done" && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <p className="text-sm font-medium">{COPY[action].title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{COPY[action].body}</p>
          </div>
          {action === "questionnaire" && (
            <div>
              <label htmlFor="iot-followup-note" className="sr-only">
                Who sent it, and when is it due?
              </label>
              <input
                id="iot-followup-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                placeholder="Who sent it, and when is it due?"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="iot-followup-email" className="sr-only">
              Work email
            </label>
            <input
              id="iot-followup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={site ? `you@${site}` : "you@yourcompany.com"}
              className="h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
            />
            <button
              type="submit"
              disabled={!valid || state === "sending"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
              {action === "watch" ? "Watch monthly" : action === "fix" ? "Send me the fixes" : "Get help answering it"}
            </button>
          </div>
          {action === "watch" && emailOk && !onDomain && (
            <p className="text-xs text-destructive">Use an email address on {site} for monthly watching.</p>
          )}
          {action !== "watch" && emailOk && FREE_MAIL.test(clean) && (
            <p className="text-xs text-muted-foreground">A work email helps me check you're with {site || "the company"}.</p>
          )}
          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
            <span>Store my email{site ? " and this website" : ""} to reply to this. Used for nothing else; ask and it's deleted.</span>
          </label>
          {state === "error" && <p className="text-sm text-destructive">That didn't save. Try again in a moment.</p>}
        </form>
      )}
    </div>
  );
};

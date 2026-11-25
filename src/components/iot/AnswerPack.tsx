import { useMemo, useState } from "react";
import { Check, Copy, Download, ExternalLink, FileText } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { aiPageMarkdown, buildPack, packCsv, pageName, STATUS_LABEL, type PackItem, type PackStatus, type Readiness } from "@/lib/answerPack";

const DOT: Record<PackStatus, string> = {
  answered: "bg-primary",
  contradicted: "bg-destructive",
  thin: "bg-accent",
  missing: "bg-muted-foreground/40",
  private: "bg-muted-foreground/20",
};

const ORDER: PackStatus[] = ["contradicted", "answered", "thin", "missing", "private"];

const save = (name: string, body: string, type: string) => {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Row = ({ i }: { i: PackItem }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(i.draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  };
  return (
    <li>
      <details className="group rounded-lg border border-border bg-background">
        <summary className="flex cursor-pointer list-none items-start gap-3 px-3 py-2.5 [&::-webkit-details-marker]:hidden">
          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[i.status]}`} aria-hidden />
          <span className="min-w-0 flex-1 text-sm leading-snug">{i.question}</span>
          <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{STATUS_LABEL[i.status]}</span>
        </summary>
        <div className="space-y-2 border-t border-border px-3 py-3 text-sm">
          <p className="text-xs text-muted-foreground sm:hidden">{STATUS_LABEL[i.status]}</p>
          <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 leading-relaxed">{i.draft}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <button type="button" onClick={copy} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy answer"}
            </button>
            {[...new Set(i.evidence.map((e) => e.url))].map((u) => ({ url: u })).map((e, k) => (
              <a key={k} href={e.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary hover:underline">
                {pageName(e.url)} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </details>
    </li>
  );
};

/** The free pack: a draft answer to each of the 20 questions, from the site's own words. */
export const AnswerPack = ({ readiness, origin, company: named }: { readiness: Readiness; origin: string; company?: string }) => {
  const pack = useMemo(() => buildPack(readiness), [readiness]);
  const site = pageName(origin);
  const company = named?.trim() || site.split(".")[0].replace(/^./, (c) => c.toUpperCase());
  const items = [...pack.items].sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status) || a.n - b.n);
  const started = pack.counts.answered + pack.counts.thin;

  return (
    <section aria-label="Your AI answer pack" className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ["answered", pack.counts.answered, "drafted from your pages"],
            ["contradicted", pack.counts.contradicted, "where your pages disagree"],
            ["thin", pack.counts.thin, "mentioned, no detail"],
            ["missing", pack.counts.missing + pack.counts.private, "you'll need to write"],
          ] as const
        ).map(([s, n, label]) => (
          <div key={s} className="rounded-lg border border-border bg-background px-3 py-2">
            <p className="flex items-center gap-1.5 font-display text-2xl font-semibold">
              <span className={`h-2.5 w-2.5 rounded-full ${DOT[s]}`} aria-hidden />
              {n}
            </p>
            <p className="text-xs leading-tight text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-1.5">
        {items.map((i) => (
          <Row key={i.id} i={i} />
        ))}
      </ul>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            save(`ai-answers-${site.replace(/[^a-z0-9.-]/gi, "_")}.csv`, packCsv(pack, site), "text/csv;charset=utf-8");
            trackEvent("Answer pack downloaded", { kind: "csv", started });
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Download all 20 answers (spreadsheet)
        </button>
        <button
          type="button"
          onClick={() => {
            save(`how-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-uses-ai.md`, aiPageMarkdown(pack, company), "text/markdown;charset=utf-8");
            trackEvent("Answer pack downloaded", { kind: "ai-page", started });
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium hover:border-primary hover:text-primary"
        >
          <FileText className="h-4 w-4" /> Draft "How we use AI" page
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Every draft uses only words from your own public pages. Brackets mark what you need to add. Check each answer before you send it.
        General information, not legal advice.
      </p>
    </section>
  );
};

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Summary = {
  days: number;
  pageviews: number;
  visitors: number;
  clicks: number;
  topReferrers: { label: string; count: number }[];
  devices: { label: string; count: number }[];
  topEvents: { label: string; count: number }[];
  daily: [string, number][];
};

const Stats = () => {
  const [passcode, setPasscode] = useState("");
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (nextDays = days, code = passcode) => {
    setLoading(true);
    setError(null);
    const { data: result, error: fnError } = await supabase.functions.invoke(
      `analytics-summary?days=${nextDays}`,
      { headers: { "x-analytics-passcode": code } },
    );
    setLoading(false);
    if (fnError) {
      setError("Could not load. Check the passcode and try again.");
      return;
    }
    setData(result as Summary);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-foreground">Site traffic</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Visits and link clicks recorded on conorbliss.com.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void load();
          }}
        >
          <Input
            type="password"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <Button type="submit" disabled={loading || passcode.length === 0}>
            {loading ? "Loading" : "View"}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {data && (
          <div className="mt-10 space-y-10">
            <div className="flex gap-2">
              {[7, 30, 90].map((d) => (
                <Button
                  key={d}
                  variant={days === d ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setDays(d);
                    void load(d);
                  }}
                >
                  {d} days
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Visitors", value: data.visitors },
                { label: "Page views", value: data.pageviews },
                { label: "Link clicks", value: data.clicks },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {[
              { title: "Traffic sources", rows: data.topReferrers },
              { title: "Devices", rows: data.devices },
              { title: "Clicks", rows: data.topEvents },
            ].map((block) => (
              <section key={block.title}>
                <h2 className="text-xs uppercase tracking-wider text-muted-foreground">
                  {block.title}
                </h2>
                <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
                  {block.rows.length === 0 && (
                    <li className="p-4 text-sm text-muted-foreground">No data yet</li>
                  )}
                  {block.rows.map((r) => (
                    <li key={r.label} className="flex justify-between p-4 text-sm">
                      <span className="text-foreground">{r.label}</span>
                      <span className="text-muted-foreground">{r.count}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Stats;

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let bodyDays: number | undefined;
    let bodyPasscode: string | undefined;
    if (req.method === "POST") {
      try {
        const parsed = await req.json();
        bodyDays = Number(parsed?.days);
        bodyPasscode = typeof parsed?.passcode === "string" ? parsed.passcode : undefined;
      } catch {
        // ignore empty body
      }
    }
    const passcode =
      req.headers.get("x-analytics-passcode") ??
      bodyPasscode ??
      url.searchParams.get("passcode");

    if (!passcode || passcode !== Deno.env.get("ANALYTICS_PASSCODE")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const days = Math.min(Math.max(Number(url.searchParams.get("days") ?? 30), 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("site_events")
      .select("event_name, path, referrer, session_id, device, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20000);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = data ?? [];
    const pageviews = rows.filter((r) => r.event_name === "pageview");
    const visitors = new Set(pageviews.map((r) => r.session_id ?? r.created_at)).size;

    const tally = (items: (string | null)[]) => {
      const map = new Map<string, number>();
      for (const item of items) {
        const key = item && item.length > 0 ? item : "direct";
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      return [...map.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, count]) => ({ label, count }));
    };

    const daily = new Map<string, number>();
    for (const r of pageviews) {
      const day = r.created_at.slice(0, 10);
      daily.set(day, (daily.get(day) ?? 0) + 1);
    }

    return new Response(
      JSON.stringify({
        days,
        pageviews: pageviews.length,
        visitors,
        clicks: rows.length - pageviews.length,
        topReferrers: tally(pageviews.map((r) => {
          if (!r.referrer) return "direct";
          try {
            return new URL(r.referrer).hostname;
          } catch {
            return r.referrer;
          }
        })),
        devices: tally(pageviews.map((r) => r.device)),
        topEvents: tally(rows.filter((r) => r.event_name !== "pageview").map((r) => r.event_name)),
        daily: [...daily.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

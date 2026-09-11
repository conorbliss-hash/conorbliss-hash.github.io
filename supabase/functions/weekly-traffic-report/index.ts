import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { sendLovableEmail } from 'npm:@lovable.dev/email-js'
import { WeeklyTraffic } from '../_shared/email-templates/weekly-traffic.tsx'


const RECIPIENT = 'conor.bliss.henaghan@gmail.com'

interface EventRow {
  event_name: string
  path: string | null
  referrer: string | null
  session_id: string | null
  created_at: string
}

function topN(map: Map<string, number>, n: number) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }))
}

function hostOf(ref: string | null) {
  if (!ref) return 'Direct'
  try {
    const h = new URL(ref).hostname.replace(/^www\./, '')
    return h || 'Direct'
  } catch {
    return 'Direct'
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const expected = Deno.env.get('WEEKLY_REPORT_SECRET')
  const provided = req.headers.get('x-report-secret')
  if (!expected || provided !== expected) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 864e5)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 864e5)

  const { data, error } = await supabase
    .from('site_events')
    .select('event_name, path, referrer, session_id, created_at')
    .gte('created_at', twoWeeksAgo.toISOString())
    .limit(50000)

  if (error) {
    console.error('Failed to read site_events', error.message)
    return new Response(JSON.stringify({ error: 'Query failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const rows = (data ?? []) as EventRow[]
  const current = rows.filter((r) => new Date(r.created_at) >= weekAgo)
  const previous = rows.filter((r) => new Date(r.created_at) < weekAgo)

  const summarize = (set: EventRow[]) => {
    const views = set.filter((r) => r.event_name === 'pageview')
    return {
      visitors: new Set(views.map((r) => r.session_id ?? '')).size,
      pageviews: views.length,
    }
  }

  const cur = summarize(current)
  const prev = summarize(previous)

  const pages = new Map<string, number>()
  const sources = new Map<string, number>()
  const clickEvents = new Map<string, number>()
  let clicks = 0

  for (const r of current) {
    if (r.event_name === 'pageview') {
      const p = r.path || '/'
      pages.set(p, (pages.get(p) ?? 0) + 1)
      const s = hostOf(r.referrer)
      sources.set(s, (sources.get(s) ?? 0) + 1)
    } else {
      clicks++
      clickEvents.set(r.event_name, (clickEvents.get(r.event_name) ?? 0) + 1)
    }
  }

  const templateData = {
    periodLabel: 'last 7 days',
    visitors: cur.visitors,
    pageviews: cur.pageviews,
    clicks,
    visitorsPrev: prev.visitors,
    pageviewsPrev: prev.pageviews,
    topPages: topN(pages, 5),
    topSources: topN(sources, 5),
    topClicks: topN(clickEvents, 5),
    statsUrl: 'https://conorbliss.com/stats',
  }

  const html = await renderAsync(React.createElement(WeeklyTraffic, templateData))
  const text = await renderAsync(React.createElement(WeeklyTraffic, templateData), {
    plainText: true,
  })

  try {
    await sendLovableEmail(
      {
        to: RECIPIENT,
        from: { name: 'conorbliss.com', address: 'noreply@conorbliss.com' },
        sender_domain: 'notify.conorbliss.com',
        subject: `conorbliss.com weekly traffic: ${cur.visitors} visitors`,
        html,
        text,
        purpose: 'transactional',
        label: 'weekly-traffic',
        idempotency_key: `weekly-traffic-${weekAgo.toISOString().slice(0, 10)}`,
      },
      { apiKey: Deno.env.get('LOVABLE_API_KEY')! },
    )
  } catch (e) {
    console.error('Send failed', e instanceof Error ? e.message : e)
    return new Response(JSON.stringify({ error: 'Send failed' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true, ...templateData }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

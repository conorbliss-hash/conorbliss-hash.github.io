CREATE TABLE public.site_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL DEFAULT 'pageview',
  path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  session_id TEXT,
  device TEXT,
  screen_width INTEGER,
  props JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.site_events TO anon, authenticated;
GRANT ALL ON public.site_events TO service_role;

ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record an event"
ON public.site_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE INDEX site_events_created_at_idx ON public.site_events (created_at DESC);
CREATE INDEX site_events_event_name_idx ON public.site_events (event_name);
DROP POLICY IF EXISTS "Anyone can record an event" ON public.site_events;
CREATE POLICY "Anyone can record a valid event" ON public.site_events
FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(event_name) BETWEEN 1 AND 64
  AND event_name ~ '^[a-zA-Z0-9_:.-]+$'
  AND char_length(path) BETWEEN 1 AND 512
  AND (referrer IS NULL OR char_length(referrer) <= 1024)
  AND (session_id IS NULL OR char_length(session_id) <= 64)
  AND (device IS NULL OR device IN ('mobile','tablet','desktop'))
  AND (screen_width IS NULL OR screen_width BETWEEN 0 AND 10000)
  AND (props IS NULL OR pg_column_size(props) <= 2048)
  AND created_at >= now() - interval '5 minutes'
  AND created_at <= now() + interval '5 minutes'
);
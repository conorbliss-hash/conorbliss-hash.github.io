import { supabase } from "@/integrations/supabase/client";

type PlausibleEventOptions = {
  props?: Record<string, string | number | boolean | undefined>;
};

declare global {
  interface Window {
    plausible?: (eventName: string, options?: PlausibleEventOptions) => void;
  }
}

const SESSION_KEY = "cb_session_id";

const getSessionId = () => {
  if (typeof window === "undefined") return null;
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
};

const getDevice = () => {
  if (typeof window === "undefined") return null;
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};

const record = async (
  eventName: string,
  props?: PlausibleEventOptions["props"],
) => {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("site_events").insert({
      event_name: eventName,
      path: window.location.pathname,
      referrer: document.referrer || null,
      session_id: getSessionId(),
      device: getDevice(),
      screen_width: window.innerWidth,
      props: props ? JSON.parse(JSON.stringify(props)) : null,
    });
  } catch {
    // analytics must never break the page
  }
};

export const trackEvent = (
  eventName: string,
  props?: PlausibleEventOptions["props"],
) => {
  window.plausible?.(eventName, props ? { props } : undefined);
  void record(eventName, props);
};

export const trackPageview = () => {
  void record("pageview");
};

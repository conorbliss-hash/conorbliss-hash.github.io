type PlausibleEventOptions = {
  props?: Record<string, string | number | boolean | undefined>;
};

declare global {
  interface Window {
    plausible?: (eventName: string, options?: PlausibleEventOptions) => void;
  }
}

export const trackEvent = (eventName: string, props?: PlausibleEventOptions["props"]) => {
  window.plausible?.(eventName, props ? { props } : undefined);
};

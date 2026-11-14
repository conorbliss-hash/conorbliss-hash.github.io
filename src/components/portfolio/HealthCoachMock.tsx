import { useEffect, useRef } from "react";
import mockSvg from "@/assets/health-coach-mock.svg?raw";

/**
 * Health Coach dashboard mock that comes alive when scrolled into view:
 * the chart line draws in, bars fill, numbers count up, run rows appear in order.
 * With a mouse, the panel tilts slightly toward the cursor.
 * Server-rendered markup is the finished, static dashboard.
 */
const HealthCoachMock = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    el.dataset.armed = "true"; // hides the to-be-animated parts until in view

    const counters = Array.from(el.querySelectorAll<SVGTextElement>("[data-count]"));
    const countUp = () => {
      const start = performance.now();
      const duration = 1100;
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        for (const c of counters) {
          const target = Number(c.dataset.count);
          c.textContent = Math.round(target * eased).toLocaleString("en-GB") + (c.dataset.suffix ?? "");
        }
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.inView = "true";
        countUp();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    // Cursor tilt, mouse/trackpad only
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
        el.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="hc-mock" role="img" aria-label="Health Coach interface mock showing a dashboard, metrics, and reporting flow">
      <div className="hc-mock-inner" aria-hidden="true" dangerouslySetInnerHTML={{ __html: mockSvg }} />
    </div>
  );
};

export default HealthCoachMock;

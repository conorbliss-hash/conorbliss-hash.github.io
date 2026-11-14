import { useEffect, useRef } from "react";

/**
 * Soft, slow-moving colour field behind the page that leans toward the cursor.
 *
 * - Three large blobs drift on their own (CSS keyframes) and shift with the pointer
 *   at different strengths, which reads as depth.
 * - A fainter glow trails the cursor itself.
 * - No `filter: blur()` - the softness comes from radial gradients, which is far cheaper
 *   to paint on large layers.
 * - Pointer tracking only runs for a fine pointer (mouse/trackpad) and when the visitor
 *   has not asked for reduced motion. The rAF loop stops once everything has settled.
 */
const BLOBS = [
  { className: "aurora-blob aurora-b1", depth: 0.16 },
  { className: "aurora-blob aurora-b2", depth: -0.12 },
  { className: "aurora-blob aurora-b3", depth: 0.08 },
];

const Aurora = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    root.dataset.interactive = "true";

    // target = where the pointer is, current = eased position actually drawn
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let frame = 0;

    const draw = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      const dx = current.x - window.innerWidth / 2;
      const dy = current.y - window.innerHeight / 2;
      root.style.setProperty("--aurora-dx", `${dx.toFixed(1)}px`);
      root.style.setProperty("--aurora-dy", `${dy.toFixed(1)}px`);
      root.style.setProperty("--aurora-x", `${current.x.toFixed(1)}px`);
      root.style.setProperty("--aurora-y", `${current.y.toFixed(1)}px`);

      const settled = Math.abs(target.x - current.x) < 0.3 && Math.abs(target.y - current.y) < 0.3;
      frame = settled ? 0 : requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      root.dataset.active = "true";
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      delete root.dataset.active;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="aurora" aria-hidden="true">
      {BLOBS.map(({ className, depth }) => (
        <span
          key={className}
          className="aurora-lean"
          style={{ "--aurora-depth": depth } as React.CSSProperties}
        >
          <span className={className} />
        </span>
      ))}
      <span className="aurora-cursor" />
    </div>
  );
};

export default Aurora;

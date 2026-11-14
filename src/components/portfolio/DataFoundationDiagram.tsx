import { useEffect, useRef, useState } from "react";

/**
 * Interactive version of data-foundation-diagram.svg (desktop / wide layout).
 *
 * - A data packet travels the real path: in from outside, through de-identify and
 *   tokenise, into the protected core, then back out through the tiers and re-scope.
 *   It changes form at each control (raw -> de-identified -> tokenised) and the
 *   control it is passing lights up.
 * - Hovering (or focusing) a tier or control dims the rest and shows the design
 *   decision behind it, taken from the case study copy.
 * - The packet only runs while the diagram is on screen, and not at all when the
 *   visitor prefers reduced motion. Server-rendered markup is the static diagram.
 */

type Part = "external" | "deidentify" | "tokenise" | "core" | "shared" | "restricted" | "rescope";

const CAPTIONS: Record<Part, { label: string; text: string }> = {
  external: {
    label: "Outside",
    text: "Nothing reaches the outside without passing a control. Every crossing has one, sized to who can read the data next.",
  },
  deidentify: {
    label: "De-identify",
    text: "Minimise at intake, not later: a field never collected cannot leak or be subject-accessed, and every downstream control is cheaper for it.",
  },
  tokenise: {
    label: "Tokenise",
    text: "Separate the keys from the data: tokenisation only helps if the lookup lives elsewhere under different access.",
  },
  core: {
    label: "Protected core",
    text: "The system of record and the key store sit here under separate custody. Denser fill means tighter access.",
  },
  shared: {
    label: "Shared tier",
    text: "Set the boundary by audience, not by role: start from the smallest group that can still do the work. Roles drift; this boundary survives audit.",
  },
  restricted: {
    label: "Restricted tier",
    text: "Scoped working copies only. Each tier is sized to who can read the data next.",
  },
  rescope: {
    label: "Re-scope",
    text: "Review what leaves: egress is where re-identification actually happens, and the stage auditors ask about after everything else has passed.",
  },
};

const DEFAULT_CAPTION = "Hover a tier or control to see why it is there.";

// Packet route in diagram coordinates: down out of External, right along the intake
// line, up into the core, then left along the results line and back to External.
const ROUTE = "M46 220 V300 H730 V150 H86";

// Which part the packet is in, given its position on the route.
const partAt = (x: number, y: number): Part | null => {
  if (y >= 290) {
    if (x >= 200 && x <= 350) return "deidentify";
    if (x >= 520 && x <= 650) return "tokenise";
    return null;
  }
  if (x >= 585 && y <= 240) return "core";
  if (x >= 385 && x <= 555) return "shared";
  if (x >= 230 && x <= 355) return "restricted";
  if (x >= 112 && x <= 230) return "rescope";
  if (x <= 86) return "external";
  return null;
};

const SPEED = 190; // px per second along the route
const SLOW_IN_CONTROL = 0.35; // packet slows inside amber controls so the change is visible

const DataFoundationDiagram = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGGElement>(null);
  const [hovered, setHovered] = useState<Part | null>(null);
  const [passing, setPassing] = useState<Part | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const route = routeRef.current;
    const packet = packetRef.current;
    if (!svg || !route || !packet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const total = route.getTotalLength();
    let distance = 0;
    let frame = 0;
    let last = 0;
    let lastPart: Part | null = null;
    let stage = 0; // 0 raw, 1 de-identified, 2 tokenised

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      const here = route.getPointAtLength(distance);
      const part = partAt(here.x, here.y);
      const inControl = part === "deidentify" || part === "tokenise" || part === "rescope";
      distance += dt * SPEED * (inControl ? SLOW_IN_CONTROL : 1);

      if (distance >= total) {
        distance = 0;
        stage = 0;
      }
      if (part === "deidentify" && here.x > 275) stage = Math.max(stage, 1);
      if (part === "tokenise" && here.x > 585) stage = Math.max(stage, 2);

      const p = route.getPointAtLength(distance);
      packet.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      packet.dataset.stage = String(stage);
      // Inside a control or the core the packet is "being processed": it goes out of
      // sight (and off the labels) and re-emerges in its new form.
      const hidden = inControl || part === "core";
      if (hidden) packet.dataset.hidden = "true";
      else delete packet.dataset.hidden;

      if (part !== lastPart) {
        lastPart = part;
        setPassing(part);
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      last = 0;
      svg.dataset.running = "true";
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0.25,
    });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  // Props for each hoverable part: dims the rest of the diagram and sets the caption.
  const part = (name: Part) => ({
    "data-part": name,
    "data-hovered": hovered === name ? "true" : undefined,
    "data-passing": passing === name ? "true" : undefined,
    tabIndex: 0,
    role: "button",
    "aria-label": `${CAPTIONS[name].label}: ${CAPTIONS[name].text}`,
    onMouseEnter: () => setHovered(name),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(name),
    onBlur: () => setHovered(null),
    onClick: () => setHovered(name),
  });

  const caption = hovered ? CAPTIONS[hovered] : null;

  return (
    <figure className="dfd" data-dim={hovered ? "true" : undefined}>
      <svg
        ref={svgRef}
        viewBox="0 0 800 390"
        className="h-auto w-full"
        role="img"
        aria-label="Three access tiers - restricted, shared and a protected core. Data comes in from outside along the bottom, passing de-identification and then tokenisation before reaching the core. Results travel back out through the tiers and through a re-scoping control before leaving. Amber marks every point where data is transformed; denser fill means tighter access."
      >
        <path ref={routeRef} d={ROUTE} fill="none" stroke="none" />

        <g {...part("external")}>
          <rect x="6" y="120" width="80" height="100" rx="3" fill="var(--surface)" stroke="var(--dg-line)" strokeWidth="2.5" />
          <text x="46" y="176" fontSize="17" textAnchor="middle" fill="var(--ink)">External</text>
        </g>

        <g {...part("restricted")}>
          <rect className="dfd-zone" x="165" y="60" width="190" height="180" rx="4" fill="var(--dg-z1)" stroke="var(--dg-line)" strokeWidth="2" />
          <text x="165" y="46" fontSize="15" letterSpacing="1.6" fill="var(--ink-3)">RESTRICTED</text>
          <text x="260" y="212" fontSize="16" fill="var(--ink-2)" textAnchor="middle">Scoped working copies</text>
        </g>

        <g {...part("shared")}>
          <rect className="dfd-zone" x="385" y="60" width="170" height="180" rx="4" fill="var(--dg-z2)" stroke="var(--dg-sq)" strokeWidth="2" />
          <text x="385" y="46" fontSize="15" letterSpacing="1.6" fill="var(--ink-3)">SHARED</text>
          <text x="470" y="212" fontSize="16" fill="var(--ink-2)" textAnchor="middle">Team-level analysis</text>
        </g>

        <g {...part("core")}>
          <rect className="dfd-zone" x="585" y="60" width="205" height="180" rx="4" fill="var(--dg-z3)" stroke="var(--dg-line)" strokeWidth="3" />
          <text x="585" y="46" fontSize="15" letterSpacing="1.6" fill="var(--ink-3)">PROTECTED CORE</text>
          <rect x="598" y="96" width="179" height="54" rx="3" fill="var(--surface)" stroke="var(--dg-line)" strokeWidth="2" />
          <rect x="598" y="160" width="179" height="62" rx="3" fill="var(--surface)" stroke="var(--dg-line)" strokeWidth="2" />
          <g fontSize="16" fill="var(--ink)" textAnchor="middle">
            <text x="687" y="129">System of record</text>
            <text x="687" y="185">Key store,</text>
            <text x="687" y="206">separate custody</text>
          </g>
        </g>

        <g className="dfd-static" fontSize="14" letterSpacing="1.4" fill="var(--ink-3)">
          <text x="6" y="106">RESULTS OUT</text>
          <text x="100" y="289">DATA IN</text>
        </g>

        <g className="dfd-static" fill="none" stroke="var(--dg-line)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M581 150 H561" /><path d="M566 145 l-5 5 l5 5" />
          <path d="M381 150 H361" /><path d="M366 145 l-5 5 l5 5" />
          <path d="M108 150 H90" /><path d="M95 145 l-5 5 l5 5" />
          <path d="M46 220 V300 H196" /><path d="M191 295 l5 5 l-5 5" />
          <path d="M350 300 H516" /><path d="M511 295 l5 5 l-5 5" />
          <path d="M650 300 H730 V248" /><path d="M725 253 l5 -5 l5 5" />
        </g>

        <g {...part("rescope")} className="dfd-control">
          <rect x="112" y="131" width="118" height="38" rx="3" />
          <text x="171" y="156">Re-scope</text>
        </g>
        <g {...part("deidentify")} className="dfd-control">
          <rect x="200" y="281" width="150" height="40" rx="3" />
          <text x="275" y="307">De-identify</text>
        </g>
        <g {...part("tokenise")} className="dfd-control">
          <rect x="520" y="281" width="130" height="40" rx="3" />
          <text x="585" y="307">Tokenise</text>
        </g>

        {/* The packet: hidden until the animation starts, so the static render matches the original. */}
        <g ref={packetRef} className="dfd-packet" transform="translate(46 220)" aria-hidden="true">
          <circle className="dfd-packet-halo" r="13" />
          <circle className="dfd-packet-raw" r="6.5" />
          <circle className="dfd-packet-clean" r="6.5" />
          <rect className="dfd-packet-token" x="-6" y="-6" width="12" height="12" rx="2" />
        </g>

        <g className="dfd-static" fontSize="14" fill="var(--ink-2)">
          <rect x="165" y="352" width="15" height="15" rx="2" fill="var(--dg-amber-fill)" stroke="var(--dg-amber)" strokeWidth="2" />
          <text x="191" y="365">Data is transformed here</text>
          <rect x="400" y="352" width="15" height="15" rx="2" fill="var(--dg-z3)" stroke="var(--dg-line)" strokeWidth="2" />
          <text x="426" y="365">Denser fill = tighter access</text>
        </g>
      </svg>

      <figcaption className="dfd-caption" aria-live="polite">
        {caption ? (
          <>
            <span className="dfd-caption-label">{caption.label}</span>
            <span>{caption.text}</span>
          </>
        ) : (
          <span className="dfd-caption-hint">{DEFAULT_CAPTION}</span>
        )}
      </figcaption>
    </figure>
  );
};

export default DataFoundationDiagram;

"use client";

import { useEffect, useRef } from "react";

/** Line drawing of a flanged gate valve. The handwheel detail turns as the page scrolls. */
export default function ValveDrawing() {
  const wheel = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      wheel.current?.setAttribute("transform", `rotate(${(window.scrollY * 0.3) % 360})`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const balloon = (n: number, x: number, y: number, tx: number, ty: number) => (
    <g key={n}>
      <line x1={x + 9} y1={y} x2={tx} y2={ty} className="stroke-brass-deep" strokeWidth="0.75" />
      <circle cx={tx} cy={ty} r="1.8" className="fill-brass-deep" />
      <circle cx={x} cy={y} r="9" className="fill-paper stroke-brass-deep" strokeWidth="0.9" />
      <text x={x} y={y + 3.5} textAnchor="middle" className="fill-brass-deep font-mono text-[10px]">
        {n}
      </text>
    </g>
  );

  return (
    <svg viewBox="0 0 440 400" className="h-auto w-full text-navy" fill="none" role="img" aria-labelledby="valve-title">
      <title id="valve-title">Technical drawing of a flanged gate valve</title>

      {/* Centre lines */}
      <g className="stroke-navy/35" strokeWidth="0.75" strokeDasharray="14 3 2 3">
        <line x1="8" y1="290" x2="308" y2="290" />
        <line x1="150" y1="52" x2="150" y2="372" />
        <line x1="296" y1="110" x2="424" y2="110" />
        <line x1="360" y1="46" x2="360" y2="174" />
      </g>

      {/* Elevation */}
      <g className="trace" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <rect x="24" y="236" width="14" height="108" rx="1" />
        <rect x="262" y="236" width="14" height="108" rx="1" />
        <path d="M38 258H78C84 232 110 222 150 222C190 222 216 232 222 258H262V322H222C216 348 190 358 150 358C110 358 84 348 78 322H38Z" />
        <path d="M122 222L128 176H172L178 222" style={{ ["--d" as string]: "300ms" }} />
        <rect x="116" y="168" width="68" height="8" rx="1" style={{ ["--d" as string]: "450ms" }} />
        <rect x="136" y="140" width="28" height="28" style={{ ["--d" as string]: "600ms" }} />
        <line x1="150" y1="140" x2="150" y2="88" style={{ ["--d" as string]: "750ms" }} />
        <rect x="104" y="78" width="92" height="10" rx="5" style={{ ["--d" as string]: "900ms" }} />
        <rect x="143" y="70" width="14" height="8" rx="1" style={{ ["--d" as string]: "1000ms" }} />
      </g>

      {/* Hidden bore */}
      <g className="stroke-navy/40" strokeWidth="0.8" strokeDasharray="4 3">
        <line x1="24" y1="270" x2="276" y2="270" />
        <line x1="24" y1="310" x2="276" y2="310" />
        <rect x="140" y="232" width="20" height="58" />
      </g>

      {/* Dimensions */}
      <g className="stroke-brass-deep" strokeWidth="0.75">
        <line x1="24" y1="352" x2="24" y2="388" />
        <line x1="276" y1="352" x2="276" y2="388" />
        <line x1="24" y1="380" x2="276" y2="380" />
        <path d="M24 380l7-3v6zM276 380l-7-3v6z" className="fill-brass-deep" />
        <line x1="200" y1="83" x2="300" y2="83" />
        <line x1="280" y1="290" x2="300" y2="290" />
        <line x1="292" y1="83" x2="292" y2="290" />
        <path d="M292 83l-3 7h6zM292 290l-3-7h6z" className="fill-brass-deep" />
      </g>
      <g className="fill-brass-deep font-mono text-[10px] tracking-[0.12em]">
        <text x="150" y="375" textAnchor="middle">L · FACE TO FACE</text>
        <text x="299" y="250" transform="rotate(90 299 250)" textAnchor="middle">
          H · OPEN
        </text>
      </g>

      {balloon(1, 30, 58, 106, 82)}
      {balloon(2, 30, 150, 126, 196)}
      {balloon(3, 30, 206, 86, 244)}

      {/* Detail A: handwheel, plan view */}
      <line x1="196" y1="80" x2="306" y2="104" className="stroke-navy/40" strokeWidth="0.75" />
      <g transform="translate(360 110)">
        <g ref={wheel}>
          <g className="trace" stroke="currentColor" strokeWidth="1.4" style={{ ["--d" as string]: "700ms" }}>
            <circle r="56" />
            <circle r="47" />
            <circle r="11" />
            <circle r="4.5" />
            {[0, 120, 240].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M-3 -10.5L-2.5 -47M3 -10.5L2.5 -47" />
              </g>
            ))}
          </g>
          <circle cx="0" cy="-51.5" r="1.6" className="fill-brass-deep" />
        </g>
      </g>
      <g className="font-mono text-[10px] tracking-[0.12em]">
        <text x="366" y="192" textAnchor="middle" className="fill-navy">
          DETAIL A
        </text>
        <text x="366" y="206" textAnchor="middle" className="fill-mute">
          HANDWHEEL · PLAN
        </text>
      </g>
      <g className="fill-mute font-mono text-[9px] tracking-[0.1em]">
        <text x="48" y="54">HANDWHEEL</text>
        <text x="48" y="146">BONNET</text>
        <text x="48" y="202">BODY</text>
      </g>
    </svg>
  );
}

import { site } from "@/lib/site";
import ValveDrawing from "./ValveDrawing";

const titleBlock = [
  ["Art. No.", "1036"],
  ["Make", "Zoloto"],
  ["Ends", "Flanged"],
  ["HSN", "84818030"],
];

export default function Hero({ count, families }: { count: number; families: number }) {
  const stats = [
    [count ? String(count) : "100+", "catalogue items"],
    [families ? String(families) : "10+", "valve families"],
    ["6", "days a week"],
  ];

  return (
    <section id="top" className="drafting relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-40 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
        <div>
          <p data-reveal className="mb-6 font-mono text-xs tracking-[0.2em] text-brass-deep uppercase">
            Valves · Pipes &amp; Fittings · Hardware
          </p>
          <h1
            data-reveal
            style={{ ["--d" as string]: "80ms" }}
            className="text-[clamp(2.5rem,6.2vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.03em] [font-stretch:108%]"
          >
            Every line needs
            <br />
            the <span className="text-green">right valve.</span>
          </h1>
          <p
            data-reveal
            style={{ ["--d" as string]: "160ms" }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-mute"
          >
            {site.name} supplies Zoloto and Leader valves, pipes and fittings, and everyday industrial hardware to
            plants, contractors and maintenance teams across Jamshedpur. Look up an Art. No., pull its data sheet, and
            send us your list.
          </p>
          <div data-reveal style={{ ["--d" as string]: "240ms" }} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#catalogue"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-navy px-7 py-4 font-medium text-white transition-colors hover:bg-navy-2"
            >
              Browse the catalogue
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-navy/20 px-7 py-4 font-medium transition-colors hover:border-navy/50 hover:bg-white/60"
            >
              Send an enquiry
            </a>
          </div>

          <dl
            data-reveal
            style={{ ["--d" as string]: "320ms" }}
            className="mt-14 grid max-w-lg grid-cols-3 border-t border-rule pt-6"
          >
            {stats.map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-3xl font-semibold tracking-tight [font-stretch:108%]">{n}</dd>
                <dd className="mt-1 text-sm text-mute">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Drawing sheet */}
        <figure
          data-reveal
          style={{ ["--d" as string]: "200ms" }}
          className="relative rounded-xl border border-rule bg-white/70 shadow-[0_1px_0_rgb(22_28_60/0.04),0_30px_60px_-30px_rgb(22_28_60/0.25)] backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-rule px-5 py-3 font-mono text-[11px] tracking-[0.14em] text-mute uppercase">
            <span>Gate valve · Bronze</span>
            <span>Sheet 01</span>
          </div>
          <div className="px-4 pt-5 pb-2 sm:px-8">
            <ValveDrawing />
          </div>
          <figcaption className="grid grid-cols-2 border-t border-rule sm:grid-cols-4">
            {titleBlock.map(([k, v], i) => (
              <div
                key={k}
                className={`px-5 py-3 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t sm:border-t-0" : ""} ${
                  i === 2 ? "sm:border-l" : ""
                } border-rule`}
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-mute uppercase">{k}</p>
                <p className="mt-1 font-mono text-sm text-navy">{v}</p>
              </div>
            ))}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

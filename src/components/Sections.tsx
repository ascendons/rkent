import { brands, mailto, range, site, tel } from "@/lib/site";
import { Logo } from "./Header";

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-5 font-mono text-xs tracking-[0.2em] uppercase ${dark ? "text-brass" : "text-brass-deep"}`}>
      {children}
    </p>
  );
}

const tickerItems = [
  "Globe valves",
  "Gate & sluice valves",
  "Ball valves",
  "Butterfly valves",
  "Non-return valves",
  "Y-strainers",
  "Steam traps",
  "Level gauges",
  "Pipes",
  "Fittings",
  "Fasteners",
  "Hand tools",
];

export function Strip() {
  const row = [...tickerItems, ...tickerItems];
  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row md:items-stretch">
        <div className="flex shrink-0 items-center gap-6 border-b border-navy-line px-4 py-5 sm:px-6 md:border-r md:border-b-0 md:pr-10">
          <span className="font-mono text-[11px] tracking-[0.18em] text-white/50 uppercase">Brands we carry</span>
          {brands.map((b) => (
            <span key={b} className="text-lg font-semibold tracking-tight text-brass [font-stretch:115%]">
              {b}
            </span>
          ))}
        </div>
        <div
          className="relative flex-1 overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
          aria-label="Product types"
        >
          <div className="flex w-max animate-ticker items-center">
            {row.map((name, i) => (
              <span
                key={i}
                aria-hidden={i >= tickerItems.length}
                className="flex items-center text-[15px] whitespace-nowrap text-white/75"
              >
                {name}
                <span className="mx-7 h-1 w-1 rounded-full bg-brass/70" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Range() {
  return (
    <section id="range" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div data-reveal>
            <Eyebrow>What we stock</Eyebrow>
            <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.025em] [font-stretch:108%] sm:text-5xl lg:text-6xl">
              From the main line
              <br />
              to the last washer.
            </h2>
          </div>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-mute lg:justify-self-end">
            One counter for the valves, the pipe they sit on, and the hardware that holds it together, for plant
            maintenance, contractors and new projects.
          </p>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {range.map((r, i) => (
            <li
              key={r.code}
              data-reveal
              style={{ ["--d" as string]: `${i * 90}ms` }}
              className="group relative flex flex-col bg-paper p-7 transition-colors duration-300 hover:bg-white sm:p-8"
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brass transition-transform duration-500 group-hover:scale-x-100" />
              <span className="font-mono text-sm text-brass-deep">{r.code}</span>
              <h3 className="mt-10 text-2xl leading-tight font-semibold tracking-tight [font-stretch:108%]">{r.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-mute">{r.body}</p>
              <ul className="mt-8 flex flex-wrap gap-1.5">
                {r.items.map((c) => (
                  <li key={c} className="rounded-full border border-rule px-2.5 py-1 text-xs text-navy/70">
                    {c}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const reasons = [
  {
    title: "Branded stock",
    body: "Valves and fittings from manufacturers you already specify, billed with HSN codes so your GST paperwork is straightforward.",
  },
  {
    title: "Checked before it leaves",
    body: "Every order is counted and checked against the list before dispatch, so what arrives on site is what you asked for.",
  },
  {
    title: "Help choosing",
    body: "Globe or gate? Screwed or flanged? Tell us the line, the medium and the pressure, and we'll help you pick the right part.",
  },
  {
    title: "On time, and reachable",
    body: "Orders go out when promised, and there's a person on the phone before and after the sale.",
  },
];

export function Why() {
  return (
    <section id="why" className="drafting-dark bg-navy py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow dark>Why RK</Eyebrow>
          <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.025em] [font-stretch:108%] sm:text-5xl lg:text-6xl">
            Over 15 years
            <br />
            behind the
            <br />
            <span className="text-brass">counter.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
            Plants and workshops across Jamshedpur come back to us because the part is right and the answer is quick.
          </p>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-2xl bg-navy-line sm:grid-cols-2">
          {reasons.map((r, i) => (
            <li key={r.title} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }} className="bg-navy p-7 sm:p-9">
              <span className="font-mono text-xs tracking-[0.18em] text-brass">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight [font-stretch:108%]">{r.title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{r.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy pt-14 pb-28 text-white md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 border-b border-navy-line pb-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{site.tagline}.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:gap-16">
            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-white/40 uppercase">Visit</p>
              <address className="leading-relaxed text-white/75 not-italic">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.region}
              </address>
            </div>
            <div>
              <p className="mb-4 font-mono text-[11px] tracking-[0.16em] text-white/40 uppercase">Talk</p>
              <ul className="space-y-2 text-white/75">
                <li>
                  <a href={tel} className="draw-line hover:text-white">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={mailto} className="draw-line break-all hover:text-white">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} {site.name}. Product names and data sheets belong to their manufacturers.
        </p>
      </div>
    </footer>
  );
}

export function MobileDock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-rule bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <a href={tel} className="flex h-[60px] items-center justify-center gap-2 text-[15px] font-medium text-navy">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-brass-deep">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
        </svg>
        Call
      </a>
      <a href="#contact" className="flex h-[60px] items-center justify-center bg-navy text-[15px] font-medium text-white">
        Send enquiry
      </a>
    </div>
  );
}

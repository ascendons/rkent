"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { enquiry, useEnquiry } from "@/lib/enquiry";
import { fetchProducts, site, tel, type Product } from "@/lib/site";

const PAGE = 20;
const select =
  "h-11 w-full appearance-none rounded-lg border border-rule bg-white bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' stroke='%235d6275' stroke-width='1.5'%3E%3Cpath d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")] bg-[position:right_14px_center] bg-no-repeat pr-9 pl-3.5 text-sm text-navy focus:border-navy focus:outline-none";

function Mark({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-brass/40 px-0.5 text-navy">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function AddButton({ p, picked }: { p: Product; picked: boolean }) {
  return (
    <button
      type="button"
      onClick={() => enquiry.toggle(p)}
      aria-pressed={picked}
      aria-label={picked ? `Remove ${p.artNo} from enquiry` : `Add ${p.artNo} to enquiry`}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors ${
        picked ? "border-green bg-green text-white" : "border-rule bg-white text-navy hover:border-navy/40"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        {picked ? <path d="M2 6.5l2.5 2.5L10 3.5" /> : <path d="M6 1.5v9M1.5 6h9" />}
      </svg>
      {picked ? "Added" : "Enquire"}
    </button>
  );
}

function Tdr({ href }: { href: string }) {
  if (!href) return <span className="text-mute/60">—</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-xs tracking-wider text-brass-deep uppercase hover:text-navy"
    >
      TDR
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
        <path d="M3 1h6v6M9 1L1 9" />
      </svg>
    </a>
  );
}

export default function Catalogue({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(initial.length ? "idle" : "loading");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [ends, setEnds] = useState("All");
  const [material, setMaterial] = useState("All");
  const [page, setPage] = useState({ key: "", n: PAGE });
  const picked = useEnquiry();
  const q = useDeferredValue(query.trim());

  // The build ships a snapshot; refresh from the sheet so edits show up without a redeploy.
  useEffect(() => {
    let live = true;
    fetchProducts({ cache: "no-store" })
      .then((p) => {
        if (live && p.length) {
          setProducts(p);
          setStatus("idle");
        }
      })
      .catch(() => live && setStatus((s) => (s === "loading" ? "error" : s)));
    return () => {
      live = false;
    };
  }, []);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => counts.set(p.type, (counts.get(p.type) ?? 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [products]);
  const endsList = useMemo(() => [...new Set(products.map((p) => p.connection).filter(Boolean))].sort(), [products]);
  const materials = useMemo(() => [...new Set(products.map((p) => p.material).filter(Boolean))].sort(), [products]);

  const results = useMemo(() => {
    const s = q.toLowerCase();
    return products.filter(
      (p) =>
        (type === "All" || p.type === type) &&
        (ends === "All" || p.connection === ends) &&
        (material === "All" || p.material === material) &&
        (!s || p.name.toLowerCase().includes(s) || p.artNo.toLowerCase().includes(s) || p.hsn.includes(s)),
    );
  }, [products, q, type, ends, material]);

  // Back to the first page whenever the filters change.
  const filterKey = [q, type, ends, material].join("|");
  const shown = page.key === filterKey ? page.n : PAGE;

  const filtered = q || type !== "All" || ends !== "All" || material !== "All";
  const reset = () => {
    setQuery("");
    setType("All");
    setEnds("All");
    setMaterial("All");
  };
  const isPicked = (p: Product) => picked.some((i) => i.artNo === p.artNo);

  return (
    <section id="catalogue" className="border-t border-rule bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div data-reveal>
            <p className="mb-5 font-mono text-xs tracking-[0.2em] text-brass-deep uppercase">Catalogue</p>
            <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.025em] [font-stretch:108%] sm:text-5xl lg:text-6xl">
              Find it by name,
              <br />
              or by Art. No.
            </h2>
          </div>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-mute lg:justify-self-end">
            The full Zoloto list we work from, with HSN codes and manufacturer data sheets. Tap{" "}
            <span className="text-navy">Enquire</span> on anything you need and we&apos;ll quote the lot together.
          </p>
        </div>

        {/* Controls */}
        <div data-reveal className="mt-12 space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_12rem_12rem]">
            <label className="relative block">
              <span className="sr-only">Search the catalogue</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “globe”, “1036” or “butterfly”"
                className="h-11 w-full rounded-lg border border-rule bg-paper/60 pr-4 pl-11 text-base text-navy placeholder:text-mute/70 focus:border-navy focus:bg-white focus:outline-none"
              />
            </label>
            <label>
              <span className="sr-only">Material</span>
              <select className={select} value={material} onChange={(e) => setMaterial(e.target.value)}>
                <option value="All">All materials</option>
                {materials.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">End connection</span>
              <select className={select} value={ends} onChange={(e) => setEnds(e.target.value)}>
                <option value="All">All end types</option>
                {endsList.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Valve type">
            <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
              {[["All", products.length] as [string, number], ...types].map(([t, n]) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={`h-9 rounded-full border px-4 text-sm whitespace-nowrap transition-colors ${
                    type === t
                      ? "border-navy bg-navy text-white"
                      : "border-rule text-navy/80 hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  {t}
                  <span className={`ml-2 font-mono text-[11px] ${type === t ? "text-white/60" : "text-mute"}`}>{n}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-b border-navy pb-3 text-sm text-mute">
          <p aria-live="polite">
            {status === "loading"
              ? "Loading catalogue…"
              : `${results.length} ${results.length === 1 ? "item" : "items"}${filtered ? " match" : ""}`}
          </p>
          {filtered && (
            <button type="button" onClick={reset} className="draw-line text-navy">
              Clear filters
            </button>
          )}
        </div>

        {status === "error" && (
          <div className="py-16 text-center">
            <p className="text-lg">The catalogue didn&apos;t load just now.</p>
            <p className="mt-2 text-mute">
              Call{" "}
              <a href={tel} className="text-navy underline underline-offset-4">
                {site.phoneDisplay}
              </a>{" "}
              and we&apos;ll read you the list.
            </p>
          </div>
        )}

        {status === "loading" && (
          <ul aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex gap-6 border-b border-rule py-5">
                <span className="h-4 w-14 animate-pulse rounded bg-paper-2" />
                <span className="h-4 flex-1 animate-pulse rounded bg-paper-2" style={{ maxWidth: `${60 - i * 5}%` }} />
              </li>
            ))}
          </ul>
        )}

        {status !== "error" && results.length > 0 && (
          <>
            {/* Desktop table */}
            <table className="hidden w-full text-left md:table">
              <thead>
                <tr className="font-mono text-[11px] tracking-[0.14em] text-mute uppercase">
                  <th className="w-28 py-3 font-normal">Art. No.</th>
                  <th className="py-3 font-normal">Description</th>
                  <th className="w-40 py-3 font-normal">Ends</th>
                  <th className="w-32 py-3 font-normal">HSN</th>
                  <th className="w-20 py-3 font-normal">Sheet</th>
                  <th className="w-32 py-3" />
                </tr>
              </thead>
              <tbody>
                {results.slice(0, shown).map((p) => (
                  <tr key={p.artNo} className="group border-t border-rule transition-colors hover:bg-paper/70">
                    <td className="py-4 pr-4 font-mono text-sm text-brass-deep">
                      <Mark text={p.artNo} q={q} />
                    </td>
                    <td className="py-4 pr-6">
                      <p className="font-medium">
                        <Mark text={p.name} q={q} />
                      </p>
                      <p className="mt-0.5 text-xs text-mute">
                        {p.brand} · {p.type}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-sm text-navy/80">{p.connection || "—"}</td>
                    <td className="py-4 pr-4 font-mono text-sm text-navy/70">{p.hsn || "—"}</td>
                    <td className="py-4 pr-4">
                      <Tdr href={p.tdr} />
                    </td>
                    <td className="py-4 text-right">
                      <AddButton p={p} picked={isPicked(p)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <ul className="md:hidden">
              {results.slice(0, shown).map((p) => (
                <li key={p.artNo} className="border-b border-rule py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-brass-deep">
                        Art. <Mark text={p.artNo} q={q} />
                      </p>
                      <p className="mt-1 leading-snug font-medium">
                        <Mark text={p.name} q={q} />
                      </p>
                    </div>
                    <AddButton p={p} picked={isPicked(p)} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                    {p.connection && <span>{p.connection}</span>}
                    {p.hsn && <span className="font-mono">HSN {p.hsn}</span>}
                    <Tdr href={p.tdr} />
                  </div>
                </li>
              ))}
            </ul>

            {shown < results.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setPage({ key: filterKey, n: shown + PAGE })}
                  className="rounded-full border border-navy/20 px-6 py-3 text-sm font-medium transition-colors hover:border-navy/50"
                >
                  Show more <span className="ml-1 font-mono text-mute">{results.length - shown}</span>
                </button>
              </div>
            )}
          </>
        )}

        {status === "idle" && results.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg">Nothing matches that.</p>
            <p className="mt-2 text-mute">
              We stock more than this list shows.{" "}
              <a href="#contact" className="text-navy underline underline-offset-4">
                Ask us directly
              </a>
              .
            </p>
          </div>
        )}
      </div>

      {/* Enquiry tray */}
      <div
        className={`fixed inset-x-0 bottom-[calc(60px+env(safe-area-inset-bottom))] z-30 px-4 transition-[transform,opacity] duration-300 md:bottom-6 ${
          picked.length ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-full bg-navy py-2 pr-2 pl-6 text-white shadow-[0_20px_40px_-12px_rgb(22_28_60/0.5)]">
          <p className="text-sm">
            <span className="font-mono text-brass">{picked.length}</span> {picked.length === 1 ? "item" : "items"} in your
            enquiry
          </p>
          <a
            href="#contact"
            className="rounded-full bg-brass px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-white"
          >
            Review &amp; send
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site, tel } from "@/lib/site";

const links = [
  { href: "#range", label: "Range" },
  { href: "#catalogue", label: "Catalogue" },
  { href: "#why", label: "Why RK" },
  { href: "#contact", label: "Contact" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy ring-1 ring-white/10">
        <Image src={`${site.basePath}/mark.png`} alt="" width={519} height={221} priority className="w-7" />
      </span>
      <span className="leading-none">
        <span
          className={`block text-[17px] font-semibold tracking-tight [font-stretch:112%] ${light ? "text-white" : "text-navy"}`}
        >
          RK Enterprises
        </span>
        <span
          className={`mt-1 block font-mono text-[10px] tracking-[0.18em] uppercase ${light ? "text-white/50" : "text-mute"}`}
        >
          Jamshedpur
        </span>
      </span>
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[background-color,border-color] duration-300 ${
          open ? "bg-paper" : scrolled ? "bg-paper/85" : "bg-paper/0"
        } border-b ${scrolled || open ? "border-rule" : "border-transparent"}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px]">
          <a href="#top" aria-label={`${site.name} home`} onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="draw-line pb-0.5 text-[15px] text-navy/75 transition-colors hover:text-navy">
                {l.label}
              </a>
            ))}
            <a
              href={tel}
              className="rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-2"
            >
              {site.phoneDisplay}
            </a>
          </nav>

          <button
            type="button"
            className="relative -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-[1.5px] w-6 bg-navy transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`}
            />
            <span
              className={`absolute h-[1.5px] w-6 bg-navy transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`}
            />
          </button>
        </div>
      </header>

      {/* Kept outside <header>: its backdrop-filter would otherwise become the
          containing block for this fixed panel and collapse it to header height. */}
      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={`drafting fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-paper px-6 pt-4 pb-28 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="flex items-baseline justify-between border-b border-rule py-5 text-3xl font-medium tracking-tight [font-stretch:110%]"
          >
            {l.label}
            <span className="font-mono text-xs text-mute">0{i + 1}</span>
          </a>
        ))}
        <p className="mt-auto font-mono text-xs tracking-wider text-mute uppercase">
          {site.address.line2} · {site.phoneDisplay}
        </p>
      </nav>
    </>
  );
}

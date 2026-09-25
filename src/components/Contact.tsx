"use client";

import { useState } from "react";
import { enquiry, useEnquiry } from "@/lib/enquiry";
import { enquiryForm, mailto, mapQuery, site, tel } from "@/lib/site";

const field =
  "w-full rounded-lg border border-rule bg-white px-4 py-3 text-base text-navy placeholder:text-mute/60 transition-colors focus:border-navy focus:outline-none";
const label = "mb-2 block font-mono text-[11px] tracking-[0.16em] text-mute uppercase";

export default function Contact() {
  const picked = useEnquiry();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const list = picked.map((p) => `• ${p.artNo} ${p.name}${p.connection ? ` (${p.connection})` : ""}`);
    const message = [list.length && `Items:\n${list.join("\n")}`, form.message].filter(Boolean).join("\n\n");
    const body = new URLSearchParams({
      [enquiryForm.fields.name]: form.name,
      [enquiryForm.fields.email]: form.email,
      [enquiryForm.fields.phone]: form.phone,
      [enquiryForm.fields.message]: message || "(no message)",
    });
    try {
      // Google Forms doesn't send CORS headers; an opaque response still means it was accepted.
      await fetch(enquiryForm.action, { method: "POST", body, mode: "no-cors" });
      setState("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
      enquiry.clear();
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div data-reveal>
          <p className="mb-5 font-mono text-xs tracking-[0.2em] text-brass-deep uppercase">Contact</p>
          <h2 className="text-4xl leading-[1.02] font-semibold tracking-[-0.025em] [font-stretch:108%] sm:text-5xl lg:text-6xl">
            Send us
            <br />
            your list.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mute">
            Sizes, quantities, Art. Nos. or just a photo of the old part. We&apos;ll come back with availability and a
            price.
          </p>

          <div className="mt-12 divide-y divide-rule border-y border-rule">
            <a href={tel} className="group flex items-center justify-between gap-4 py-5">
              <div>
                <p className={label}>Phone</p>
                <div className="text-2xl font-medium tracking-tight [font-stretch:108%] sm:text-3xl">{site.phoneDisplay}</div>
              </div>
              <span className="text-xl text-brass-deep transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a href={mailto} className="group flex items-center justify-between gap-4 py-5">
              <div className="min-w-0">
                <p className={label}>Email</p>
                <div className="truncate text-lg">{site.email}</div>
              </div>
              <span className="text-xl text-brass-deep transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <div className="grid gap-6 py-5 sm:grid-cols-2">
              <div>
                <p className={label}>Counter</p>
                <div>
                  <address className="leading-relaxed not-italic">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    {site.address.region}
                  </address>
                </div>
              </div>
              <div>
                <p className={label}>Hours</p>
                <div>
                  <ul className="space-y-1">
                    {site.hours.map(([d, h]) => (
                      <li key={d} className="flex justify-between gap-4">
                        <span className="text-mute">{d}</span>
                        <span className="font-mono text-sm">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <iframe
            title={`${site.name} location`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
            className="mt-8 block h-56 w-full rounded-xl border border-rule grayscale-[0.85] sepia-[0.15]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div data-reveal style={{ ["--d" as string]: "120ms" }} className="lg:pt-4">
          {state === "sent" ? (
            <div className="flex min-h-[28rem] flex-col items-start justify-center rounded-2xl border border-rule bg-white p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h3 className="mt-6 text-3xl font-semibold tracking-tight [font-stretch:108%]">Enquiry received.</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-mute">
                We&apos;ll get back to you shortly. If it&apos;s urgent, call{" "}
                <a href={tel} className="text-navy underline underline-offset-4">
                  {site.phoneDisplay}
                </a>
                .
              </p>
              <button type="button" onClick={() => setState("idle")} className="draw-line mt-8 text-sm">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-2xl border border-rule bg-white p-6 sm:p-10">
              <h3 className="text-2xl font-semibold tracking-tight [font-stretch:108%]">Enquiry</h3>

              {picked.length > 0 && (
                <div className="mt-6 rounded-xl bg-paper p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className={label + " mb-0"}>From the catalogue</p>
                    <button type="button" onClick={enquiry.clear} className="text-xs text-mute hover:text-navy">
                      Clear
                    </button>
                  </div>
                  <ul className="divide-y divide-rule">
                    {picked.map((p) => (
                      <li key={p.artNo} className="flex items-center justify-between gap-3 py-2 text-sm">
                        <span className="min-w-0">
                          <span className="mr-2 font-mono text-brass-deep">{p.artNo}</span>
                          {p.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => enquiry.remove(p.artNo)}
                          aria-label={`Remove ${p.artNo}`}
                          className="-mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-mute hover:bg-white hover:text-navy"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                            <path d="M1 1l8 8M9 1L1 9" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={label}>
                    Name
                  </label>
                  <input id="name" required autoComplete="name" className={field} value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label htmlFor="phone" className={label}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+91"
                    className={field}
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={field}
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={label}>
                    {picked.length ? "Quantities & notes" : "What do you need?"}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required={!picked.length}
                    placeholder={
                      picked.length
                        ? "Sizes and quantity for each item, delivery location…"
                        : "e.g. 2 nos. 50 mm bronze gate valve, flanged"
                    }
                    className={field}
                    value={form.message}
                    onChange={set("message")}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={state === "sending"}
                className="mt-7 w-full rounded-full bg-navy px-6 py-4 font-medium text-white transition-colors hover:bg-navy-2 disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Send enquiry"}
              </button>
              {state === "error" && (
                <p className="mt-4 text-center text-sm text-red-700">
                  That didn&apos;t go through. Please try again or call {site.phoneDisplay}.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

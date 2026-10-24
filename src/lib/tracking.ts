"use client";

/** Where a visitor came from, sent along with each enquiry so the sheet shows which channels bring leads. */

const KEY = "rk-first-touch";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

type Touch = { landing: string; referrer: string; at: string } & Partial<Record<(typeof PARAMS)[number], string>>;

function current(): Touch {
  const q = new URLSearchParams(location.search);
  const t: Touch = { landing: location.href, referrer: document.referrer, at: new Date().toISOString() };
  for (const p of PARAMS) {
    const v = q.get(p);
    if (v) t[p] = v;
  }
  return t;
}

function read(store: Storage | undefined): Touch | null {
  try {
    const raw = store?.getItem(KEY);
    return raw ? (JSON.parse(raw) as Touch) : null;
  } catch {
    return null;
  }
}

function write(store: Storage | undefined, t: Touch) {
  try {
    store?.setItem(KEY, JSON.stringify(t));
  } catch {}
}

const local = () => (typeof localStorage === "undefined" ? undefined : localStorage);
const session = () => (typeof sessionStorage === "undefined" ? undefined : sessionStorage);

/** Remember the first visit ever (localStorage) and the first page of this visit (sessionStorage). */
export function captureVisit() {
  const now = current();
  if (!read(local())) write(local(), now);
  if (!read(session())) write(session(), now);
}

/** Flat key/value tracking fields for the enquiry row. */
export function trackingInfo(): Record<string, string> {
  const now = current();
  const visit = read(session()) ?? now;
  const first = read(local()) ?? visit;
  return {
    page: now.landing,
    landingPage: visit.landing,
    referrer: visit.referrer,
    ...Object.fromEntries(PARAMS.map((p) => [p, visit[p] ?? first[p] ?? ""])),
    firstVisit: first.at,
    firstReferrer: first.referrer,
    firstLanding: first.landing,
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

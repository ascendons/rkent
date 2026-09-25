export const site = {
  name: "RK Enterprises",
  tagline: "Pipes, fittings, valves & industrial hardware",
  phone: "9234607632",
  phoneDisplay: "+91 92346 07632",
  email: "rke2233ts@gmail.com",
  address: {
    line1: "D.B. Road, Naya Bazar",
    line2: "Jugsalai, Jamshedpur",
    region: "Jharkhand 831006",
  },
  hours: [
    ["Mon – Fri", "9:00 am – 6:00 pm"],
    ["Saturday", "9:00 am – 2:00 pm"],
    ["Sunday", "Closed"],
  ],
  // Origin only (no path); the Pages workflow sets this and the basePath.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  description:
    "RK Enterprises, Jamshedpur: stockist of Zoloto and Leader valves, pipes and fittings, and industrial hardware. Browse the catalogue, download TDRs and send an enquiry.",
};

/** Absolute URL of the site root, including the basePath. */
export const siteUrl = `${site.url}${site.basePath}`;

export const tel = `tel:+91${site.phone}`;
export const mailto = `mailto:${site.email}`;
export const mapQuery = "Naya Bazar, Jugsalai, Jamshedpur, Jharkhand 831006";

// Google Form that receives website enquiries.
export const enquiryForm = {
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSeSWa8EMf5zl7vGddTb-mt7T1gssCJ6r9Qah7t0ZtbFvYIuhA/formResponse",
  fields: {
    name: "entry.1653629278",
    email: "entry.819945036",
    phone: "entry.1823287760",
    message: "entry.1826648574",
  },
};

export const range = [
  {
    code: "01",
    title: "Valves",
    body: "Globe, gate, ball, butterfly, check and sluice valves in bronze, cast iron, cast steel, forged steel and stainless steel.",
    items: ["Globe", "Gate", "Ball", "Butterfly", "Check / NRV", "Pressure reducing"],
  },
  {
    code: "02",
    title: "Pipes & Fittings",
    body: "Pipe and the fittings that go with it, screwed and flanged, for water, steam, air and process lines.",
    items: ["Elbows", "Tees", "Unions", "Sockets", "Flanges", "Reducers"],
  },
  {
    code: "03",
    title: "Strainers, Traps & Gauges",
    body: "Y-type strainers, steam traps, water level gauges and boiler mountings that keep a line clean and readable.",
    items: ["Y-strainers", "Steam traps", "Level gauges", "Fusible plugs"],
  },
  {
    code: "04",
    title: "Industrial Hardware & Tools",
    body: "Fasteners, hand tools and site consumables for maintenance teams and contractors.",
    items: ["Fasteners", "Hand tools", "Sealants", "Consumables"],
  },
];

export const brands = ["Zoloto", "Leader"];

/* ------------------------------------------------------------------ */
/* Catalogue (published Google Sheet)                                  */
/* ------------------------------------------------------------------ */

const SHEET_ID = "1djgZYlSiPu2A1Qx8hDs8XUEWJG6Qr4AaMFo55vlvH-4";
export const SHEET_CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

export type Product = {
  artNo: string;
  name: string;
  brand: string;
  connection: string;
  hsn: string;
  tdr: string;
  type: string;
  material: string;
};

/** RFC 4180-ish CSV parser: handles quoted fields, escaped quotes and commas inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim()));
}

const TYPES: [RegExp, string][] = [
  [/butterfly/, "Butterfly"],
  [/\bball\b/, "Ball"],
  [/globe/, "Globe"],
  [/gate|sluice/, "Gate & sluice"],
  [/check|non-return/, "Check / NRV"],
  [/strainer/, "Strainers"],
  [/trap/, "Steam traps"],
  [/gauge/, "Level gauges"],
  [/safety|relief|reducing|air release|blow off|fusible/, "Safety & control"],
  [/landing|hydrant/, "Fire hydrant"],
  [/balancing/, "Balancing"],
  [/needle|cock/, "Needle & cocks"],
];

const MATERIALS = ["Bronze", "Cast Iron", "Cast Steel", "Forged Steel", "Forged Brass", "Ductile Iron", "Stainless Steel"];

const typeOf = (name: string) => TYPES.find(([re]) => re.test(name.toLowerCase()))?.[1] ?? "Other";
const materialOf = (name: string) =>
  MATERIALS.find((m) => name.toLowerCase().startsWith(m.toLowerCase())) ?? "";

export function productsFromCsv(text: string): Product[] {
  const [header, ...rows] = parseCsv(text);
  if (!header) return [];
  const col = (...names: string[]) =>
    header.findIndex((h) => names.some((n) => h.trim().toLowerCase().startsWith(n.toLowerCase())));
  const idx = {
    brand: col("Company", "Brand"),
    artNo: col("Art"),
    name: col("Product"),
    connection: col("Connection"),
    hsn: col("HSN"),
    tdr: col("TDR"),
  };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const r of rows) {
    const artNo = get(r, idx.artNo);
    const name = get(r, idx.name).replace(/\s+/g, " ");
    if (!artNo || !name || seen.has(artNo)) continue;
    seen.add(artNo);
    out.push({
      artNo,
      name,
      brand: get(r, idx.brand) || "Zoloto",
      connection: get(r, idx.connection),
      hsn: get(r, idx.hsn),
      tdr: get(r, idx.tdr),
      type: typeOf(name),
      material: materialOf(name),
    });
  }
  return out;
}

export async function fetchProducts(init?: RequestInit): Promise<Product[]> {
  const res = await fetch(SHEET_CSV, init);
  if (!res.ok) throw new Error(`Catalogue request failed (${res.status})`);
  return productsFromCsv(await res.text());
}

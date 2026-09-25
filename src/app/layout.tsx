import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { range, site, siteUrl } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const { description } = site;
const title = `${site.name} | Valves, Pipes & Fittings in Jamshedpur`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "Industrial Supplies",
  keywords: [
    "RK Enterprises",
    "RK Enterprises Jamshedpur",
    "Zoloto valves Jamshedpur",
    "Zoloto dealer Jharkhand",
    "Leader valves",
    "valves supplier Jamshedpur",
    "pipes and fittings Jamshedpur",
    "industrial hardware Jugsalai",
    "gate valve",
    "ball valve",
    "butterfly valve",
    "bronze valves",
  ],
  // Absolute, basePath-aware URL: Next does not prefix basePath onto canonical links.
  alternates: { canonical: `${siteUrl}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${siteUrl}/`,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    "geo.region": "IN-JH",
    "geo.placename": "Jugsalai, Jamshedpur, Jharkhand",
  },
};

export const viewport: Viewport = {
  themeColor: "#161c3c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HardwareStore",
      "@id": `${siteUrl}/#business`,
      name: site.name,
      slogan: site.tagline,
      description,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/logo.png`,
      image: `${siteUrl}/opengraph-image.jpg`,
      telephone: `+91${site.phone}`,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.line1,
        addressLocality: "Jugsalai, Jamshedpur",
        addressRegion: "Jharkhand",
        postalCode: "831006",
        addressCountry: "IN",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
      ],
      areaServed: { "@type": "State", name: "Jharkhand" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Product range",
        itemListElement: range.map((r) => ({
          "@type": "OfferCatalog",
          name: r.title,
          description: r.body,
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: site.name,
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#business` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${archivo.variable} ${plexMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh font-sans">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}

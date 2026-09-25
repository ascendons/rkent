import Catalogue from "@/components/Catalogue";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import { Footer, MobileDock, Range, Strip, Why } from "@/components/Sections";
import { fetchProducts, type Product } from "@/lib/site";

// Snapshot the sheet at build time so the catalogue renders instantly (and is crawlable);
// the client refreshes it on load.
async function snapshot(): Promise<Product[]> {
  try {
    return await fetchProducts();
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await snapshot();
  const families = new Set(products.map((p) => p.type).filter((t) => t !== "Other")).size;

  return (
    <>
      <Header />
      <main>
        <Hero count={products.length} families={families} />
        <Strip />
        <Range />
        <Catalogue initial={products} />
        <Why />
        <Contact />
      </main>
      <Footer />
      <MobileDock />
      <Reveal />
    </>
  );
}

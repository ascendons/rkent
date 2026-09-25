import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "RK Enterprises",
    description: site.description,
    start_url: `${site.basePath}/`,
    display: "standalone",
    background_color: "#161c3c",
    theme_color: "#161c3c",
    icons: [{ src: `${site.basePath}/icon.png`, sizes: "512x512", type: "image/png" }],
  };
}

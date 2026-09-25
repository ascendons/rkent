import type { NextConfig } from "next";
import path from "node:path";

// Set by the GitHub Pages workflow (e.g. "/mbassociates"); empty for local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;

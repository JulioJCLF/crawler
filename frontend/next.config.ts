import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // O repositório no GitHub se chama crawler, então o base path do GitHub Pages será /crawler
  basePath: "/crawler",
};

export default nextConfig;

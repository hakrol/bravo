import createMDX from "@next/mdx";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const withMDX = createMDX({});
const servitorBlogPath = "/blogg/hva-er-lonnen-til-en-servitor";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/timelonn",
        destination: "/yrker",
        permanent: true,
      },
      {
        source: "/timelonn/:slug-timelonn",
        destination: "/yrke/:slug-lonn",
        permanent: true,
      },
      {
        source: "/lonnsvekst-:slug",
        destination: "/yrke/:slug-lonn",
        permanent: true,
      },
      {
        source: "/lonnsvekst/yrke/:slug",
        destination: "/yrke/:slug-lonn",
        permanent: true,
      },
      {
        source: "/blogg/hva-er-lonnen-til-en-servitør",
        destination: servitorBlogPath,
        permanent: true,
      },
      {
        source: "/blogg/hva-er-lønnen-til-en-servitor",
        destination: servitorBlogPath,
        permanent: true,
      },
      {
        source: "/blogg/hva-er-lønnen-til-en-servitør",
        destination: servitorBlogPath,
        permanent: true,
      },
      {
        source: "/blogg/hva-er-lonnen-til-en-servtior",
        destination: servitorBlogPath,
        permanent: true,
      },
      {
        source: "/blogg/hva-er-lønnen-til-en-servtiør",
        destination: servitorBlogPath,
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: workspaceRoot,
  },
};

export default withMDX(nextConfig);

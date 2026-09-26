import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const servitorBlogPath = "/blogg/hva-er-lonnen-til-en-servitor";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
  reactStrictMode: true,
  staticPageGenerationTimeout: 180,
  async redirects() {
    return [
      {
        source: "/minstelonn-elektriker",
        destination: "/minstelonn/minstelonn-elektriker",
        permanent: true,
      },
      {
        source: "/minstelonn-renholder",
        destination: "/minstelonn/minstelonn-renholder",
        permanent: true,
      },
      {
        source: "/minstelonn-butikkmedarbeider",
        destination: "/minstelonn/minstelonn-butikkmedarbeider",
        permanent: true,
      },
      {
        source: "/kalkulatorer",
        destination: "/verktoy",
        permanent: true,
      },
      {
        source: "/ressurser",
        destination: "/verktoy",
        permanent: true,
      },
      {
        source: "/yrkesfamilier",
        destination: "/yrker",
        permanent: true,
      },
      {
        source: "/yrkesfamilie/:slug",
        destination: "/yrker",
        permanent: true,
      },
      {
        source: "/yrkesomrader",
        destination: "/yrker",
        permanent: true,
      },
      {
        source: "/yrkesomrade/:slug",
        destination: "/yrker",
        permanent: true,
      },
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

export default nextConfig;

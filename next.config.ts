import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next-build",
  turbopack: {
    root: workspaceRoot
  }
};

export default nextConfig;

import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray package-lock.json in a
  // parent folder otherwise makes Next.js guess the wrong root.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    // This site never needs 3840px-wide images; capping the largest
    // candidate avoids the optimizer generating oversized files.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;

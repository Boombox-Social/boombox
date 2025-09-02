import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Remove strictMode from experimental - it's not a valid Next.js experimental feature
  },
  // Enable TypeScript strict mode
  typescript: {
    // Set this to false if you want production builds to continue even if TypeScript errors are found
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set this to false if you want production builds to continue even if ESLint errors are found
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
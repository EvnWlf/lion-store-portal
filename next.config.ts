import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/lion-store-portal',
  assetPrefix: '/lion-store-portal/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

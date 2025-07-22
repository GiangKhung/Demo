import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "ui-avatars.com", "via.placeholder.com"],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000"
        }/uploads/:path*`,
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:5000"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Thêm config cho production
  trailingSlash: false,
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  basePath: "",
  output: "standalone",
};

export default nextConfig;

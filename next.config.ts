import type { NextConfig } from "next";

/** Vercel 서버에서 백엔드로 프록시 (브라우저는 same-origin /api/soundbridge 호출) */
const backendUrl = (process.env.API_URL || "https://soundbridgebackend-production.up.railway.app").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/soundbridge/:path*",
        destination: `${backendUrl}/api/soundbridge/:path*`,
      },
    ];
  },
};

export default nextConfig;

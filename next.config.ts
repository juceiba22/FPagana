import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              "frame-src *",
              "media-src *",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
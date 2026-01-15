 import type { NextConfig } from "next"; 

const nextConfig: NextConfig = {
  htmlLimitedBots: /.*/,
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "source.unsplash.com",
      "cdn-icons-png.flaticon.com",
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

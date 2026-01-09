import type { NextConfig } from "next";

// Get API base URL from environment variable
const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    return "https://edutech-backend-eh72.onrender.com";
  }
};

const API_BASE_URL = getApiBaseUrl();

const nextConfig: NextConfig = {
  /* config options here */

  poweredByHeader: false,
  generateEtags: true,
  compress: true,

  // Image Optimization
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"], // Enable modern image formats
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for at least 7 days
  },

  // SEO headers and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value:
              process.env.NODE_ENV === "development"
                ? `default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' ${API_BASE_URL} ws: wss:;`
                : `default-src 'self'; img-src 'self' data: https: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' ${API_BASE_URL} https://*.vercel.app; frame-src 'self';`,
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3200, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/:all*(mp4|gif|jpg|jpeg|png|svg|webp|avif|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, immutable",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        stream: false,
        crypto: false,
        os: false,
        path: false,
        buffer: false,
        util: false,
        url: false,
        zlib: false,
        net: false,
        module: false,
      };
    }

    return config;
  },
};

export default nextConfig;

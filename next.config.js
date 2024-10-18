const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin();
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/announcements",
        permanent: true,
      },
      {
        source: "/activities",
        destination: "/activities/competitions",
        permanent: true,
      },
      {
        source: "/campus",
        destination: "/campus/life",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  trailingSlash: false,
};

module.exports = withNextIntl(nextConfig);

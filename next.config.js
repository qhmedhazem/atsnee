import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:locale(en|ar)/specializations",
        destination: "/:locale/departments",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/activities",
        destination: "/:locale/activities/competitions",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Media on Cloudflare R2 (bucket atsnee-media)
      { protocol: "https", hostname: "media.atsnee.org", pathname: "/**" },
    ],
  },
};

export default withPayload(nextConfig);

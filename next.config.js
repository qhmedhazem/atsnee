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
    // Media is already WebP in fixed sizes (Payload) and served by Cloudflare from R2 for free; Vercel's optimizer
    // only spent the Hobby quota (5K transformations/month) and broke images once it ran out.
    unoptimized: true,
    remotePatterns: [
      // Media on Cloudflare R2 (bucket atsnee-media)
      { protocol: "https", hostname: "media.atsnee.org", pathname: "/**" },
    ],
  },
};

export default withPayload(nextConfig);

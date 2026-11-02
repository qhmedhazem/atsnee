// Always the live domain: these files are committed, and a local build (NEXT_PUBLIC_SERVER_URL=localhost)
// must not write localhost URLs into them.
const SITE_URL = "https://www.atsnee.org";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    "/posts-sitemap.xml",
    "/pages-sitemap.xml",
    "/*",
    "/announcements/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        disallow: "/admin/*",
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
    ],
  },
};

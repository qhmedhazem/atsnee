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
  env: {
    ISSUES_LINK: "https://github.com/qhmedhazem/atsnet-website/issues/new",
    FACEBOOK_LINK: "https://www.facebook.com/groups/3302741273312091/about",
    LINKEDIN_LINK: "https://linkedin.com/school/atsnee",
    INSTAGRAM_LINK: "https://www.instagram.com/atsnee_school",
    EMAIL: "mail:contact@atsnee.org",
    TELEPHONE: "tel:+201221681400",
  },
};

module.exports = withNextIntl(nextConfig);

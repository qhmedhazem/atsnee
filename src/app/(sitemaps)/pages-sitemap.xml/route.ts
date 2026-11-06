import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import payload from "@/lib/payload";
import { unstable_cache } from "next/cache";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { getServerSideURL } from "@/lib/getURL";
import { ACTIVITY_TYPES } from "@/blocks/ActivitiesList";

const getPagesSitemap = unstable_cache(
  async () => {
    const SITE_URL = getServerSideURL();

    const results = await payload.find({
      collection: "pages",
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: "published",
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const dateFallback = new Date().toISOString();

    // CMS pages, plus the pages served by their own routes from globals (news, admission, contact, activities tabs).
    const entries = [
      ...results.docs
        .filter((page) => Boolean(page?.slug))
        .map((page) => ({ path: page.slug === "home" ? "" : `/${page.slug}`, lastmod: page.updatedAt })),
      ...["/announcements", "/admission", "/contact", ...ACTIVITY_TYPES.map((type) => `/activities/${type}`)].map(
        (path) => ({ path, lastmod: undefined as string | undefined }),
      ),
    ];
    const sitemap: ISitemapField[] = entries.flatMap(({ path, lastmod }) =>
      SUPPORTED_LOCALES.map((locale) => ({ loc: `${SITE_URL}/${locale}${path}`, lastmod: lastmod || dateFallback })),
    );

    return sitemap;
  },
  ["pages-sitemap"],
  {
    tags: ["pages-sitemap"],
  }
);

// Served from the CDN (ISR) so crawlers never wait on a cold function (Search Console saw 504s);
// refreshed hourly, or right away when the posts/pages hooks revalidate the sitemap tag.
export const revalidate = 3600;

export async function GET() {
  const sitemap = await getPagesSitemap();
  return getServerSideSitemap(sitemap);
}

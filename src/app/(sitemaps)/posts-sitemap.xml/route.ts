import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { unstable_cache } from "next/cache";
import payload from "@/lib/payload";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { getServerSideURL } from "@/lib/getURL";

const getPostsSitemap = unstable_cache(
  async () => {
    const SITE_URL = getServerSideURL();

    const results = await payload.find({
      collection: "posts",
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

    const sitemap: ISitemapField[] = results.docs
      ? results.docs
          .filter((post) => Boolean(post?.slug))
          .map((post) =>
            SUPPORTED_LOCALES.map((locale) => ({
              loc: `${SITE_URL}/${locale}/announcements/${post?.slug}`,
              lastmod: post.updatedAt || dateFallback,
            }))
          )
          .flat()
      : [];

    return sitemap;
  },
  ["posts-sitemap"],
  {
    tags: ["posts-sitemap"],
  }
);

// Served from the CDN (ISR) so crawlers never wait on a cold function (Search Console saw 504s);
// refreshed hourly, or right away when the posts/pages hooks revalidate the sitemap tag.
export const revalidate = 3600;

export async function GET() {
  const sitemap = await getPostsSitemap();

  return getServerSideSitemap(sitemap);
}

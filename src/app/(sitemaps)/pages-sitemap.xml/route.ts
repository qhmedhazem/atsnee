import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import payload from "@/lib/payload";
import { unstable_cache } from "next/cache";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { getServerSideURL } from "@/lib/getURL";

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

    const sitemap: ISitemapField[] = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) =>
            SUPPORTED_LOCALES.map((locale) => {
              return {
                loc:
                  page?.slug === "home"
                    ? `${SITE_URL}/${locale}`
                    : `${SITE_URL}/${locale}/${page?.slug}`,
                lastmod: page.updatedAt || dateFallback,
              };
            })
          )
          .flat()
      : [];

    return sitemap;
  },
  ["pages-sitemap"],
  {
    tags: ["pages-sitemap"],
  }
);

export async function GET() {
  const sitemap = await getPagesSitemap();
  return getServerSideSitemap(sitemap);
}

import React from "react";
import { headers } from "next/headers";
import { Search, SearchX } from "lucide-react";
import type { Where } from "payload";
import { AnnouncementList as AnnouncementListInterface } from "@/payload-types";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import Link from "@/components/ui/Link";
import NewsCard, { type NewsItem } from "./NewsCard";
import Pagination from "./Pagination";
import { FRAME } from "@/lib/layout";

const PAGE_SIZE = 12; // page 1 = 1 lead + 2 side + 9 in the grid
const t = {
  heading: { en: "Latest News", ar: "آخر الأخبار" },
  search: { en: "Search news", ar: "ابحث في الأخبار" },
  results: { en: (n: string, one: boolean) => `${n} ${one ? "result" : "results"}`, ar: (n: string) => `${n} نتيجة` },
  empty: { en: "No news matches", ar: "لا توجد أخبار تطابق" },
  showAll: { en: "Show all news", ar: "عرض كل الأخبار" },
};

const grid = "grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 min-[640px]:gap-6 min-[980px]:grid-cols-3";

// "max": the latest N as a grid (home). "scroll": the News page — search, featured block on page 1, ?page= pagination.
const AnnouncementList: React.FC<Pick<AnnouncementListInterface, "displayMode" | "maxPosts">> = async ({
  displayMode,
  maxPosts,
}) => {
  const locale = await getLocale();
  const paged = displayMode === "scroll";
  const search = new URLSearchParams((await headers()).get("x-search") ?? "");
  const q = paged ? (search.get("q") ?? "").trim().slice(0, 100) : "";
  const requested = paged ? Math.max(1, Math.floor(Number(search.get("page"))) || 1) : 1;

  const where: Where | undefined = q ? { or: [{ title: { like: q } }, { brief: { like: q } }] } : undefined;

  const posts = await payload.find({
    collection: "posts",
    locale,
    draft: false,
    where,
    sort: "-publishedAt",
    limit: paged ? PAGE_SIZE : maxPosts || 10,
    page: requested,
    depth: 1,
    // Only what the cards show; full posts (content, related posts) are far too heavy for a list.
    select: { title: true, slug: true, brief: true, banner: true, gallery: true, publishedAt: true },
  });
  const docs = posts.docs as NewsItem[];

  const cards = (items: NewsItem[]) => (
    <ul className={grid}>
      {items.map((post) => (
        <li key={post.slug} className="min-w-0">
          <NewsCard post={post} locale={locale} />
        </li>
      ))}
    </ul>
  );

  if (!paged) return <div className={FRAME}>{cards(docs)}</div>;

  const featured = !q && posts.page === 1 && docs.length >= 3;
  const num = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-GB").format(posts.totalDocs);

  return (
    <div className={`${FRAME} flex flex-col gap-8`}>
      <div className="flex flex-col gap-4 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{t.heading[locale]}</h2>
          {q && (
            <span className="text-sm text-gray-700" aria-live="polite">
              {locale === "ar" ? t.results.ar(num) : t.results.en(num, posts.totalDocs === 1)}
            </span>
          )}
        </div>
        {/* Plain GET form: the server filters with ?q= (no client JS); a new search starts at page 1. */}
        <form role="search" method="get" className="relative w-full min-[640px]:w-[280px]">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t.search[locale]}
            aria-label={t.search[locale]}
            className="h-11 w-full rounded-[10px] border border-gray-300 bg-white pe-3 ps-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-light-blue-800 focus-visible:outline-2 focus-visible:outline-light-blue-800/30"
          />
        </form>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-gray-300 px-6 py-16 text-center">
          <SearchX className="size-10 text-gray-500" aria-hidden />
          <p className="text-gray-700">
            {t.empty[locale]} {q && <bdi className="font-semibold">«{q}»</bdi>}
          </p>
          <Link href="?" className="text-sm font-semibold text-light-blue-800 hover:underline">
            {t.showAll[locale]}
          </Link>
        </div>
      ) : featured ? (
        <>
          <div className="grid gap-3 min-[640px]:gap-6 min-[980px]:grid-cols-[1.6fr_1fr]">
            <NewsCard post={docs[0]} locale={locale} variant="lead" />
            <div className="grid gap-3 min-[640px]:grid-cols-2 min-[640px]:gap-6 min-[980px]:flex min-[980px]:flex-col">
              <NewsCard post={docs[1]} locale={locale} variant="side" />
              <NewsCard post={docs[2]} locale={locale} variant="side" />
            </div>
          </div>
          {docs.length > 3 && cards(docs.slice(3))}
        </>
      ) : (
        cards(docs)
      )}

      <Pagination page={posts.page ?? 1} totalPages={posts.totalPages} q={q || undefined} locale={locale} />
    </div>
  );
};

export default AnnouncementList;

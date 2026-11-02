import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/locale";
import Link from "@/components/ui/Link";
import { cn } from "@/lib/utils";

const t = {
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  label: { en: "Pages", ar: "الصفحات" },
  page: { en: "Page", ar: "صفحة" },
};

// 1, the pages around the current one, the last page; "…" for gaps (a gap of one page shows that page instead).
export const pageList = (current: number, total: number): (number | "…")[] => {
  const keep = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  keep.forEach((p, i) => {
    const prev = keep[i - 1];
    if (prev && p - prev === 2) out.push(prev + 1);
    else if (prev && p - prev > 2) out.push("…");
    out.push(p);
  });
  return out;
};

// Real links (?page=n, keeping ?q=) so every page is crawlable and shareable.
export const pageHref = (page: number, q?: string) => {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `?${s}` : "?";
};

const item = "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-[10px] px-3 text-sm font-semibold";
const idle = "border border-gray-300 bg-white text-gray-900 hover:border-light-blue-800 hover:text-light-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-800";

const Pagination: React.FC<{ page: number; totalPages: number; q?: string; locale: Locale }> = ({ page, totalPages, q, locale }) => {
  if (totalPages <= 1) return null;
  const num = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-GB");
  const prev = (
    <>
      <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden /> {t.previous[locale]}
    </>
  );
  const next = (
    <>
      {t.next[locale]} <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
    </>
  );

  return (
    <nav aria-label={t.label[locale]} className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={pageHref(page - 1, q)} rel="prev" className={cn(item, idle)}>{prev}</Link>
      ) : (
        <span aria-disabled className={cn(item, "border border-gray-300 text-gray-500 opacity-50")}>{prev}</span>
      )}
      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="hidden px-1 text-gray-500 min-[640px]:inline" aria-hidden>…</span>
        ) : p === page ? (
          <span key={p} aria-current="page" className={cn(item, "bg-light-blue-800 text-white")}>
            <span className="sr-only">{t.page[locale]} </span>{num.format(p)}
          </span>
        ) : (
          // Mobile shows only previous, the current page and next.
          <Link key={p} href={pageHref(p, q)} className={cn(item, idle, "hidden min-[640px]:inline-flex")}>
            <span className="sr-only">{t.page[locale]} </span>{num.format(p)}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={pageHref(page + 1, q)} rel="next" className={cn(item, idle)}>{next}</Link>
      ) : (
        <span aria-disabled className={cn(item, "border border-gray-300 text-gray-500 opacity-50")}>{next}</span>
      )}
    </nav>
  );
};

export default Pagination;

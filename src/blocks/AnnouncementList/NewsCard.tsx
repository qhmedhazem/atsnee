import React from "react";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Media, Post } from "@/payload-types";
import type { Locale } from "@/lib/locale";
import Link from "@/components/ui/Link";
import { cn } from "@/lib/utils";

// School logo on the site's blue, for posts with no photos at all.
export const DEFAULT_COVER = "/announcement-default.webp";

// Cover: the banner, else the first gallery photo (gallery-only posts have no banner).
export const announcementCover = (post: Pick<Post, "banner" | "gallery">) => {
  const first = post.gallery?.find((g) => typeof g.image === "object")?.image;
  return (typeof post.banner === "object" && post.banner) || (typeof first === "object" ? first : null) || null;
};

// "27 October 2026" / "٢٧ أكتوبر ٢٠٢٦", in the school's timezone.
export const formatPostDate = (date: string | null | undefined, locale: Locale) =>
  date
    ? new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Cairo",
      }).format(new Date(date))
    : "";

export type NewsItem = Pick<Post, "title" | "slug" | "brief" | "banner" | "gallery" | "publishedAt">;

const t = {
  latest: { en: "Latest", ar: "الأحدث" },
  read: { en: "Read story", ar: "اقرأ الخبر" },
};

const PostDate = ({ date, locale }: { date?: string | null; locale: Locale }) =>
  date ? (
    <time dateTime={date} className="flex items-center gap-1.5 text-xs text-gray-700">
      <Calendar className="size-3.5 shrink-0" aria-hidden />
      {formatPostDate(date, locale)}
    </time>
  ) : null;

// The og/fourThree sizes are cropped through the middle, which cuts heads off tall photos. Covers use the original
// and aim at the focal point an editor set in the admin, else a bit above center for portrait photos.
export const coverPosition = (img?: Media | null) => {
  if (!img) return undefined;
  const x = img.focalX ?? 50;
  const y = img.focalY ?? 50;
  if (x !== 50 || y !== 50) return `${x}% ${y}%`;
  return (img.height ?? 0) > (img.width ?? 0) ? "50% 20%" : undefined;
};

const cover = (post: NewsItem) => {
  const img = announcementCover(post) as Media | null;
  return { src: img?.url || DEFAULT_COVER, alt: img?.alt || "", style: { objectPosition: coverPosition(img) } };
};

const cardBase =
  "group relative flex overflow-hidden rounded-[14px] border border-gray-300 bg-white text-gray-900 " +
  "motion-safe:transition motion-safe:duration-200 hover:shadow-[0_10px_24px_-12px_rgb(0_0_0/0.25)] motion-safe:hover:-translate-y-[3px] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-800";
const zoom = "object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.04]";
const titleHover = "group-hover:text-light-blue-800 motion-safe:transition-colors";

interface Props {
  post: NewsItem;
  locale: Locale;
  // grid: vertical card, compact horizontal under 640px. side: the 2 cards next to the lead (image fills the height).
  variant?: "grid" | "lead" | "side";
}

const NewsCard: React.FC<Props> = ({ post, locale, variant = "grid" }) => {
  const href = `/announcements/${post.slug}`;

  if (variant === "lead") {
    const img = cover(post);
    return (
      <Link href={href} className={cn(cardBase, "h-full flex-col")}>
        <div className="relative aspect-video w-full overflow-hidden bg-gray-200">
          <Image src={img.src} alt={img.alt} style={img.style} fill preload fetchPriority="high" sizes="(min-width: 980px) 680px, 100vw" className={zoom} />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="w-fit rounded-full bg-light-blue-100/60 px-3 py-1 text-xs font-semibold text-light-blue-800">
            {t.latest[locale]}
          </span>
          <h3 className={cn("text-2xl font-bold leading-snug", titleHover)} dir="auto">
            {post.title}
          </h3>
          {post.brief && (
            <p className="line-clamp-2 text-gray-700" dir="auto">
              {post.brief}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-4 pt-2">
            <PostDate date={post.publishedAt} locale={locale} />
            <span className="flex items-center gap-1 text-sm font-semibold text-light-blue-800">
              {t.read[locale]}
              <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  const img = cover(post);
  return (
    <Link
      href={href}
      className={cn(
        cardBase,
        "h-full flex-row items-center gap-3 p-2 min-[640px]:flex-col min-[640px]:items-stretch min-[640px]:gap-0 min-[640px]:p-0",
        variant === "side" && "min-[640px]:flex-1",
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-[10px] bg-gray-200 min-[640px]:w-full min-[640px]:rounded-none",
          variant === "side" ? "min-[640px]:aspect-auto min-[640px]:min-h-[150px] min-[640px]:flex-1" : "min-[640px]:aspect-[16/10]",
        )}
      >
        <Image
          src={img.src}
          alt={img.alt}
          style={img.style}
          fill
          sizes={variant === "side" ? "(min-width: 980px) 420px, (min-width: 640px) 45vw, 120px" : "(min-width: 980px) 360px, (min-width: 640px) 45vw, 120px"}
          className={zoom}
        />
      </div>
      {/* min-w-0: lets long titles clamp instead of widening the row */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 min-[640px]:flex-none min-[640px]:p-4">
        <PostDate date={post.publishedAt} locale={locale} />
        <h3 className={cn("line-clamp-2 text-[15px] font-bold leading-snug min-[640px]:text-[17px]", titleHover)} dir="auto">
          {post.title}
        </h3>
        {variant === "grid" && post.brief && (
          <p className="line-clamp-2 hidden text-sm text-gray-700 min-[640px]:block" dir="auto">
            {post.brief}
          </p>
        )}
      </div>
    </Link>
  );
};

export default NewsCard;

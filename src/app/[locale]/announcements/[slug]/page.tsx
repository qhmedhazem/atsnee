import React, { cache } from "react";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import payload from "@/lib/payload";
import type { Where } from "payload";
import type { Media, Post } from "@/payload-types";

import PageNotFound from "@/components/PageNotFound";
import PostGallery from "@/components/PostGallery";
import NewsCard, { announcementCover, formatPostDate } from "@/blocks/AnnouncementList/NewsCard";
import { generateMeta } from "@/lib/generateMeta";
import { RenderPageLayout } from "@/blocks/RenderPageLayout";
import { getLocale } from "@/lib/getLocale";
import type { Locale } from "@/lib/locale";

const STRINGS = {
  en: { gallery: "Gallery", related: "Related announcements" },
  ar: { gallery: "معرض الصور", related: "أخبار ذات صلة" },
};
const RELATED_COUNT = 3;

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug = "" } = await paramsPromise;
  const locale = await getLocale();
  const post = await queryPostBySlug({ slug });

  if (!post) {
    return <PageNotFound className="min-h-screen" />;
  }

  const t = STRINGS[locale];
  const gallery = (post.gallery ?? []).flatMap(({ image }) =>
    typeof image === "object" && image?.url
      ? [{ url: image.url, cover: image.sizes?.fourThree?.url || image.url, thumb: image.sizes?.thumbnail?.url || image.url, alt: image.alt ?? "" }]
      : []
  );
  const related = await relatedPosts(post, locale);
  const hasText = !!post.content?.root?.children?.length;

  return (
    <>
      <RenderPageLayout
        blocks={[
          {
            id: "header",
            blockType: "imageHeader",
            blockName: "Header",
            title: post.title,
            description: formatPostDate(post.publishedAt, locale),
            image: announcementCover(post) as Media,
          },
          ...(hasText
            ? [
                {
                  id: "content",
                  blockType: "blockGroup" as const,
                  blockName: "Content",
                  maxWidth: "container" as const,
                  paddingTop: "pt-16" as const,
                  paddingBottom: gallery.length ? ("pb-4" as const) : ("pb-16" as const),
                  blocks: [{ id: "contentText", blockType: "richText" as const, blockName: "Content", content: post.content! }],
                },
              ]
            : []),
        ]}
      />

      {gallery.length > 0 && (
        <section className="container flex flex-col gap-6 pb-16 pt-12">
          <h2 className="text-2xl font-bold">{t.gallery}</h2>
          <PostGallery images={gallery} />
        </section>
      )}

      {related.length > 0 && (
        <section className="container flex flex-col gap-6 border-t border-gray-200 pb-16 pt-12">
          <h2 className="text-2xl font-bold">{t.related}</h2>
          <ul className="grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 min-[640px]:gap-6 min-[980px]:grid-cols-3">
            {related.map((p) => (
              <li key={p.id} className="min-w-0">
                <NewsCard post={p} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

// Editor-picked related posts first, then the newest posts in the same category, then the newest overall.
async function relatedPosts(post: Post, locale: Locale): Promise<Post[]> {
  const picked = (post.relatedPosts ?? []).filter((p): p is Post => typeof p === "object" && !!p);
  const result = picked.slice(0, RELATED_COUNT);
  const categoryId = typeof post.category === "object" ? post.category?.id : post.category;

  const filters: Where[] = categoryId ? [{ category: { equals: categoryId } }, {}] : [{}];
  for (const where of filters) {
    if (result.length >= RELATED_COUNT) break;
    const { docs } = await payload.find({
      collection: "posts",
      locale,
      draft: false,
      sort: "-publishedAt",
      limit: RELATED_COUNT,
      where: { ...where, id: { not_in: [post.id, ...result.map((p) => p.id)] } },
    });
    result.push(...docs.slice(0, RELATED_COUNT - result.length));
  }
  return result;
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = "" } = await paramsPromise;
  const post = await queryPostBySlug({ slug });

  return generateMeta({ doc: post });
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const locale = await getLocale();
  const { isEnabled: draft } = await draftMode();

  const result = await payload.find({
    collection: "posts",
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

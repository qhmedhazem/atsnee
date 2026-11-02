import React from "react";
import type { Metadata } from "next";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import { heroMeta } from "@/lib/pageMeta";
import ImageHeader from "@/blocks/ImageHeader";
import AnnouncementList from "@/blocks/AnnouncementList";

// The News page: hero from the news-page global, the list from Posts (search, featured block, ?page=).
export default async function NewsPage() {
  const { hero } = await payload.findGlobal({ slug: "news-page", locale: await getLocale(), depth: 1 });
  return (
    // Same wrapper as CMS pages (RenderPageLayout): centers each section.
    <main className="flex min-h-screen flex-col items-center">
      <ImageHeader {...hero} size="compact" />
      <div className="pb-16 pt-8">
        <AnnouncementList displayMode="scroll" />
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await payload.findGlobal({ slug: "news-page", locale: await getLocale(), depth: 1 });
  return heroMeta(hero);
}

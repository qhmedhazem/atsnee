import React from "react";
import type { Metadata } from "next";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import { heroMeta } from "@/lib/pageMeta";
import ImageHeader from "@/blocks/ImageHeader";
import AdmissionStatus from "@/blocks/AdmissionStatus";
import ScrollingSection from "@/blocks/ScrollingSection";

// Everything comes from the admission global: status card (dates, apply link) and the stages timeline.
export default async function AdmissionPage() {
  const g = await payload.findGlobal({ slug: "admission", locale: await getLocale(), depth: 1 });
  return (
    // Same wrapper as CMS pages (RenderPageLayout): centers each section.
    <main className="flex min-h-screen flex-col items-center">
      <ImageHeader {...g.hero} />
      <AdmissionStatus />
      {!!g.stages?.length && (
        <ScrollingSection
          blockType="scrollingSection"
          items={g.stages}
          maxWidth="container"
          gap="gap-11"
          paddingTop="pt-16"
          paddingBottom="pb-16"
        />
      )}
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await payload.findGlobal({ slug: "admission", locale: await getLocale(), depth: 1 });
  return heroMeta(hero);
}

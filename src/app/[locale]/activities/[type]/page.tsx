import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import { heroMeta } from "@/lib/pageMeta";
import ImageHeader from "@/blocks/ImageHeader";
import ActivitiesList, { ACTIVITY_TYPES, ActivityType } from "@/blocks/ActivitiesList";

type Args = { params: Promise<{ type: string }> };

const isType = (t: string): t is ActivityType => (ACTIVITY_TYPES as readonly string[]).includes(t);

// Hero from the activities-page global; the tabs and cards come from the Activities collection.
export default async function ActivitiesTab({ params }: Args) {
  const { type } = await params;
  if (!isType(type)) notFound();
  const { hero } = await payload.findGlobal({ slug: "activities-page", locale: await getLocale(), depth: 1 });

  return (
    // Same wrapper as CMS pages (RenderPageLayout): centers each section.
    <main className="flex min-h-screen flex-col items-center">
      <ImageHeader {...hero} />
      <section className="container flex flex-col gap-8 px-6 pb-10 pt-10">
        <ActivitiesList type={[...ACTIVITY_TYPES]} activeType={type} />
      </section>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await payload.findGlobal({ slug: "activities-page", locale: await getLocale(), depth: 1 });
  return heroMeta(hero);
}

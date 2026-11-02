import React from "react";
import type { Metadata } from "next";
import { draftMode, headers } from "next/headers";

import type { Page as PageType } from "@/payload-types";

import { RenderPageLayout } from "@/blocks/RenderPageLayout";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { getLocale } from "@/lib/getLocale";
import { queryPageBySlug } from "@/lib/queryPage";
import PageNotFound from "@/components/PageNotFound";
import { generateMeta } from "@/lib/generateMeta";

// export async function generateStaticParams() {
//   const pages = await payload.find({
//     collection: "pages",
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   });

//   const params = pages.docs
//     ?.filter((doc) => {
//       return doc.slug !== "home";
//     })
//     .map(({ slug }) => {
//       return { slug };
//     });

//   return params;
// }

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const locale = await getLocale();
  const { isEnabled: draft } = await draftMode();
  const { slug = "home" } = await paramsPromise;
  const url = "/" + slug;

  let page: PageType | null = await queryPageBySlug({
    slug,
    locale,
  });

  if (!page) {
    return <PageNotFound className="min-h-screen" />;
  }

  const { blocks } = page;

  return (
    <>
      {draft && <LivePreviewListener />}
      {/* <RenderHero {...hero} /> */}
      <RenderPageLayout blocks={blocks} />
    </>
  );
}

{
  /* <PageClient />
// Allows redirects for valid pages too
<PayloadRedirects disableNotFound url={url} /> */
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = "home" } = await paramsPromise;
  const locale = await getLocale();
  const page = await queryPageBySlug({
    slug,
    locale,
  });

  return generateMeta({ doc: page });
}

import React, { cache } from "react";
import type { Metadata } from "next";
import { draftMode, headers } from "next/headers";
import payload from "@/lib/payload";
import type { Media, Post } from "@/payload-types";

import PageNotFound from "@/components/PageNotFound";

import { generateMeta } from "@/lib/generateMeta";
import { RenderPageLayout } from "@/blocks/RenderPageLayout";
import { getLocale } from "@/lib/getLocale";

// export async function generateStaticParams() {
//   const posts = await payload.find({
//     collection: "posts",
//     draft: false,
//     limit: 1000,
//     overrideAccess: false,
//     pagination: false,
//     select: {
//       slug: true,
//     },
//   });

//   const params = posts.docs.map(({ slug }) => {
//     return { slug };
//   });

//   return params;
// }

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = "" } = await paramsPromise;
  const post = await queryPostBySlug({ slug });

  if (!post) {
    return <PageNotFound className="min-h-screen" />;
  }
  return (
    <RenderPageLayout
      blocks={[
        {
          id: "header",
          blockType: "imageHeader",
          blockName: "Header",
          title: post.title,
          image: post.banner as Media,
        },
        {
          id: "content",
          blockType: "blockGroup",
          blockName: "Content",
          maxWidth: "container",
          paddingTop: "pt-24",
          paddingBottom: "pb-24",
          blocks: [
            {
              id: "contentText",
              blockType: "richText",
              blockName: "Content",
              content: post.content,
            },
          ],
        },
      ]}
    />
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
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

import { cache } from "react";
import { draftMode } from "next/headers";

import payload from "@/lib/payload";
import type { Locale } from "@/lib/locale";

export const queryPageBySlug = cache(
  async ({ slug, locale }: { slug: string; locale: Locale }) => {
    const { isEnabled: draft } = await draftMode();

    const result = await payload.find({
      collection: "pages",
      locale: locale,
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    return result.docs?.[0] || null;
  }
);

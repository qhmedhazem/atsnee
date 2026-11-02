import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTag } from "next/cache";

// Pages render dynamically per request; only the cached sitemap needs a refresh.
export const revalidatePage: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTag("pages-sitemap", "max");
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTag("pages-sitemap", "max");
  return doc;
};

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidateTag } from "next/cache";

// Posts render dynamically per request; only the cached sitemap needs a refresh.
export const revalidatePost: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTag("posts-sitemap", "max");
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidateTag("posts-sitemap", "max");
  return doc;
};

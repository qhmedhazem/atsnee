import type { Media } from "@/payload-types";
import { generateMeta } from "./generateMeta";

// Metadata for the page globals, from their hero (title, description, image).
export const heroMeta = (hero?: { title?: string | null; description?: string | null; image?: string | Media | null }) =>
  generateMeta({ doc: { meta: { title: hero?.title, description: hero?.description, image: hero?.image } } as never });

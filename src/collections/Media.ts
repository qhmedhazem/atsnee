import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { read, create, del, update } from "./defaultAccess";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// effort 6 = slower encode, ~13% smaller files at the same quality (measured on the site's photos).
const webp = { format: "webp", options: { quality: 80, effort: 6 } } as const;

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: create,
    // Staging shares the production R2 bucket; deleting there would delete live files.
    delete: process.env.PROTECT_SHARED_MEDIA === "1" ? () => false : del,
    read: read,
    update: update,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      //required: true,
    },
    {
      name: "caption",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
  ],
  hooks: {
    // Payload builds thumbnailURL from its own /api/media/file proxy, which R2 (direct URLs) doesn't serve.
    afterRead: [({ doc }) => ({ ...doc, thumbnailURL: doc.sizes?.thumbnail?.url || doc.url })],
  },
  upload: {
    adminThumbnail: "thumbnail",
    focalPoint: true,
    // Store everything as WebP and cap the original so storage stays small.
    resizeOptions: { width: 1920, withoutEnlargement: true },
    formatOptions: webp,
    // Only the sizes the site renders (og, square, fourThree) plus the admin thumbnail.
    imageSizes: [
      { name: "thumbnail", width: 300, formatOptions: webp },
      { name: "square", width: 300, height: 300, formatOptions: webp },
      {
        name: "og",
        width: 1200,
        height: 630,
        crop: "center",
        fit: "cover",
        withoutEnlargement: false,
        formatOptions: webp,
      },
      {
        name: "fourThree",
        width: 1200,
        height: 900,
        crop: "center",
        fit: "cover",
        withoutEnlargement: false,
        formatOptions: webp,
      },
    ],
  },
};

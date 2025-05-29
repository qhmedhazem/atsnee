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

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: create,
    delete: del,
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
  upload: {
    // staticDir: "media",
    adapter: "vercelBlobStorage",
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
      },
      {
        name: "square",
        width: 300,
        height: 300,
      },
      {
        name: "small",
        width: 600,
      },
      {
        name: "medium",
        width: 900,
      },
      {
        name: "large",
        width: 1400,
      },
      {
        name: "xlarge",
        width: 1920,
      },
      {
        name: "og",
        width: 1200,
        height: 630,
        crop: "center",
        fit: "cover",
        withoutEnlargement: false,
      },
      {
        name: "infoSection",
        width: 1200,
        height: 900,
        crop: "center",
        fit: "cover",
        withoutEnlargement: false,
      },
      {
        name: "fourThree",
        width: 1200,
        height: 900,
        crop: "center",
        fit: "cover",
        withoutEnlargement: false,
      },
    ],
  },
};

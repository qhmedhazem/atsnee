import type { CollectionConfig } from "payload";
import { create, del, read, update } from "./access";
import { generatePreviewPath } from "@/lib/utils";
import { slugField } from "@/components/Fields/slug";

// import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";

import blockGroupConfig from "@/blocks/BlockGroup/config";
import carouselHeaderConfig from "@/blocks/CarouselHeader/config";
import imageHeaderConfig from "@/blocks/ImageHeader/config";
import cardsSectionConfig from "@/blocks/CardsSection/config";
import { Icon } from "lucide-react";
import newsLetterConfig from "@/blocks/NewsLetter/config";
import scrollingSectionBlock from "@/blocks/ScrollingSection/config";

export const Pages: CollectionConfig<"pages"> = {
  slug: "pages",
  access: {
    create: create,
    delete: del,
    read: read,
    update: update,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "pages",
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === "string" ? data.slug : "",
        collection: "pages",
        req,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          fields: [
            {
              name: "blocks",
              type: "blocks",
              blocks: [
                carouselHeaderConfig,
                imageHeaderConfig,
                blockGroupConfig,
                cardsSectionConfig,
                scrollingSectionBlock,
                newsLetterConfig,
              ],
            },
          ],
          label: "Content",
        },
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              overrides: {
                localized: true,
              },
            }),
            MetaImageField({
              relationTo: "media",
              overrides: {
                localized: false,
              },
            }),

            MetaDescriptionField({
              overrides: {
                localized: true,
              },
            }),
            PreviewField({
              // field paths to match the target field for data
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
      },
    },
    ...slugField(),
  ],
  hooks: {
    // afterChange: [revalidatePage],
    // beforeChange: [populatePublishedAt],
    // beforeDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
};

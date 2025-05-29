import type { CollectionConfig } from "payload";
// import { revalidateDelete, revalidatePost } from "./hooks/revalidatePost";

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { create, del, read, update } from "./access";
import { slugField } from "@/components/Fields/slug";

import { Banner } from "@/components/Fields/Banner/config";
import { Code } from "@/components/Fields/Code/config";
import { MediaBlock } from "@/components/Fields/MediaBlock/config";
import { generatePreviewPath } from "@/lib/utils";

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";

export const Posts: CollectionConfig<"posts"> = {
  slug: "posts",
  access: {
    create: create,
    delete: del,
    read: read,
    update: update,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    category: true,
    banner: true,
    publishedAt: true,
    brief: true,

    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ["title", "slug", "updatedAt"],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === "string" ? data.slug : "",
          collection: "posts",
          req,
        });

        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === "string" ? data.slug : "",
        collection: "posts",
        req,
      }),
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "category",
      type: "relationship",
      admin: {
        position: "sidebar",
      },
      relationTo: "categories",
      required: true,
    },
    {
      name: "brief",
      type: "textarea",
      maxLength: 300,
      required: false,
      localized: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          fields: [
            {
              name: "banner",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "content",
              type: "richText",
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({
                      enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                    }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ];
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: "Content",
        },
        {
          fields: [
            {
              name: "relatedPosts",
              type: "relationship",
              admin: {
                position: "sidebar",
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                };
              },
              hasMany: true,
              relationTo: "posts",
            },
          ],
          label: "Meta",
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
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),

            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,

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
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    ...slugField(),
  ],
  // hooks: {
  //   afterChange: [revalidatePost],
  //   afterDelete: [revalidateDelete],
  // },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
};

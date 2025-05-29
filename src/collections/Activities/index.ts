import type { CollectionConfig } from "payload";

export const Activities: CollectionConfig = {
  slug: "activities",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: false,
      localized: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Competition", value: "competitions" },
        { label: "Program", value: "programs" },
        { label: "Club", value: "clubs" },
      ],
      defaultValue: "competition",
    },
    {
      name: "teams",
      type: "array",
      fields: [
        {
          name: "teamName",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "members",
          type: "array",
          fields: [
            {
              name: "memberName",
              type: "text",
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};

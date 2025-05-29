import { Block } from "payload";
import { sizes } from "../sizes";

const scrollingSectionBlock: Block = {
  slug: "scrollingSection",
  labels: {
    singular: "Scrolling Section",
    plural: "Scrolling Sections",
  },
  interfaceName: "scrollingSection",
  fields: [
    {
      name: "gap",
      label: "Gap",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (gap-${size})`,
          value: `gap-${size}`,
        })),
      ],
      required: false,
      admin: {
        description: "Space between child blocks (Tailwind gap classes)",
      },
    },
    {
      name: "paddingTop",
      label: "Padding Top",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (pt-${size})`,
          value: `pt-${size}`,
        })),
      ],
      required: false,
      admin: {
        description: "Top padding (Tailwind pt-* classes)",
      },
    },
    {
      name: "paddingBottom",
      label: "Padding Bottom",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (pb-${size})`,
          value: `pb-${size}`,
        })),
      ],
      required: false,
      admin: {
        description: "Bottom padding (Tailwind pb-* classes)",
      },
    },
    {
      name: "paddingX",
      label: "Horizontal Padding",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (px-${size})`,
          value: `px-${size}`,
        })),
      ],
      defaultValue: "None",
    },
    {
      name: "maxWidth",
      label: "Max Width",
      type: "select",
      options: [
        { label: "Full Width", value: "w-full" },
        { label: "Container", value: "container" },
        ...sizes.map((size) => ({
          label: `${size} (max-w-${size})`,
          value: `max-w-${size}`,
        })),
      ],
      defaultValue: "w-full",
    },
    {
      name: "items",
      type: "array",
      label: "Items",
      fields: [
        {
          name: "subtitle",
          type: "text",
          label: "Subtitle",
          required: false,
          localized: true,
        },
        {
          name: "title",
          type: "text",
          label: "Title",
          required: true,
          localized: true,
        },
        {
          name: "content",
          type: "richText",
          required: true,
          localized: true,
        },
        {
          name: "image",
          type: "upload",
          label: "Image",
          relationTo: "media",
          required: false,
        },
        {
          name: "reverse",
          type: "checkbox",
          label: "Reverse Layout",
          required: false,
        },
      ],
    },
  ],
};

export default scrollingSectionBlock;

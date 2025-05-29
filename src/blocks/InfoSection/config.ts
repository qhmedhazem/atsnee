import { Block } from "payload";

const infoSectionConfig: Block = {
  slug: "infoSection",
  labels: {
    singular: "Info Section",
    plural: "Info Sections",
  },
  interfaceName: "infoSection",
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
    {
      name: "stats",
      type: "array",
      label: "Statistics",
      fields: [
        {
          name: "label",
          type: "text",
          label: "Label",
          required: true,
          localized: true,
        },
        {
          name: "value",
          type: "text",
          label: "Value",
          required: true,
          localized: true,
        },
      ],
    },
  ],
};

export default infoSectionConfig;

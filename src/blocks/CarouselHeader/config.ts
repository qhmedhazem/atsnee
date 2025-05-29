import { Block } from "payload";

const carouselHeaderConfig: Block = {
  slug: "carouselHeader",
  labels: {
    singular: "Carousel Header",
    plural: "Carousel Headerss",
  },
  interfaceName: "CarouselHeader",
  fields: [
    {
      name: "items",
      type: "array",
      label: "Carousel Items",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Title",
          required: true,
          localized: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          required: false,
          localized: true,
        },
        {
          name: "cta",
          type: "group",
          label: "Call To Action",
          fields: [
            {
              name: "label",
              type: "text",
              label: "Button Label",
              required: false,
              localized: true,
            },
            {
              name: "url",
              type: "text",
              label: "Button URL",
              required: false,
            },
            {
              name: "newTab",
              type: "checkbox",
              label: "Open in new tab",
              defaultValue: false,
              required: false,
            },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Image",
          admin: {
            description: "Image for the carousel item",
          },
        },
      ],
      minRows: 1,
      maxRows: 10,
      required: true,
      admin: {
        description: "Add images and captions for the carousel",
      },
    },
    {
      name: "autoplay",
      type: "checkbox",
      label: "Autoplay",
      defaultValue: true,
    },
    {
      name: "loop",
      type: "checkbox",
      label: "Loop",
      defaultValue: true,
    },
    {
      name: "interval",
      type: "number",
      label: "Autoplay Interval (ms)",
      defaultValue: 10_000,
    },
  ],
};

export default carouselHeaderConfig;

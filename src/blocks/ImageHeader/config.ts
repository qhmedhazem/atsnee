import { Block } from "payload";

const imageHeaderConfig: Block = {
  slug: "imageHeader",
  interfaceName: "ImageHeader",
  labels: {
    singular: "Image Header",
    plural: "Image Headers",
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "The image to display in the header.",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "The title of the header.",
      },
    },
    {
      name: "size",
      type: "select",
      defaultValue: "default",
      options: [
        { label: "Default (500px)", value: "default" },
        { label: "Compact (300px, 240px on mobile)", value: "compact" },
      ],
      admin: { description: "Compact suits list pages like News." },
    },
    {
      name: "description",
      type: "textarea",
      required: false,
      localized: true,
      admin: {
        description: "A brief description for the header.",
      },
    },
  ],
};

export default imageHeaderConfig;

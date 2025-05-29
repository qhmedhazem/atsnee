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

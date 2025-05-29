import { Block } from "payload";

const richTextConfig: Block = {
  slug: "richText",
  interfaceName: "RichText",
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
};

export default richTextConfig;

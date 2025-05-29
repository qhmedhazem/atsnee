import { Block } from "payload";

const Youtube: Block = {
  slug: "youtube",
  imageURL: "https://logo.clearbit.com/youtube.com",

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "link",
      type: "text",
      required: true,
    },
  ],
};

export default Youtube;

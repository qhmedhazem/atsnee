import { Block } from "payload";

const Instagram: Block = {
  slug: "instagram",
  imageURL: "https://logo.clearbit.com/instagram.com",

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

export default Instagram;

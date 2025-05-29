import { Block } from "payload";

const X: Block = {
  slug: "x",
  imageURL: "https://logo.clearbit.com/twitter.com",

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

export default X;

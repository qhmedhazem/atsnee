import { Block } from "payload";

const Facebook: Block = {
  slug: "facebook",
  imageURL: "https://logo.clearbit.com/facebook.com",

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

export default Facebook;

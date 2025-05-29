import { Block } from "payload";

const Linkedin: Block = {
  slug: "linkedin",
  imageURL: "https://logo.clearbit.com/linkedin.com",

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

export default Linkedin;

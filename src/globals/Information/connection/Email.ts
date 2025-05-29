import { Block } from "payload";

const Email: Block = {
  slug: "email",
  imageURL: "https://logo.clearbit.com/mail.com",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
  ],
};

export default Email;

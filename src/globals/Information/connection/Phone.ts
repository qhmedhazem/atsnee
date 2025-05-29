import { Block } from "payload";

const Phone: Block = {
  slug: "phone",
  imageURL: "https://logo.clearbit.com/dialup.com",

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "phoneNumber",
      type: "text",
      required: true,
    },
  ],
};

export default Phone;

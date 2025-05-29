import { Block } from "payload";

const Whatsapp: Block = {
  slug: "whatsapp",
  imageURL: "https://logo.clearbit.com/whatsapp.com",

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

export default Whatsapp;

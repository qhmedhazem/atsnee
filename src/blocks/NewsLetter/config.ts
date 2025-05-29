import { Block } from "payload";

const newsLetterConfig: Block = {
  slug: "newsLetter",
  interfaceName: "NewsLetter",
  fields: [
    {
      type: "text",
      name: "title",
      localized: true,
      required: false,
      defaultValue: "Get Newsletter delivered straight to your inbox.",
    },
    {
      type: "text",
      name: "emailPrompt",
      localized: true,
      required: false,
      defaultValue: "Enter you email address",
    },
    {
      type: "text",
      name: "ctaLabel",
      localized: true,
      required: false,
      defaultValue: "Subscribe",
    },
    {
      type: "text",
      name: "ctaLabelDone",
      localized: true,
      required: false,
      defaultValue: "Subscribed",
    },
  ],
};

export default newsLetterConfig;

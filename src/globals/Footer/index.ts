import { GlobalConfig } from "payload";

const Footer: GlobalConfig = {
  slug: "footer",
  fields: [
    {
      name: "newsletter",
      label: "Newsletter band (above the footer, every page)",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "text", type: "text", localized: true },
        { name: "emailPrompt", label: "Email placeholder", type: "text", localized: true },
        { name: "ctaLabel", label: "Button label", type: "text", localized: true },
      ],
    },
    {
      name: "sitemapTitle",
      label: "Sitemap Title",
      type: "text",
      defaultValue: "Site Map",
      localized: true,
    },
    {
      name: "sitemap",
      label: "Sitemap",
      type: "array",
      fields: [
        {
          name: "label",
          label: "Label",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "link",
          label: "Link",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "copyrightPrimary",
      label: "Copyright Primary",
      type: "richText",
      admin: { description: "Leave empty to show \"© <current year> <short name>. All rights reserved.\"" },
      // required: true,
      localized: true,
    },
    {
      name: "copyrightSecondary",
      label: "Copyright Secondary",
      type: "richText",
      localized: true,
    },
  ],
};

export default Footer;

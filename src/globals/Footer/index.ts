import { GlobalConfig } from "payload";

const Footer: GlobalConfig = {
  slug: "footer",
  fields: [
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

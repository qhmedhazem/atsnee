import { Block } from "payload";

import { sizes } from "../sizes";

import infoSectionConfig from "../InfoSection/config";
import announcementListConfig from "../AnnouncementList/config";
import richTextConfig from "../RichText/config";
import logoListConfig from "../LogosList/config";
import tabsConfig from "../Tabs/config";

const blockGroupConfig: Block = {
  slug: "blockGroup",
  interfaceName: "BlockGroup",
  labels: {
    singular: "Block Group",
    plural: "Block Groups",
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: false,
      localized: true,
      admin: {
        description: "Optional title for this block group",
      },
    },
    {
      name: "gap",
      label: "Gap",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (gap-${size})`,
          value: `gap-${size}`,
        })),
      ],
      required: false,
      admin: {
        description: "Space between child blocks (Tailwind gap classes)",
      },
    },
    {
      name: "paddingTop",
      label: "Padding Top",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (pt-${size})`,
          value: `pt-${size}`,
        })),
      ],
      required: false,
      admin: {
        description: "Top padding (Tailwind pt-* classes)",
      },
    },
    {
      name: "paddingBottom",
      label: "Padding Bottom",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (pb-${size})`,
          value: `pb-${size}`,
        })),
      ],
      required: false,
      admin: {
        description: "Bottom padding (Tailwind pb-* classes)",
      },
    },
    {
      name: "paddingX",
      label: "Horizontal Padding",
      type: "select",
      options: [
        { label: "None", value: "" },
        ...sizes.map((size) => ({
          label: `${size} (px-${size})`,
          value: `px-${size}`,
        })),
      ],
      defaultValue: "None",
    },
    {
      name: "maxWidth",
      label: "Max Width",
      type: "select",
      options: [
        { label: "Full Width", value: "w-full" },
        { label: "Container", value: "container" },
        ...sizes.map((size) => ({
          label: `${size} (max-w-${size})`,
          value: `max-w-${size}`,
        })),
      ],
      defaultValue: "w-full",
    },
    {
      name: "blocks",
      label: "Blocks",
      type: "blocks",
      blocks: [
        infoSectionConfig,
        announcementListConfig,
        richTextConfig,
        logoListConfig,
        tabsConfig,
      ],
      required: false,
    },
  ],
};

export default blockGroupConfig;

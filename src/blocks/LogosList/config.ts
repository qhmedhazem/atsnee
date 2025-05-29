import { Block } from "payload";

import { sizes } from "../sizes";

const logoListConfig: Block = {
  slug: "logoList",
  interfaceName: "LogoList",
  labels: {
    singular: "Logos List",
    plural: "Logos Lists",
  },
  fields: [
    {
      name: "size",
      label: "Size (px)",
      type: "number",
      defaultValue: 256,
      required: true,
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
      required: true,
      defaultValue: "gap-8",
      admin: {
        description: "Space between child blocks (Tailwind gap classes)",
      },
    },
    {
      name: "logos",
      type: "array",
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};

export default logoListConfig;

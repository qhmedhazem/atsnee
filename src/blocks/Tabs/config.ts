import { Block } from "payload";

const tabsConfig: Block = {
  slug: "tabs",
  interfaceName: "Tabs",
  labels: {
    singular: "Tab",
    plural: "Tabs",
  },
  fields: [
    {
      name: "tabs",
      type: "array",
      minRows: 1,
      maxRows: 8,
      required: true,
      fields: [
        {
          name: "label",
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
    },
  ],
};

export default tabsConfig;

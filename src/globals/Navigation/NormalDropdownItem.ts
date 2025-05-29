import type { Block } from "payload";

const NormalDropdownItem: Block = {
  slug: "normalDropdownItem",

  labels: {
    singular: "Normal Dropdown Item",
    plural: "Normal Dropdown Items",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "text",
      required: false,
      localized: true,
    },
    {
      name: "link",
      type: "text",
      required: true,
    },
  ],
};

export default NormalDropdownItem;

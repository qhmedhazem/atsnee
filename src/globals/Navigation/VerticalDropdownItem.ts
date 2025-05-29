import type { Block } from "payload";

const VerticalDropdownItem: Block = {
  slug: "verticalDropdownItem",
  labels: {
    singular: "Vertical Dropdown Item",
    plural: "Vertical Dropdown Items",
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

    {
      name: "icon",
      type: "upload",
      relationTo: "media",
      required: false,
    },
  ],
};

export default VerticalDropdownItem;

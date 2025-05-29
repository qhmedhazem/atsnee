import { GlobalConfig } from "payload";

import VerticalDropdownItem from "./VerticalDropdownItem";
import NormalDropdownItem from "./NormalDropdownItem";

const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation Bar",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "navLinks",
      type: "array",
      label: "Navigation Links",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          localized: true,
        },
        {
          name: "url",
          type: "text",
        },
        {
          name: "dropdownItems",
          type: "blocks",
          blocks: [NormalDropdownItem, VerticalDropdownItem],
          required: false,
        },
      ],
    },
  ],
};

export default Navigation;

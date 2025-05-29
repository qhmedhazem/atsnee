import { GlobalConfig } from "payload";
import Email from "./connection/Email";
import Facebook from "./connection/Facebook";
import Instagram from "./connection/Instagram";
import Linkedin from "./connection/Linkedin";
import Phone from "./connection/Phone";
import Whatsapp from "./connection/Whatsapp";
import X from "./connection/X";
import Youtube from "./connection/Youtube";

const Information: GlobalConfig = {
  slug: "information",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "name",
      label: "School Name",
      type: "text",
      defaultValue: "Applied Technology School for Nuclear Energy in El-Dabaa",
      required: true,
      localized: true,
    },
    {
      name: "short",
      label: "School Short Name",
      type: "text",
      defaultValue: "ATSNEE",
    },
    {
      name: "description",
      label: "School Description",
      type: "text",
      localized: true,
    },
    {
      name: "keyword",
      label: "Keywords",
      type: "textarea",
      localized: true,
    },
    {
      name: "address",
      type: "group",
      fields: [
        {
          name: "address",
          label: "Address",
          type: "text",
          localized: true,
        },
        {
          name: "link",
          label: "Google Maps Link",
          type: "text",
        },
      ],
    },
    {
      name: "connections",
      label: "Connections",
      type: "blocks",
      minRows: 0,
      blocks: [
        Email,
        Phone,
        Whatsapp,

        Facebook,
        Instagram,
        Youtube,
        Linkedin,
        X,
      ],
    },
  ],
};

export default Information;

import { Block } from "payload";

const announcementListConfig: Block = {
  slug: "announcementList",
  interfaceName: "AnnouncementList",
  fields: [
    {
      name: "displayMode",
      label: "Display Mode",
      type: "select",
      options: [
        { label: "List with Maximum Amount", value: "max" },
        { label: "Full List with Scrolling", value: "scroll" },
      ],
      required: true,
      defaultValue: "max",
    },
    {
      name: "sortBy",
      label: "Sort By",
      type: "select",
      options: [
        { label: "Latest", value: "latest" },
        { label: "Popular", value: "popular" },
      ],
      required: true,
      defaultValue: "latest",
    },
    {
      name: "maxPosts",
      label: "Maximum Amount of Posts",
      type: "number",
      min: 1,
      required: true,
      defaultValue: 10,
      admin: {
        condition: (data, siblingData, { blockData, path, user }) => {
          // console.log(blockData);
          return blockData.displayMode === "max";
        },
      },
    },
  ],
};

export default announcementListConfig;

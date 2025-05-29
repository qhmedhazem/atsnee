import { Block } from "payload";

const activitiesListConfig: Block = {
  slug: "activitiesList",
  interfaceName: "ActivitiesList",
  fields: [
    {
      name: "participations",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "type",
      label: "Activity Type",
      type: "select",
      options: [
        { label: "Competitons", value: "competitions" },
        { label: "Programs", value: "programs" },
        { label: "Clubs", value: "clubs" },
      ],
      hasMany: true,
      required: true,
    },
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
      name: "maxRows",
      label: "Maximum Amount of Rows",
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

export default activitiesListConfig;

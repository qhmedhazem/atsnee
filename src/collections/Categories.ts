import type { CollectionConfig } from "payload";

import { read, create, del, update } from "./defaultAccess";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    create: create,
    delete: del,
    read: read,
    update: update,
  },
  admin: {
    useAsTitle: "title",
    hidden: true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
  ],
};

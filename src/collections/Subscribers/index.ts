import type { CollectionConfig } from "payload";
import { create, del, read, update } from "./access";

export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: create,
    delete: del,
    read: read,
    update: update,
  },
  defaultPopulate: {
    name: true,
    email: true,
    phone: true,
    message: true,
    createdAt: true,
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "createdAt",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      defaultValue: () => new Date(),
    },
  ],
  hooks: {
    // afterChange: [revalidatePage],
    // beforeChange: [populatePublishedAt],
    // beforeDelete: [revalidateDelete],
  },
};

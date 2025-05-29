import type { CollectionConfig } from "payload";
import { create, del, read, update } from "./access";

export const Messages: CollectionConfig = {
  slug: "messages",
  admin: {
    useAsTitle: "message",
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
      name: "replied",
      type: "checkbox",
      required: false,
      defaultValue: false,
    },
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "email",
      type: "email",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "phone",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "message",
      type: "textarea",
      required: true,
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

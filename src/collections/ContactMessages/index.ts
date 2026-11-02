import type { CollectionConfig } from "payload";
import { update as admins } from "../defaultAccess";

// Written only by POST /api/contact (Local API); the public can't read, create, update or delete.
export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  labels: { singular: "Contact message", plural: "Contact messages" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "status", "createdAt"] },
  access: { create: () => false, read: admins, update: admins, delete: admins },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea", required: true },
    { name: "locale", type: "text", admin: { readOnly: true, position: "sidebar" } },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Replied", value: "replied" },
        { label: "Archived", value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};

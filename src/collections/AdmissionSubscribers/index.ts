import type { CollectionConfig } from "payload";
import { update as admins } from "../defaultAccess";

// Public sign-ups go through POST /api/admission/subscribe (Local API), never the REST create.
export const AdmissionSubscribers: CollectionConfig = {
  slug: "admission-subscribers",
  admin: { useAsTitle: "email", defaultColumns: ["email", "locale", "createdAt"] },
  access: { create: admins, read: admins, update: admins, delete: admins },
  fields: [
    { name: "email", type: "email", required: true, unique: true },
    { name: "locale", type: "text" },
  ],
};

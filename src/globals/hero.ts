import type { Field } from "payload";

// The top of a page: background image, title and one line under it (shared by the page globals).
export const heroField: Field = {
  name: "hero",
  type: "group",
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "title", type: "text", required: true, localized: true },
    { name: "description", type: "textarea", localized: true },
  ],
};

export const PAGES_GROUP = "Pages";

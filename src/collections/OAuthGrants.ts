import type { CollectionConfig } from "payload";
import { update as admins } from "./defaultAccess";

// Apps (Claude) an admin connected through OAuth. Written only by /api/oauth/*; deleting a row disconnects the app.
export const OAuthGrants: CollectionConfig = {
  slug: "oauth-grants",
  labels: { singular: "Connected app", plural: "Connected apps" },
  admin: {
    group: "MCP",
    useAsTitle: "clientName",
    defaultColumns: ["clientName", "user", "lastUsedAt", "createdAt"],
    description: "Apps connected to the MCP server with an admin login. Delete one to disconnect it.",
  },
  access: { create: () => false, update: () => false, read: admins, delete: admins },
  fields: [
    { name: "clientName", type: "text", required: true },
    { name: "user", type: "relationship", relationTo: "users", required: true },
    { name: "lastUsedAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "redirectUri", type: "text", admin: { readOnly: true } },
    { name: "clientId", type: "text", hidden: true },
    { name: "codeHash", type: "text", index: true, hidden: true },
    { name: "codeChallenge", type: "text", hidden: true },
    { name: "codeExpiresAt", type: "date", hidden: true },
    { name: "codeUsed", type: "checkbox", hidden: true },
    { name: "accessHash", type: "text", index: true, hidden: true },
    { name: "accessExpiresAt", type: "date", hidden: true },
    { name: "refreshHash", type: "text", index: true, hidden: true },
    { name: "prevRefreshHash", type: "text", index: true, hidden: true },
    { name: "refreshExpiresAt", type: "date", hidden: true },
  ],
};

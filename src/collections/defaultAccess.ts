import type { Access, PayloadRequest } from "payload";

// Only a `users` account with the admin permission. MCP keys act as their owning user, so they pass
// when that user is an admin; authenticating as the key document itself never does.
export const isAdmin = (user: PayloadRequest["user"]) =>
  !!user && "permissions" in user && !!user.permissions?.includes("admin");

export const create: Access = ({ req: { user } }) => isAdmin(user);
export const del: Access = ({ req: { user } }) => isAdmin(user);
export const read: Access = () => true;
export const update: Access = ({ req: { user } }) => isAdmin(user);

import type { Access } from "payload";
import { isAdmin } from "../defaultAccess";

export const create: Access = ({ req: { user } }) => isAdmin(user);
export const del: Access = ({ req: { user } }) => isAdmin(user);
export const read: Access = ({ req: { user } }) => isAdmin(user);
export const update: Access = ({ req: { user } }) => isAdmin(user);

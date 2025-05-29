import type { Access } from "payload";

export const create: Access = ({ req: { user } }) => {
  return user?.permissions?.includes("admin") || false;
};
export const del: Access = ({ req: { user } }) => {
  return user?.permissions?.includes("admin") || false;
};
export const read: Access = ({ req: { user } }) => {
  return true;
};
export const update: Access = ({ req: { user } }) => {
  return user?.permissions?.includes("admin") || false;
};

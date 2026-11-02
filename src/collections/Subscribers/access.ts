import type { Access } from "payload";

export const admin: Access = ({ req: { user } }) => {
  return Boolean(user);
};

export const create: Access = ({ req: { user } }) => {
  return Boolean(user);
};

export const del: Access = ({ req: { user } }) => {
  return Boolean(user);
};

export const read: Access = ({ req: { user } }) => {
  return Boolean(user);
};

export const update: Access = ({ req: { user } }) => {
  return Boolean(user);
};

import type { CollectionConfig } from "payload";

import { create, del, read, update } from "./access";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    create: create,
    delete: del,
    read: read,
    update: update,
  },
  admin: {
    defaultColumns: ["name", "email"],
    useAsTitle: "username",
  },
  auth: true,
  fields: [
    {
      name: "username",
      type: "text",
      minLength: 2,
      maxLength: 32,
      unique: true,
      required: true,
      validate: (val: string | string[] | null | undefined) => {
        if (typeof val === "string" && /^[a-zA-Z0-9._]+$/.test(val)) {
          return true;
        }
        return "Username is not valid";
      },
    },
    {
      name: "email",
      type: "email",
      unique: true,
      required: true,
      validate: (val: string | string[] | null | undefined) => {
        if (
          typeof val === "string" &&
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)
        ) {
          return true;
        }
        return "Email is not valid";
      },
    },
    {
      name: "permissions",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Content Writer", value: "writer" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" },
      ],
      hasMany: true,
    },

    // {
    //   name: "permissions",
    //   type: "select",
    //   options: [
    //     { label: "Admin", value: "admin" },
    //     { label: "Manage Users", value: "manage_users" },
    //     { label: "Manage Pages", value: "manage_pages" },
    //     { label: "Manage Projects", value: "manage_projects" },
    //     { label: "Content Writer", value: "content_writer" },
    //   ],
    //   required: true,
    //   hooks: {
    //     beforeChange: [
    //       ({ data }) => {
    //         if (data?.permissions.includes("all")) {
    //           data.permissions = [
    //             "all",
    //             "manage_users",
    //             "manage_pages",
    //             "manage_projects",
    //             "content_writer",
    //           ];
    //         }
    //         return data;
    //       },
    //     ],
    //   },
    // },
  ],
  timestamps: true,
};

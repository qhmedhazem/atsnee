import { Field } from "payload";

export const lucideIconPicker: Field = {
  name: "icon",
  label: "Icon",
  type: "text",
  validate: (value) => {
    if (!value) {
      return "Please select an icon";
    }
    return true;
  },
  admin: {
    components: {
      Field: "@/fields/LucideIconPicker#Select",
    },
  },
  required: true,
  hasMany: false,
  localized: false,
};

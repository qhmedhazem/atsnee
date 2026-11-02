import type { GlobalConfig } from "payload";
import { update as admins } from "@/collections/defaultAccess";
import { heroField, PAGES_GROUP } from "../hero";

const Admission: GlobalConfig = {
  slug: "admission",
  label: "Admission page",
  admin: { group: PAGES_GROUP },
  access: { read: () => true, update: admins },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Status & dates",
          fields: [
            {
              name: "status",
              type: "select",
              required: true,
              defaultValue: "auto",
              options: [
                {
                  label: "Automatic (open between the dates below)",
                  value: "auto",
                },
                { label: "Open", value: "open" },
                { label: "Closed", value: "closed" },
              ],
            },
            {
              name: "academicYear",
              type: "text",
              admin: { placeholder: "2026/2027" },
            },
            {
              name: "applyUrl",
              label: "Apply URL (Ministry of Education)",
              type: "text",
              validate: (
                value: string | null | undefined,
                { siblingData }: { siblingData: { status?: string } },
              ) => {
                if (!value)
                  return siblingData?.status === "closed"
                    ? true
                    : "Required unless admission is closed.";
                return (
                  /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(value) ||
                  "Must be an https:// URL."
                );
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "opensAt",
                  type: "date",
                  admin: { date: { pickerAppearance: "dayOnly" } },
                },
                {
                  name: "closesAt",
                  type: "date",
                  admin: { date: { pickerAppearance: "dayOnly" } },
                },
              ],
            },
            {
              name: "testsNote",
              label: "Admission tests note",
              type: "text",
              localized: true,
              defaultValue: ({ locale }: { locale?: string }) =>
                locale === "ar"
                  ? "انتظر الاستدعاء. تُعلن المواعيد بعد انتهاء التقديم."
                  : "Wait for the call. Dates are announced after applications close.",
            },
          ],
        },
        {
          label: "Page content",
          fields: [
            heroField,
            {
              name: "stages",
              label: "Admission stages",
              type: "array",
              admin: {
                description:
                  "Shown as a timeline under the status card, in this order.",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  localized: true,
                },
                { name: "subtitle", type: "text", localized: true },
                { name: "content", type: "richText", required: true, localized: true },
                { name: "image", type: "upload", relationTo: "media" },
                {
                  name: "reverse",
                  label: "Image on the other side",
                  type: "checkbox",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default Admission;

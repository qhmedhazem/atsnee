import type { Field, GlobalConfig } from "payload";
import { update as admins } from "@/collections/defaultAccess";
import { heroField, PAGES_GROUP } from "../hero";
import { DAYS } from "@/lib/contact";


const PHONE = /^\+?[\d\s-]{6,20}$/;
const phoneField: Field = {
  name: "phone",
  type: "text",
  validate: (v: string | null | undefined) => !v || PHONE.test(v) || "Use digits, spaces, + and - only.",
};
const emailField: Field = { name: "email", type: "email" };
const photoField: Field = { name: "photo", type: "upload", relationTo: "media" };
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeField = (name: "open" | "close"): Field => ({
  name,
  type: "text",
  admin: { placeholder: "08:00", width: "25%" },
  validate: (v: string | null | undefined, { siblingData }: { siblingData: { closed?: boolean } }) =>
    siblingData?.closed ? true : !v ? "Required unless closed." : HHMM.test(v) || "Use HH:mm (24h), e.g. 08:00.",
});
const https = (v: string | null | undefined) => !v || /^https:\/\/\S+$/.test(v) || "Must be an https:// link.";

// /contact: who to contact, working hours, location and FAQ. Messages land in the contact-messages collection.
const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact page",
  admin: { group: PAGES_GROUP },
  access: { read: () => true, update: admins },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "People",
          fields: [
            heroField,
            {
              name: "principal",
              type: "group",
              fields: [
                { name: "name", type: "text", localized: true },
                { name: "title", type: "text", localized: true, admin: { placeholder: "School Principal" } },
                { name: "description", type: "text", localized: true },
                phoneField,
                emailField,
                photoField,
              ],
            },
            {
              name: "counselors",
              type: "array",
              admin: { description: "Counselors follow classes by graduation year. Graduated years hide themselves after July 31." },
              fields: [
                { name: "name", type: "text", required: true, localized: true },
                { name: "title", type: "text", localized: true, admin: { placeholder: "Student Counselor" } },
                {
                  name: "classes",
                  label: "Classes (graduation years)",
                  type: "number",
                  hasMany: true,
                  validate: (v: number[] | null | undefined) =>
                    (v ?? []).every((y) => Number.isInteger(y) && y >= 2000 && y <= 2100) || "Use 4-digit years, e.g. 2027.",
                },
                phoneField,
                emailField,
                photoField,
              ],
            },
          ],
        },
        {
          label: "Hours & location",
          fields: [
            {
              name: "workingHours",
              type: "array",
              minRows: 7,
              maxRows: 7,
              validate: (rows: unknown[] | null | undefined) =>
                new Set((rows ?? []).map((r) => (r as { day?: string }).day)).size === 7 ||
                "List each day once (Sunday to Saturday).",
              defaultValue: DAYS.map((day) =>
                day === "friday" || day === "saturday" ? { day, closed: true } : { day, closed: false, open: "08:00", close: "15:00" },
              ),
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "day", type: "select", required: true, options: DAYS.map((d) => ({ label: d[0].toUpperCase() + d.slice(1), value: d })), admin: { width: "30%" } },
                    { name: "closed", type: "checkbox", admin: { width: "20%" } },
                    timeField("open"),
                    timeField("close"),
                  ],
                },
              ],
            },
            {
              name: "hoursNote",
              type: "text",
              localized: true,
              defaultValue: ({ locale }: { locale?: string }) =>
                locale === "ar"
                  ? "بتوقيت القاهرة. قد تتغير المواعيد في رمضان والإجازات الرسمية."
                  : "Cairo time. Hours may change during Ramadan and official holidays.",
            },
            {
              name: "replyTime",
              type: "text",
              localized: true,
              defaultValue: ({ locale }: { locale?: string }) =>
                locale === "ar" ? "نرد خلال يومي عمل" : "We reply within 2 working days",
            },
            { name: "address", type: "text", localized: true },
            { name: "mapsUrl", label: "Google Maps link", type: "text", validate: https },
            {
              name: "mapEmbedUrl",
              label: "Google Maps embed URL",
              type: "text",
              admin: { description: "From Google Maps: Share, Embed a map, copy the src of the iframe." },
              validate: (v: string | null | undefined) =>
                !v || /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(v) || "Must be a https://www.google.com/maps embed link.",
            },
          ],
        },
        {
          label: "FAQ",
          fields: [
            {
              name: "faq",
              type: "array",
              fields: [
                { name: "question", type: "text", required: true, localized: true },
                { name: "answer", type: "richText", required: true, localized: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default ContactPage;

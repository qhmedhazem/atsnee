import type { GlobalConfig } from "payload";
import { update as admins } from "@/collections/defaultAccess";
import { heroField, PAGES_GROUP } from "../hero";

// /announcements: the list itself comes from the Posts collection.
const NewsPage: GlobalConfig = {
  slug: "news-page",
  label: "News page",
  admin: { group: PAGES_GROUP },
  access: { read: () => true, update: admins },
  fields: [heroField],
};

export default NewsPage;

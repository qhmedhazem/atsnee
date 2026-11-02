import type { GlobalConfig } from "payload";
import { update as admins } from "@/collections/defaultAccess";
import { heroField, PAGES_GROUP } from "../hero";

// /activities/<type>: the cards come from the Activities collection.
const ActivitiesPage: GlobalConfig = {
  slug: "activities-page",
  label: "Activities page",
  admin: { group: PAGES_GROUP },
  access: { read: () => true, update: admins },
  fields: [heroField],
};

export default ActivitiesPage;

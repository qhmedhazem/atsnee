import React from "react";
import payload from "@/lib/payload";
import type { Activity } from "@/payload-types";

import { getLocale } from "@/lib/getLocale";
import ActivitiesSection from "./ActivitiesSection";

// Tab order on /activities/<type>. /activities redirects to the default tab (next.config.js).
export const ACTIVITY_TYPES = ["programs", "competitions", "clubs"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export const DEFAULT_ACTIVITY_TYPE: ActivityType = "competitions";

// Only what the client needs; unresolved image IDs are dropped here.
const toItem = (a: Activity) => ({
  id: a.id,
  name: a.name,
  description: a.description ?? "",
  date: a.date,
  type: (a.type ?? DEFAULT_ACTIVITY_TYPE) as ActivityType,
  teams: (a.teams ?? []).map((team) => ({
    name: team.teamName ?? "",
    members: (team.members ?? []).map((m) => m.memberName ?? "").filter(Boolean),
  })),
  images: (a.gallery ?? []).flatMap(({ image }) =>
    typeof image === "object" && image?.url
      ? [{
          url: image.url,
          cover: image.sizes?.fourThree?.url || image.url,
          thumb: image.sizes?.thumbnail?.url || image.url,
          alt: image.alt ?? "",
        }]
      : []
  ),
});
export type ActivityItem = ReturnType<typeof toItem>;

// Rendered by /activities/[type] (hero from the activities-page global).
interface Props {
  type: ActivityType[];
  activeType?: ActivityType;
}

const ActivitiesList: React.FC<Props> = async ({ type: types, activeType }) => {
  const locale = await getLocale();

  // Every type the block shows, so each tab can display its count.
  const { docs } = await payload.find({
    collection: "activities",
    where: { type: { in: types } },
    sort: "-date",
    depth: 1,
    pagination: false,
    locale,
  });

  return (
    <ActivitiesSection
      activities={docs.map(toItem)}
      types={ACTIVITY_TYPES.filter((type) => types.includes(type))}
      activeType={activeType ?? DEFAULT_ACTIVITY_TYPE}
    />
  );
};

export default ActivitiesList;

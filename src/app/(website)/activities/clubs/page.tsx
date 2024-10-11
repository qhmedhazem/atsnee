import type { Metadata } from "next";
import ActivitiesSection from "@/features/activities/components/ActivitiesSection";
import { fetchClubs } from "@/features/activities/services/activityService";

export const metadata: Metadata = {
  title: "Clubs | Applied Technology School for Nuclear Energy",
};

export default async function ClubsLayout() {
  const activities = await fetchClubs();

  return <ActivitiesSection activities={activities} />;
}

export const revalidate = 180;

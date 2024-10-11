import type { Metadata } from "next";
import ActivitiesSection from "@/features/activities/components/ActivitiesSection";
import { fetchCompetitionsParticipations } from "@/features/activities/services/activityService";

export const metadata: Metadata = {
  title: "Competitions | Applied Technology School for Nuclear Energy",
};

export default async function Activities() {
  const activities = await fetchCompetitionsParticipations();

  return <ActivitiesSection activities={activities} />;
}

export const revalidate = 180;

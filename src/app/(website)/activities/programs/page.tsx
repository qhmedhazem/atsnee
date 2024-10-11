import type { Metadata } from "next";
import ActivitiesSection from "@/features/activities/components/ActivitiesSection";
import { fetchProgramsParticipations } from "@/features/activities/services/activityService";

export const metadata: Metadata = {
  title: "Programs | Applied Technology School for Nuclear Energy",
};

export default async function ProgramsLayout() {
  const activities = await fetchProgramsParticipations();

  return <ActivitiesSection activities={activities} />;
}

export const revalidate = 180;

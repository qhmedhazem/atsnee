import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import ActivitiesSection from "@/features/activities/components/ActivitiesSection";
import { fetchAllActivities } from "@/features/activities/services/activityService";
import { ReactNode } from "react";
import Tabs, { Tab } from "@/components/Tabs";
import Link from "@/components/ui/Link";

export const metadata: Metadata = {
  title: "Activities | Applied Technology School for Nuclear Energy",
};

export default async function Activities({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageLayout
      imageSrc="/landing2.jpg"
      imageAlt="Advanced Technology School For Nuclear Energy Campus"
      title="Activities"
      description="Competitions, Programs, Honours, etc."
      className="space-y-12"
    >
      <Tabs>
        <Tab href="/activities/competitions">Competitions</Tab>
        <Tab href="/activities/programs">Programs</Tab>
        <Tab href="/activities/clubs">Clubs</Tab>
      </Tabs>

      {children}
    </PageLayout>
  );
}

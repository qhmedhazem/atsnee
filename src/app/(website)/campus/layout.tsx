import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import ActivitiesSection from "@/features/activities/components/ActivitiesSection";
import { fetchAllActivities } from "@/features/activities/services/activityService";
import { ReactNode } from "react";
import Tabs, { Tab } from "@/components/Tabs";
import Link from "@/components/ui/Link";

export const metadata: Metadata = {
  title: "Campus | Applied Technology School for Nuclear Energy",
};

export default async function CampusLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageLayout
      imageSrc="/landing5.jpg"
      imageAlt="Advanced Technology School For Nuclear Energy Campus"
      title="Campus"
      description="A Hub of Growth, Knowledge, and Community!"
      className="space-y-12"
    >
      <Tabs>
        <Tab href="/campus/academics">Academics</Tab>
        <Tab href="/campus/life">Life</Tab>
      </Tabs>

      {children}
    </PageLayout>
  );
}

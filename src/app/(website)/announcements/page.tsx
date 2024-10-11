import type { Metadata } from "next";
import AnnouncementsSection from "@/features/announcements/components/AnnouncementsSection";
import EventsSection from "@/features/events/components/EventsSection";

import { PageLayout } from "@/components/PageLayout";
import { Annoncement, Event } from "@prisma/client";
import { previewAnnouncements } from "@/features/announcements/services/announcementsService";
import { previewEvents } from "@/features/events/services/eventsService";

export const metadata: Metadata = {
  title: "Announcements | Applied Technology School for Nuclear Energy",
};

export default async function Announcements() {
  const [announcements, events]: [Annoncement[], Event[]] = await Promise.all([
    previewAnnouncements(),
    previewEvents(),
  ]);

  return (
    <PageLayout
      imageSrc="/landing2.jpg"
      imageAlt="Advanced Technology School For Nuclear Energy Campus"
      title="Announecments"
      description="Stay updated with school admistration announcements."
    >
      <h2 className="text-3xl">Announcements</h2>
      <div className="mt-12 gap-4 lg:gap-2 xl:gap-4 flex flex-col-reverse w-full lg:flex-row lg:justify-between">
        {/* Two Grids */}
        <AnnouncementsSection announcements={announcements} />
        <EventsSection events={events} />
      </div>
    </PageLayout>
  );
}

export const revalidate = 180;

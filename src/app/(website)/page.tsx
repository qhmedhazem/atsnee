import AboutSection from "@/features/website/components/Landing/AboutSection";
import HeroSection from "@/features/website/components/Landing/HeroSection";
import SchoolNewsSection from "@/features/website/components/Landing/SchoolNewsSection";

import { previewAnnouncements } from "@/features/announcements/services/announcementsService";
import { previewEvents } from "@/features/events/services/eventsService";
import { Annoncement, Event } from "@prisma/client";
import UpcomingEventsSection from "@/features/website/components/Landing/UpcomingEventsSection";
import NewsLetterSection from "@/features/website/components/Landing/newsletter/NewsLetterSection";
import AcademicsSection from "@/features/website/components/Landing/AcademicsSection";
import AcademicsCurriculumSection from "@/features/website/components/Academics/AcademicsCurriculumSection";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home | Applied Technology School for Nuclear Energy",
};

export default async function Home() {
  const [announcements, events]: [Annoncement[], Event[]] = await Promise.all([
    previewAnnouncements(3),
    previewEvents(3),
  ]);

  return (
    <main className="justify-center flex flex-col gap-28">
      <HeroSection />
      <div className="w-full container flex flex-col gap-28">
        <AboutSection />
        <AcademicsSection />
      </div>

      {announcements.length > 0 && (
        <SchoolNewsSection
          className="container"
          announcements={announcements}
        />
      )}
      <AcademicsCurriculumSection />
      {/* <AdmissionSection /> */}
      <div className="container flex flex-col gap-20">
        {events.length > 0 && <UpcomingEventsSection events={events} />}
      </div>
      <NewsLetterSection />
    </main>
  );
}

export const revalidate = 180;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/PageLayout";
import AnnouncementContent from "@/features/announcements/components/Announcements/AnnouncementContent";
import { fetchAnnouncementById } from "@/features/announcements/services/announcementsService";
import { getRelativeTime } from "@/lib/utils";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const announcement = await fetchAnnouncementById(id);

  if (!announcement) return {};

  return {
    title: announcement.title + " | ATSNEE",
    description: announcement.content,
  };
}

export default async function Announcements({ params: { id } }: Props) {
  const announcement = await fetchAnnouncementById(id);
  if (announcement == null) return notFound();

  return (
    <PageLayout
      imageSrc={announcement.imageURL || "/landing2.jpg"}
      imageAlt={announcement.title}
      title={announcement.title}
      description={getRelativeTime(announcement.createdAt)}
    >
      {/* Here Markdown */}
      <AnnouncementContent content={announcement.content} />
    </PageLayout>
  );
}

export const revalidate = 180;

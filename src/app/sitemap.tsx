import { MetadataRoute } from "next";
import {
  fetchTheLastAnnouncementUpdate,
  fetchTheLast50AnnouncementsIds,
} from "@/features/announcements/services/announcementsService";
import { fetchTheLastEventUpdate } from "@/features/events/services/eventsService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [lastAnnouncements, lastAnnouncementUpdate, lastEventUpdate] =
    await Promise.all([
      fetchTheLast50AnnouncementsIds(),
      fetchTheLastAnnouncementUpdate(),
      fetchTheLastEventUpdate(),
    ]);

  return [
    {
      url: "https://atsnee.org",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://atsnee.org/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://atsnee.org/admission",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://atsnee.org/academics",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://atsnee.org/nuclearpowerplant",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://atsnee.org/announcements",
      lastModified: lastAnnouncementUpdate || lastEventUpdate || new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: "https://atsnee.org/activities",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://atsnee.org/campus",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: "https://atsnee.org/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // @ts-ignore
    ...lastAnnouncements.map((announcement) => {
      return {
        url: "https://atsnee.org/announcements/" + announcement.id,
        lastModified: announcement.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      };
    }),
  ];
}

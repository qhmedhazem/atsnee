import "server-only";
import { db } from "@/lib/db";

export const fetchAnnouncementById = async (id: string) => {
  return db.annoncement.findFirst({
    where: {
      id: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const fetchTheLastAnnouncementUpdate = async () => {
  const lastAnnouncement = await db.annoncement.findFirst({
    where: {
      published: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      updatedAt: true,
    },
  });

  return lastAnnouncement?.updatedAt;
};

export const fetchTheLast50AnnouncementsIds = async () => {
  const lastAnnouncements = await db.annoncement.findMany({
    where: {
      published: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      updatedAt: true,
    },
    take: 50,
  });

  return lastAnnouncements;
};

export const previewAnnouncements = async (limit?: number) => {
  return db.annoncement
    .findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })
    .catch((e) => [])
    .then((res) => res);
};

export const fetchAllAnnouncements = async () => {
  return db.annoncement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

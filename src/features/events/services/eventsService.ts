import "server-only";
import { db } from "@/lib/db";

export const fetchEventById = async (id: string) => {
  return db.event.findFirst({
    where: {
      id: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const fetchTheLastEventUpdate = async () => {
  const lastEvent = await db.event.findFirst({
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

  return lastEvent?.updatedAt;
};

export const previewEvents = async (limit?: number) => {
  return db.event
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

export const fetchAllEvents = async () => {
  return db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

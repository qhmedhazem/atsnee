import React from "react";
import { AnnouncementList as AnnouncementListInterface } from "@/payload-types";
import payload from "@/lib/payload";
import { getLocale } from "@/lib/getLocale";
import VerticalList from "@/components/VerticalList";
import AnnouncementCard from "./AnnouncementCard";
import { headers } from "next/headers";

interface AnnouncementListProps extends AnnouncementListInterface {}

const AnnouncementList: React.FC<AnnouncementListProps> = async ({
  maxPosts,
}) => {
  const posts = await queryAnnouncements("max", maxPosts || 1000);

  return (
    <ul className="flex flex-col items-center place-items-center md:grid md:grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.docs.map((post) => (
        <AnnouncementCard key={post.slug} announcement={post} />
      ))}
    </ul>
  );
};

export default AnnouncementList;

const queryAnnouncements = async (
  mode: "max" | "scroll",
  maxAmountOfPosts: number = 1000,
  page = 1
) => {
  const locale = await getLocale();
  return payload.find({
    collection: "posts",
    locale: locale,
    draft: false,
    limit: maxAmountOfPosts,
    page,
  });
};

import List from "@/components/List";
import AnnouncementLandingCard from "./announcements/AnnouncementLandingCard";
import { Annoncement } from "@prisma/client";
import { FC, HTMLAttributes } from "react";
import ScrollableList from "@/components/ScrollableList";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  announcements: Annoncement[];
}

const SchoolNewsSection: FC<Props> = ({ announcements, ...props }) => {
  return (
    <section
      id="news"
      {...props}
      className={cn("container w-full flex flex-col gap-8", props.className)}
    >
      <h1 className="text-3xl font-bold">School News & Updates</h1>
      <ul className="grid place-items-center grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-8">
        {announcements.map((a) => (
          <li
            key={a.id}
            className="flex-1 m-2 flex-grow max-w-[320px] w-full flex justify-center items-center"
          >
            <AnnouncementLandingCard key={a.id} announcement={a} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SchoolNewsSection;

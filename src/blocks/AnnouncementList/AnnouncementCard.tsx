import React from "react";
import Image from "next/image";

import { Media, Post } from "@/payload-types";
import { Card, CardContent } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

interface Props {
  announcement: Post;
}

const AnnouncementCard: React.FC<Props> = ({ announcement }) => {
  const image = announcement.banner as Media;

  return (
    <Card className="bg-transparent shadow-none border-0 h-full w-full text-primary mx-auto duration-300 transition-all">
      <div className="h-48 w-full overflow-hidden">
        <Image
          src={image.sizes?.og?.url || ""}
          alt={image.alt || ""}
          className="object-cover w-full h-full"
          width={500}
          height={280}
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col gap-4 px-0 py-4">
        <div className="space flex items-center justify-between">
          <h2 className="text-lg font-semibold line-clamp-1">
            {announcement.title}
          </h2>
        </div>
        <p className="text-sm font-light line-clamp-2">{announcement.brief}</p>
        <div>
          <LinkButton
            className="self-end text-xs leading-3 rounded-sm bg-blue-800 hover:bg-blue-900 px-6 py-0 h-9"
            href={`/announcements/${announcement.slug}`}
          >
            Read more
          </LinkButton>
        </div>
      </CardContent>

      {/* Read More Button */}
    </Card>
  );
};

export default AnnouncementCard;

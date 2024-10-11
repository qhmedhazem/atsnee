import React from "react";
import Link from "@/components/ui/Link";

import { Annoncement } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getRelativeTime } from "@/lib/utils";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import Image from "next/image";

interface Props {
  announcement: Annoncement;
  href?: string;
}

const AnnouncementLandingCard: React.FC<Props> = ({ announcement, href }) => {
  return (
    <Card className="bg-transparent shadow-none border-0 h-full w-full text-primary mx-auto duration-300 transition-all">
      <div className="h-48 w-full overflow-hidden">
        <Image
          src={announcement.imageURL || "/landing2.jpg"}
          alt={announcement.title}
          className="object-cover w-full h-full"
          width={500}
          height={280}
        />
      </div>

      {/* Card Content */}
      <CardContent className="flex flex-col gap-4 px-0 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold line-clamp-1">
              {announcement.title}
            </h2>
            {!announcement.published && <Badge>Unpublished</Badge>}
          </div>
        </div>
        <Markdown className="text-sm font-light line-clamp-2">
          {announcement.content}
        </Markdown>
        <div>
          <LinkButton
            className="self-end text-xs leading-3 rounded-sm bg-blue-800 hover:bg-blue-900 px-6 py-0 h-9"
            href={href || `/announcements/${announcement.id}`}
          >
            Read more
          </LinkButton>
        </div>
      </CardContent>

      {/* Read More Button */}
    </Card>
  );
};

export default AnnouncementLandingCard;

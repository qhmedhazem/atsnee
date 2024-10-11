import React from "react";
import { Event } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getRelativeTime } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";
import Link from "@/components/ui/Link";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/Badge";

interface Props {
  event: Event;
  href?: string;
}

const EventCardContent: React.FC<Props> = ({ event, href }) => {
  return (
    <>
      <CardHeader className="px-6 pt-6 pb-0 space-y-0">
        <div className="w-full flex justify-between">
          <div>
            <h2 className="text-xl font-semibold line-clamp-2">
              {event.title}
            </h2>
            <p className="text-sm font-light">{getRelativeTime(event.date)}</p>
            {!event.published && <Badge>Unpublished</Badge>}
          </div>
          {event.registerLink && !href && (
            <LinkButton href={event.registerLink} target="_blank">
              Register
            </LinkButton>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-6 pt-4 pb-4">
        <Markdown className="text-gray-600 line-clamp-3">
          {event.content}
        </Markdown>
      </CardContent>
    </>
  );
};

const EventCard: React.FC<Props> = ({ event, href }) => {
  return (
    <Card className="w-full cursor-pointer mx-auto duration-300 transition-all rounded-lg border border-gray-200 hover:shadow-xl  hover:-translate-y-0.5">
      {/* Card Header */}
      {href ? (
        <Link href={`/admin/events/${event.id}`}>
          <EventCardContent event={event} href={href} />
        </Link>
      ) : (
        <EventCardContent event={event} href={href} />
      )}
    </Card>
  );
};

export default EventCard;

import React from "react";
import { Event } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/Card";
import Markdown from "react-markdown";
import { Badge } from "@/components/ui/Badge";
import { CalendarIcon, MapPinIcon, StickyNote } from "lucide-react";
import Link from "@/components/ui/Link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  event: Event;
  href?: string;
}

const EventLandingCard: React.FC<Props> = ({ event, href }) => {
  const getFormattedDate = (date: Date) => {
    const eventDate = new Date(date);
    const day = eventDate.getDate();
    const month = eventDate
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    return { day, month };
  };

  const { day, month } = getFormattedDate(event.date);

  const getFormattedTime = (date: Date) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  };

  const formattedTime = getFormattedTime(event.date);

  return (
    <Card className="bg-white w-full max-w-md mx-auto rounded-lg overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="h-48 w-full overflow-hidden">
          <Image
            src={event.imageURL || "/landing2.jpg"}
            alt={event.title}
            className="object-cover w-full h-full"
            width={500}
            height={280}
          />
        </div>

        <CardContent className="flex flex-row gap-2 p-0">
          <div className="bg-light-blue-800 text-white text-center flex flex-col items-center justify-center w-16 py-4">
            <span className="text-2xl font-bold">{day}</span>
            <span className="text-sm">{month}</span>
          </div>
          <div className="flex flex-col p-4 gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold line-clamp-1">
                {event.title}
              </h2>
              {!event.published && <Badge>Unpublished</Badge>}
            </div>
            <Markdown className="text-sm font-light line-clamp-2 h-10">
              {event.content}
            </Markdown>

            <div className="mt-2 text-sm flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
            <div className="text-sm flex items-center gap-2">
              <MapPinIcon className="w-4 h-4" />
              <span>{event.location || "Virtual"}</span>
            </div>
            {event.registerLink ? (
              <Link
                href={event.registerLink}
                className="text-sm flex items-center gap-2 text-blue-500 hover:underline"
              >
                <StickyNote className="w-4 h-4" />
                <span>Register</span>
              </Link>
            ) : (
              <div className="text-sm flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                <span>Registration not available</span>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default EventLandingCard;

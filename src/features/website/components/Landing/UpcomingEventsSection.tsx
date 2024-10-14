import { Event } from "@prisma/client";
import { FC, HTMLAttributes } from "react";
import ScrollableList from "@/components/ScrollableList";
import EventLandingCard from "./announcements/EventLandingCard";

interface Props extends HTMLAttributes<HTMLDivElement> {
  events: Event[];
}

const UpcomingEventsSection: FC<Props> = ({ events }) => {
  return (
    <section id="events" className="container w-full flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Upcoming Events</h1>
      <ul className="grid place-items-center grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-8">
        {events.map((a) => (
          <li
            key={a.id}
            className="flex-1 m-2 flex-grow w-full min-w-[220px] max-w-[320px]"
          >
            <EventLandingCard key={a.id} event={a} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UpcomingEventsSection;

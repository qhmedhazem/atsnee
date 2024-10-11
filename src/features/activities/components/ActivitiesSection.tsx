import { FC, HTMLAttributes } from "react";
import { Activity } from "@prisma/client";

import VerticalList from "@/components/VerticalList";
import ActivityCard from "./ActivityCard";

import { cn } from "@/lib/utils";
import Tabs, { Tab } from "@/components/Tabs";
import Link from "next/link";

type ActivityWithTeams = Activity & {
  teams: { members: string[] }[];
};

interface Props extends HTMLAttributes<HTMLDivElement> {
  activities: ActivityWithTeams[];
}

const ActivitiesSection: FC<Props> = ({ activities, ...props }) => {
  return (
    <section className={cn("w-full", props.className)}>
      <VerticalList emptyMessage="There are no records.">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </VerticalList>
    </section>
  );
};

export default ActivitiesSection;

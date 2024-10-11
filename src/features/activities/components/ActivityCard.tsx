"use client";

import { FC, HTMLAttributes, useMemo, useRef, useState } from "react";
import { cn, getCurrentDateInUserTimezone } from "@/lib/utils";
import { Activity, Team } from "@prisma/client";
import Gallery from "@/components/Gallery";
import ActivityTeam from "./ActivityTeam";
import { HTMLMotionProps, motion, useInView } from "framer-motion";
import Markdown from "react-markdown";

type ActivityWithTeams = Activity & {
  teams: { name?: string; members: string[] }[];
};

interface Props extends HTMLMotionProps<"div"> {
  activity: ActivityWithTeams;
}

const ActivityCard: FC<Props> = ({ activity, className, ...props }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const teamsMode = activity.teams.some((t) => t.members.length > 1);

  return (
    <motion.div
      {...props}
      className={cn(
        "w-full bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-6",
        className
      )}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">{activity.name}</h2>
        {activity.date && (
          <p className="text-primary/80">
            {getCurrentDateInUserTimezone(activity.date)}
          </p>
        )}
        {activity.description && <Markdown>{activity.description}</Markdown>}
      </div>

      {activity.teams.length != 0 && (
        <div className="space-y-2">
          <p className="text-primary/80">Participations:</p>
          <ul
            className={cn(
              "ml-2 space-y-2",
              teamsMode ? "" : "list-disc list-inside"
            )}
          >
            {activity.teams.map((team, idx) => (
              <ActivityTeam
                key={idx}
                name={team.name || "Team " + (idx + 1)}
                members={team.members}
                memberMode={!teamsMode}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Photo Gallery */}
      {activity.photos.length != 0 && (
        <div className="w-full flex justify-center">
          <Gallery photos={activity.photos} />
        </div>
      )}
    </motion.div>
  );
};

export default ActivityCard;

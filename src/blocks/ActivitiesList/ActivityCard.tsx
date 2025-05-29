"use client";

import { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Media } from "@/payload-types";

import Gallery from "@/components/Gallery";
import ActivityTeam from "./ActivityTeam";

import { cn, getCurrentDateInUserTimezone } from "@/lib/utils";

interface ActivityProps extends Activity {
  participations: string;
}

const ActivityCard: FC<ActivityProps> = ({
  name,
  description,
  teams,
  gallery,
  date,
  participations,
  type,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const teamsMode = teams?.some((t) => t.members && t.members.length > 1);

  return (
    <motion.div
      className={
        "w-full bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-6"
      }
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-primary">{name}</h2>
        {date && (
          <p className="text-primary/80">
            {getCurrentDateInUserTimezone(new Date(date))}
          </p>
        )}
        {description && <p>{description}</p>}
      </div>

      {teams && teams?.length != 0 ? (
        <div className="space-y-2">
          <p className="text-primary/80">{participations}</p>
          <ul
            className={cn(
              "ml-2 space-y-2",
              teamsMode ? "" : "list-disc list-inside"
            )}
          >
            {teams.map((team, idx) => (
              <ActivityTeam
                key={idx}
                name={team.teamName || "Team " + (idx + 1)}
                members={team.members?.map((member) => member.memberName) || []}
                memberMode={!teamsMode}
              />
            ))}
          </ul>
        </div>
      ) : null}

      {/* Photo Gallery */}
      {gallery && gallery.length != 0 && (
        <div className="w-full flex justify-center">
          <Gallery
            photos={gallery.map((g) => g.image as Media).filter(Boolean)}
          />
        </div>
      )}
    </motion.div>
  );
};

export default ActivityCard;

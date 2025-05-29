import React from "react";
import payload from "@/lib/payload";
import { ActivitiesList as ActivitiesListInterface } from "@/payload-types";

import VerticalList from "@/components/VerticalList";
import ActivityCard from "./ActivityCard";
import { getLocale } from "@/lib/locale";
import { headers } from "next/headers";

const ActivitiesList: React.FC<ActivitiesListInterface> = async ({
  type: types,
  sortBy,
  maxRows,
  participations,
}) => {
  const locale = await getLocale();

  const activities = await payload.find({
    collection: "activities",
    where: {
      type: {
        in: types,
      },
    },
    sort: sortBy,
    limit: maxRows || 1000,
    pagination: false,
    locale: locale,
  });

  return (
    <VerticalList emptyMessage="There are no records.">
      {activities.docs.map((activity) => (
        <ActivityCard
          key={activity.id}
          participations={participations}
          {...activity}
        />
      ))}
    </VerticalList>
  );
};

export default ActivitiesList;

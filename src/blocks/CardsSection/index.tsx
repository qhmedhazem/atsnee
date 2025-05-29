import React from "react";
import { icons, LucideIcon } from "lucide-react";

import { CardsSection as CardsSectionInterface } from "@/payload-types";
import Card from "./card";

const CardsSection: React.FC<CardsSectionInterface> = ({ cards }) => {
  return (
    <section className="bg-blue-500 py-12 w-full">
      <div className="container mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards?.map((card) => {
          const icon = card.featureIcon as any;
          // @ts-ignore
          const IconComp = icons[icon.name as string] as LucideIcon;

          return (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              icon={
                <IconComp
                  size={icon.size}
                  color={icon.color}
                  strokeWidth={icon.strokeWidth}
                  absoluteStrokeWidth={icon.absoluteStrokeWidth}
                />
              }
            />
          );
        })}
      </div>
    </section>
  );
};

export default CardsSection;

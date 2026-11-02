import { FC } from "react";
import Image from "next/image";
import { Media, ScrollingSection as ScrollingSectionInterface } from "@/payload-types";

import { cn } from "@/lib/utils";
import RichText from "@/components/RichText";

type ArrayElement<T> = T extends Array<infer U> ? U : never;
type ItemType = ArrayElement<ScrollingSectionInterface["items"]>;

interface ItemProps extends ItemType {
  index: number;
  total: number;
  reached: boolean;
}

const ScrollingSectionItem: FC<ItemProps> = ({ reverse, content, title, image: media, subtitle, index, total, reached }) => {
  const step = index + 1;
  const isFirst = index === 0;
  const isLast = step === total;
  const image = media as Media | null;

  return (
    // Image first in the DOM: above the text on small screens; `reverse` moves it to the end from lg up.
    <li className={cn("relative flex flex-col gap-6 ps-14 lg:flex-row lg:items-center lg:gap-28 lg:ps-0", reverse && "lg:flex-row-reverse")}>
      <span
        data-step-dot
        className={cn(
          "absolute start-0 top-0 z-10 flex size-10 items-center justify-center rounded-full text-xl font-bold text-white",
          "lg:start-auto lg:left-1/2 lg:-translate-x-1/2",
          isLast && !isFirst && "lg:top-auto lg:bottom-0",
          !isFirst && !isLast && "lg:top-1/2 lg:-translate-y-1/2",
          "motion-safe:transition-[background-color,box-shadow] motion-safe:duration-300",
          reached ? "bg-blue-500 shadow-[0_0_0_8px_rgba(33,150,243,0.18)]" : "bg-gray-400"
        )}
      >
        {step}
      </span>
      {image && (
        <div className="w-full lg:w-1/2">
          <Image
            width={500}
            height={500}
            src={image.sizes?.fourThree?.url || image.url || ""}
            alt={image.alt || ""}
            className="rounded-2xl w-full object-center object-cover"
          />
        </div>
      )}
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="space-y-2">
          {subtitle && <h3 className="text-sm font-bold uppercase text-blue-500 tracking-wider">{subtitle}</h3>}
          {title && <h2 className="text-4xl font-bold">{title}</h2>}
        </div>
        <RichText enableGutter={false} enableProse={false} data={content} />
      </div>
    </li>
  );
};

export default ScrollingSectionItem;

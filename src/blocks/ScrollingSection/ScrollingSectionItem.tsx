"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Media,
  ScrollingSection as ScrollingSectionInterface,
} from "@/payload-types";

import { cn } from "@/lib/utils";
import RichText from "@/components/RichText";

interface ScrollingSectionItemImageProps {
  image: Media;
}

const ScrollingSectionItemImage: FC<ScrollingSectionItemImageProps> = ({
  image,
}) => {
  return (
    image && (
      <div className="w-full lg:w-1/2 h-full">
        <Image
          width={500}
          height={500}
          src={image.sizes?.fourThree?.url || ""}
          alt={image.alt || ""}
          className="rounded-lg w-full object-center object-cover"
        />
      </div>
    )
  );
};

type ArrayElement<T> = T extends Array<infer U> ? U : never;
type ItemType = ArrayElement<ScrollingSectionInterface["items"]>;

interface ItemProps extends ItemType {
  currentScrollY: number;
  index: number;
  total: number;
}

const ScrollingSectionItem: FC<ItemProps> = ({
  reverse,
  content,
  title,
  image: media,
  subtitle,

  //
  index,
  total,
  currentScrollY,
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const stepRef = useRef<HTMLSpanElement>(null);

  const step = index + 1;
  const isFirst = index === 0;
  const isLast = step === total;
  const image = media as Media | null;

  useEffect(() => {
    const handleScroll = () => {
      if (stepRef.current == null) return;
      const scrollY = window.scrollY;
      const windowHalfHeight = window.innerHeight / 2;
      const currentScrollPosition = scrollY + windowHalfHeight;

      const bodyRect = document.body.getBoundingClientRect(),
        stepRect = stepRef.current.getBoundingClientRect(),
        stepTop = stepRect.top - bodyRect.top;

      const towardsByYPixels = currentScrollPosition - stepTop;

      setIsActivated(towardsByYPixels > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stepRef, currentScrollY]);

  return (
    // <div className="w-full flex justify-between gap-28 relative">
    <div
      className={cn(
        `w-full relative flex gap-8 lg:gap-28 lg:space-x-8`,
        reverse ? "flex-col lg:flex-row" : "flex-col-reverse lg:flex-row"
      )}
    >
      {!reverse && image && <ScrollingSectionItemImage image={image} />}
      <div
        className={cn(
          "absolute w-full h-full flex justify-center",
          isFirst ? "items-start" : "",
          isLast ? "items-end" : "",
          !isFirst && !isLast ? "items-center" : ""
        )}
      >
        <motion.span
          ref={stepRef}
          className={cn(
            // "absolute left-1/2 -translate-x-1/2",
            // isFirst ? "top-0" : "",
            // isLast ? "bottom-0" : "",
            // !isFirst && !isLast ? "top-1/2 -translate-y-1/2" : "",
            "hidden p-4 w-10 h-10 rounded-full lg:flex items-center justify-center text-center text-white font-bold text-xl transition-colors duration-300",
            isActivated ? "bg-blue-500" : "bg-gray-500"
          )}
          initial={{
            scale: 1,
          }}
          animate={
            isActivated
              ? {
                  scale: [1, 1.3, 1, 1], // Bouncing effect
                  transition: {
                    duration: 0.6, // Duration for the entire animation
                    ease: "easeInOut", // Smooth transition
                  },
                }
              : {}
          }
        >
          {step}
        </motion.span>
      </div>
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="space-y-2">
          {subtitle && (
            <h3 className="text-sm font-bold uppercase text-blue-500 tracking-wider">
              {subtitle}
            </h3>
          )}
          {title && <h2 className="text-4xl font-bold">{title}</h2>}
        </div>
        <RichText enableGutter={false} enableProse={false} data={content} />
      </div>
      {reverse && image && <ScrollingSectionItemImage image={image} />}
    </div>
  );
};

export default ScrollingSectionItem;

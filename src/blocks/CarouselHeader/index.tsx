"use client";
import { useEffect, useState } from "react";
import {
  CarouselHeader as CarouselHeaderInterface,
  Media,
} from "@/payload-types";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { CarouselItem } from "@/components/Carousel/CarouselItem";
import { HeroCursor } from "@/components/Carousel/HeroCursor";

interface Props extends CarouselHeaderInterface {}

const CarouselHeader: React.FC<Props> = ({
  autoplay,
  loop,
  interval,
  items,
}) => {
  const [active, setActive] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (!(autoplay ?? true) || count < 2) return;
    const timer = setInterval(
      () =>
        setActive((i) =>
          (loop ?? true) ? (i + 1) % count : Math.min(i + 1, count - 1)
        ),
      interval || 10_000
    );
    return () => clearInterval(timer);
  }, [autoplay, loop, interval, count]);

  return (
    <section
      data-hero
      className="relative w-full h-screen max-h-svh z-0 overflow-hidden"
      dir="ltr"
    >
      <div className="relative overflow-x-hidden w-full h-full max-h-svh">
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {items.map((item, idx) => {
            const image = item.image as Media;
            const cta = item.cta;

            return (
              <div key={idx} className="w-full h-full flex-none">
                <CarouselItem
                  title={item.title}
                  description={item.description || ""}
                  imageSrc={image.sizes?.og?.url || image.url || ""}
                  imageAlt={image.alt || ""}
                >
                  {cta && cta.url && cta.label ? (
                    <LinkButton
                      href={cta.url}
                      target={cta.newTab ? "_blank" : "_self"}
                      className="transition-all bg-light-blue-800 hover:bg-light-blue-900"
                    >
                      {cta.label}
                    </LinkButton>
                  ) : undefined}
                </CarouselItem>
              </div>
            );
          })}
        </div>
        {count > 1 && (
          <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={cn(
                  "block h-3 w-3 cursor-pointer rounded-full transition-colors",
                  idx === active ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
      <HeroCursor />
    </section>
  );
};

export default CarouselHeader;

"use client";
import { Carousel } from "@material-tailwind/react";
import {
  CarouselHeader as CarouselHeaderInterface,
  Media,
} from "@/payload-types";
import { LinkButton } from "@/components/ui/Button";

import { CarouselItem } from "@/components/Carousel/CarouselItem";
import { HeroCursor } from "@/components/Carousel/HeroCursor";

interface Props extends CarouselHeaderInterface {}

const CarouselHeader: React.FC<Props> = ({
  autoplay,
  loop,
  interval,
  items,
}) => {
  return (
    <section
      className="relative w-screen h-screen max-h-[100svh] z-0 overflow-hidden"
      dir="ltr"
    >
      <Carousel
        id="pageLayout"
        className="w-full h-full max-h-[100svh]"
        prevArrow={() => null}
        nextArrow={() => null}
        autoplay={autoplay || true}
        loop={loop || true}
        autoplayDelay={interval || 10_000}
      >
        {items.map((item, idx) => {
          const image = item.image as Media;
          const cta = item.cta;

          return (
            <CarouselItem
              key={idx}
              title={item.title}
              description={item.description || ""}
              imageSrc={image.sizes?.og?.url || ""}
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
          );
        })}
      </Carousel>
      <HeroCursor />
    </section>
  );
};

export default CarouselHeader;

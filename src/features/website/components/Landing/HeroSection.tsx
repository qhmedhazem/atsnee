"use client";
import { Carousel } from "@material-tailwind/react";
import { CarouselItem } from "./hero/CarouselItem";
import { HeroCursor } from "./hero/HeroCursor";
import { LinkButton } from "@/components/ui/Button";
import { useTranslations } from 'next-intl';



const HeroSection = () => {
  const t = useTranslations('home');
  return (
    <section
      id="atsnet"
      className="relative w-screen h-screen max-h-[100vh] z-0 overflow-hidden"
    >
      <Carousel
        id="pageLayout"
        className="w-full h-full max-h-[100vh]"
        prevArrow={() => null}
        nextArrow={() => null}
        autoplay={true}
        loop={true}
        autoplayDelay={10_000}
      >
        <CarouselItem
          title={t('hero_items.0.title')}
          description={t('hero_items.0.description')}
          imageSrc="/landing2.jpg"
          imageAlt="Explore Advanced Nuclear Technology"
        >
          <LinkButton
            size="lg"
            href="/about"
            className="transition-all bg-light-blue-800 hover:bg-light-blue-900"
          >
            Learn More
          </LinkButton>
        </CarouselItem>
        <CarouselItem
          title={t('hero_items.1.title')}
          description={t('hero_items.1.description')}
          imageSrc="/landing4.jpg"
          imageAlt="Innovative Engineering Projects"
        >
          <LinkButton
            size="lg"
            href="/academics"
            className="transition-all bg-light-blue-800 hover:bg-light-blue-900"
          >
            Academics
          </LinkButton>
        </CarouselItem>
        <CarouselItem
          title={t('hero_items.2.title')}
          description={t('hero_items.2.description')}
          imageSrc="/landing6.jpg"
          imageAlt="Where Talent Meets Opportunity"
        >
          <LinkButton
            size="lg"
            href="/admission"
            className="transition-all bg-light-blue-800 hover:bg-light-blue-900"
          >
            Admission
          </LinkButton>
        </CarouselItem>
      </Carousel>
      <HeroCursor />
    </section>
  );
};

export default HeroSection;

"use client";

import { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Media, InfoSection as InfoSectionInterface } from "@/payload-types";

import Image from "next/image";
import RichText from "@/components/RichText";

import { cn } from "@/lib/utils";
import StatItem from "@/components/StatItem";

interface ImageContainerProps {
  image: Media;
}

const InfoSectionImageContainer: FC<ImageContainerProps> = ({
  image,
  ...props
}) => {
  return (
    image && (
      <div className="relative w-full lg:w-1/2 text-center flex justify-center">
        <Image
          {...props}
          className="object-cover object-center w-full h-full"
          src={image.sizes?.fourThree?.url || ""}
          alt={image.alt || ""}
          width={image.sizes?.fourThree?.width || 1024}
          height={image.sizes?.fourThree?.height || 1024}
        />
      </div>
    )
  );
};

interface Props extends InfoSectionInterface {}

const InfoSection: FC<Props> = ({
  title,
  subtitle,
  image,
  reverse,
  content,
  stats,
  ...props
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      className={cn(
        `flex flex-col gap-8 lg:flex-row lg:space-x-8`,
        reverse ? "flex-col" : "flex-col-reverse"
      )}
    >
      {!reverse && <InfoSectionImageContainer image={image as Media} />}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full lg:w-1/2 space-y-4"
      >
        <div className="space-y-2">
          {subtitle && (
            <h3 className="text-sm font-bold uppercase text-blue-500 tracking-wider">
              {subtitle}
            </h3>
          )}
          {title && <h2 className="text-4xl font-bold">{title}</h2>}
        </div>
        <RichText enableGutter={false} enableProse={false} data={content} />

        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {stats.map((item) => (
              <StatItem key={item.id} value={item.value} label={item.label} />
            ))}
          </div>
        )}
      </motion.div>
      {reverse && <InfoSectionImageContainer image={image as Media} />}
    </section>
  );
};

export default InfoSection;

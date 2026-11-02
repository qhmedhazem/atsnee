import { FC } from "react";
import { cn } from "@/lib/utils";
import { ImageHeader as ImageHeaderInterface, Media } from "@/payload-types";
import Image from "next/image";
import { DEFAULT_COVER, coverPosition } from "@/blocks/AnnouncementList/NewsCard";

// Used as a block and directly by the page globals (hero group).
type Props = Pick<ImageHeaderInterface, "image" | "title" | "description" | "size">;

const ImageHeader: FC<Props> = ({ image, title, description, size }) => {
  const img = image as Media | null; // posts without banner or gallery have none
  const compact = size === "compact";

  return (
    // w-full: the page <main> centers its children, so the hero must claim the full width itself.
    <header data-hero className={cn("relative w-full", compact ? "h-[240px] md:h-[300px]" : "h-[500px]")}>
      <Image
        src={img?.url || DEFAULT_COVER}
        alt={img?.alt || ""}
        style={{ objectPosition: coverPosition(img) }}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-end bg-black/75">
        <div
          className={cn(
            "hero-content w-full max-w-2xl px-6 pb-8 md:px-12 lg:px-24 xl:max-w-[calc(50%+12rem)]", // long titles: the text (padding aside) gets half a wide screen
            compact ? "lg:pb-12" : "md:pb-16 lg:pb-24",
          )}
          dir="auto"
        >
          <h1
            className={cn(
              "text-primary-foreground font-bold text-3xl md:text-4xl",
              compact ? "mb-2" : "mb-4 lg:text-5xl",
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="text-primary-foreground font-normal opacity-80">
              {description}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default ImageHeader;

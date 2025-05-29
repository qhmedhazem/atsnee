import { cn } from "@/lib/utils";
import { Media } from "@/payload-types";
import Image from "next/image";
import { FC, HTMLAttributes, useMemo } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  remainingImages: Media[];
}

const GallerySeeMore: FC<Props> = ({ remainingImages, ...props }) => {
  const remainingCount = useMemo(
    () => remainingImages.length,
    [remainingImages.length]
  );

  return (
    <div
      {...props}
      className={cn(
        "relative w-full h-full max-w-xs max-h-xs rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        props.className
      )}
    >
      {/* Mini Grid of Remaining Photos */}
      <div
        className={cn(
          "w-full h-full grid gap-1",
          remainingCount === 1 ? "grid-rows-1 grid-cols-1" : "",
          remainingCount === 2 ? "grid-cols-2 grid-rows-1" : "",
          [3, 4].includes(remainingCount) ? "grid-rows-2 grid-cols-2" : ""
        )}
      >
        {remainingImages.slice(0, 4).map((image, idx) => (
          <div
            key={idx}
            className={cn(
              "overflow-hidden rounded-sm w-full h-full",
              remainingCount == 2 ? "" : ""
            )}
          >
            <Image
              src={image.sizes?.og?.url || ""}
              width={remainingCount === 2 ? 150 : 300}
              height={remainingCount === 2 ? 300 : 300}
              alt={image.alt || `Remaining photo ${idx + 1}`}
              className={cn(
                "w-full h-full object-cover rounded-sm",
                remainingCount == 2 ? "" : ""
              )}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold bg-black bg-opacity-60">
        +{remainingCount}
      </div>
    </div>
  );
};

export default GallerySeeMore;

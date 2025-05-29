import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ImageHeader as ImageHeaderInterface, Media } from "@/payload-types";
import Image from "next/image";

interface Props extends ImageHeaderInterface {}

const ImageHeader: FC<Props> = ({ image, title, description }) => {
  const img = image as Media;

  return (
    <header
      className="relative"
      style={{
        width: "screen",
        height: 500,
      }}
    >
      <Image
        src={img.sizes?.og?.url || ""}
        alt={img.alt || ""}
        width={888}
        height={500}
        className="w-screen h-auto bg-cover object-cover "
        style={{
          height: 500,
        }}
      />
      <div className="absolute inset-0 flex items-end bg-black/75">
        <div
          className="w-full max-w-2xl px-6 pb-8 md:px-12 md:pb-16 lg:px-24 lg:pb-24"
          dir="auto"
        >
          <h1 className="mb-4 text-primary-foreground font-bold text-3xl md:text-4xl lg:text-5xl">
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

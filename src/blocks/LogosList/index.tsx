import React from "react";
import Image from "next/image";
import { LogoList as LogoListInterface, Media } from "@/payload-types";
import { cn } from "@/lib/utils";

const LogoList: React.FC<LogoListInterface> = ({ gap, size, logos }) => {
  const className = cn(
    gap,
    "flex flex-col md:flex-row w-full justify-around items-center"
  );

  return (
    <div className={className}>
      {logos?.map((logo, index) => {
        const image = logo.logo as Media;
        return (
          <Image
            key={index}
            src={image.sizes?.square?.url || ""}
            alt={image.alt || ""}
            width={size}
            height={size}
          />
        );
      })}
    </div>
  );
};

export default LogoList;

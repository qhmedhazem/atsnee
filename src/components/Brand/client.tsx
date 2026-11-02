import React, { FC } from "react";

import Link from "@/components/ui/Link";
import Image from "next/image";

import { Information, Media } from "@/payload-types";

interface Props {
  withText?: boolean;
  withDescription?: boolean;
  information: Information;
}

const Brand: FC<Props> = ({
  withText = true,
  withDescription = true,
  information,
}) => {
  return (
    <Link className="flex gap-4 justify-center items-center uppercase" href="/">
      <Image
        width={1024}
        height={1024}
        src={(information.logo as Media).sizes?.square?.url || (information.logo as Media).url || ""}
        alt={information.name + " Logo"}
        className="w-16 h-16"
      />
      {withText && (
        <div>
          <p className="text-2xl font-bold">{information.short}</p>
          {withDescription ? (
            <p className="hidden text-xs font-light xl:inline">
              {information.name}
            </p>
          ) : null}
        </div>
      )}
    </Link>
  );
};

export default Brand;

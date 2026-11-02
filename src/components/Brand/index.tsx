import React, { FC } from "react";
import payload from "@/lib/payload";

import Link from "@/components/ui/Link";
import Image from "next/image";

import { Media } from "@/payload-types";
import { getLocale } from "@/lib/getLocale";
import { headers } from "next/headers";

interface Props {
  withText?: boolean;
  withDescription?: boolean;
}

const Brand: FC<Props> = async ({
  withText = true,
  withDescription = true,
}) => {
  const locale = await getLocale();

  const information = await payload.findGlobal({
    slug: "information",
    locale: locale,
  });

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

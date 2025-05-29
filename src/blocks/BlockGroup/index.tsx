import React from "react";
import { BlockGroup as BlockGroupInterface } from "@/payload-types";
import { cn } from "@/lib/utils";

interface Props extends BlockGroupInterface {
  children?: React.ReactNode;
}

const BlockGroup: React.FC<Props> = ({
  children,
  title,
  maxWidth,
  paddingBottom,
  paddingTop,
  gap,
}) => {
  const outerClassName = cn(
    maxWidth,
    paddingBottom,
    paddingTop,
    "flex flex-col gap-8"
  );

  const className = cn(gap, "flex flex-col");

  return (
    <section className={outerClassName}>
      {title && (
        <h1 className="text-3xl font-bold" dir="auto">
          {title}
        </h1>
      )}
      <div className={className}>{children}</div>
    </section>
  );
};

export default BlockGroup;

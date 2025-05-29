import React, { FC, HTMLAttributes, ReactNode } from "react";
import NoData from "@/components/NoData";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  emptyMessage?: string;
  children: ReactNode[];
}

const VerticalList: FC<Props> = ({
  title,
  emptyMessage = "This list is empty",
  children,
  ...props
}) => {
  return (
    <div className={cn("w-full", props.className)}>
      {title && <h2 className="text-3xl">{title}</h2>}
      <div className="gap-4 lg:gap-2 xl:gap-4 flex flex-col-reverse w-full lg:flex-row lg:justify-center">
        {children.length == 0 && <NoData title={emptyMessage} />}
        {children.length != 0 && (
          <ul className="w-full h-auto flex flex-col gap-4">{children}</ul>
        )}
      </div>
    </div>
  );
};

export default VerticalList;

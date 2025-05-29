import React, { FC } from "react";
import { PageNotFoundIllustration } from "./Illustrations/PageNotFound";
import { LinkButton } from "./ui/Button";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const PageNotFound: FC<Props> = ({ title, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 flex-1 text-center",
        className
      )}
    >
      <PageNotFoundIllustration height={250} />
      <span className="text-lg px-4 py-2 text-primary/50">
        {title || "Page Not Found."}
      </span>
      <LinkButton href="/">Landing Page</LinkButton>
    </div>
  );
};

export default PageNotFound;

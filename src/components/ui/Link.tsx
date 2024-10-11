"use client";

import { FC, HTMLAttributes, ReactNode } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface LinkProps
  extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string; // Ensure href is passed correctly
  activeClass?: string; // Class to apply when active
  children: ReactNode; // Children elements (link text, etc.)
}

const Link: FC<LinkProps> = ({ className, activeClass, ...props }) => {
  const currentPath = usePathname();

  return (
    <NextLink
      className={cn(className, currentPath == props.href ? activeClass : "")}
      {...props}
    />
  );
};

export default Link;

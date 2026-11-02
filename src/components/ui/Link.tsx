"use client";

import { ComponentProps, FC } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { localizeHref } from "@/lib/locale";
import { useLocale } from "@/hooks/use-locale";

export interface LinkProps
  extends Omit<ComponentProps<typeof NextLink>, "href"> {
  href: string;
  activeClass?: string; // Class to apply when active
}

// next/link that keeps the visitor in their current language.
const Link: FC<LinkProps> = ({ className, activeClass, href, ...props }) => {
  const locale = useLocale();
  const currentPath = usePathname();
  const localized = localizeHref(href, locale);

  return (
    <NextLink
      href={localized}
      className={cn(className, currentPath == localized ? activeClass : "")}
      {...props}
    />
  );
};

export default Link;

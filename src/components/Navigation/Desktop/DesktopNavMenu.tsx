"use client";

import * as React from "react";
import { Media, Navigation } from "@/payload-types";
import Link from "@/components/ui/Link";
import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/NavigationMenu";

import { cn } from "@/lib/utils";

interface Props {
  navigation: Navigation;
}

export default function DesktopNavMenu(props: Props) {
  return (
    <NavigationMenu className="text-center hidden lg:block">
      <NavigationMenuList>
        {props.navigation.navLinks?.map((link) => {
          if (!link.dropdownItems || link.dropdownItems.length === 0) {
            return (
              <NavigationMenuItem key={link.id}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={link.url || "#"}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          } else {
            return (
              <NavigationMenuItem key={link.id}>
                <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4 md:w-[440px] lg:w-[580px] lg:grid-cols-2 lg:auto-rows-fr">
                    {link.dropdownItems.map((item) => {
                      if (item.blockType == "verticalDropdownItem") {
                        return (
                          <li key={item.id} className="row-span-2">
                            <NavigationMenuLink asChild>
                              <Link
                                className="flex h-full w-full select-none flex-col justify-center items-center gap-1 rounded-md p-4 no-underline outline-hidden transition-all focus:shadow-md hover:bg-accent focus:bg-accent"
                                href={item.link || ""}
                              >
                                <Image
                                  width={72}
                                  height={72}
                                  src={
                                    (item.icon as Media)?.sizes?.square?.url ||
                                    ""
                                  }
                                  alt={(item.icon as Media)?.alt || ""}
                                />
                                <div className="mt-2 text-base font-semibold">
                                  {item.title}
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      } else if (item.blockType == "normalDropdownItem") {
                        return (
                          <ListItem
                            key={item.id}
                            href={item.link}
                            title={item.title}
                          >
                            {item.description}
                          </ListItem>
                        );
                      }
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || "#"}
          className={cn(
            "flex h-full flex-col justify-center gap-1 select-none rounded-md p-3 no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-snug">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


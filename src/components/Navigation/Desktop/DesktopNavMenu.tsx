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
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {link.dropdownItems.map((item) => {
                      if (item.blockType == "verticalDropdownItem") {
                        return (
                          <li key={item.id} className="row-span-3">
                            <NavigationMenuLink asChild>
                              <Link
                                className="flex h-full w-full select-none flex-col justify-end items-center rounded-md p-3 no-underline outline-hidden transition-all focus:shadow-md hover:bg-accent focus:bg-accent"
                                href={item.link || ""}
                              >
                                <Image
                                  width={108}
                                  height={108}
                                  src={
                                    (item.icon as Media)?.sizes?.square?.url ||
                                    ""
                                  }
                                  alt={(item.icon as Media)?.alt || ""}
                                />
                                <div className="mb-2 mt-4 text-lg font-medium">
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


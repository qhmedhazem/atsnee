"use client";
import * as React from "react";
import { Information, Navigation } from "@/payload-types";
import { cn } from "@/lib/utils";

import Brand from "../Brand/client";
import DesktopNavbar from "./Desktop/DesktopNavMenu";
import MobileNavMenu from "./Mobile/MobileNavMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import useScroll from "@/hooks/use-scroll";

interface Props {
  navigation: Navigation;
  information: Information;
}

export function NavbarMenu({ navigation, information }: Props) {
  const isScrolled = useScroll();

  return (
    <div
      className={cn(
        "z-20 max-w-full fixed w-screen transition-colors h-20 duration-300 text-primary-foreground",
        isScrolled
          ? "bg-background text-primary"
          : "bg-transparent text-primary-foreground",
        // Transparent white-text header only works over a hero image; pages without one (404, errors) get the solid style.
        "[body:not(:has([data-hero]))_&]:bg-background [body:not(:has([data-hero]))_&]:text-primary"
      )}
    >
      <div className="py-2 lg:py-3 px-6 md:px-16 flex justify-between items-center w-full h-full gap-16">
        <Brand information={information} />
        <div className="flex items-center gap-2">
          <DesktopNavbar navigation={navigation} />
          <LanguageSwitcher />
          <MobileNavMenu navigation={navigation} />
        </div>
      </div>
    </div>
  );
}

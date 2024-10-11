"use client";

import * as React from "react";
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
import useMediaQuery from "@/hooks/use-media-query";
import DesktopNavbar from "./Desktop/DesktopNavMenu";
import MobileNavMenu from "./Mobile/MobileNavMenu";

interface Props {
  isScrolled: boolean;
}

export function NavbarMenu({ isScrolled }: Props) {
  return (
    <>
      <MobileNavMenu isScrolled={isScrolled} />
      <DesktopNavbar isScrolled={isScrolled} />
    </>
  );
}

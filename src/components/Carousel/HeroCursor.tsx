"use client";

import { FC, HTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "@/components/ui/Link";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export const HeroCursor: FC<Props> = () => {
  const isScrolled = useScroll();

  return (
    <motion.div
      // If the user has scrolled, fade out and move down, otherwise show bouncing
      initial={{ y: 0 }}
      animate={isScrolled ? {} : { y: [0, -10, 0] }}
      transition={{
        repeat: Infinity,
        duration: 0.9,
      }}
      //   transition={{
      //     stiffness: isScrolled ? 0 : 100,
      //     damping: isScrolled ? 0 : 10,
      //     repeat: isScrolled ? 0 : Infinity, // Infinite repeat when not scrolled
      //     repeatType: "loop", // Loop for the bouncing
      //     duration: 0.6, // Speed of bounce
      //   }}
      className={cn(
        "right-6 bottom-6 p-1 absolute md:right-12 md:bottom-12 z-10 bg-white rounded-full shadow-lg",
        "transition-opacity duration-300 ease-in-out" // Smooth transition
      )}
    >
      <Link href="#about">
        <ChevronDown className="w-10 h-10 text-gray-700" />
      </Link>
    </motion.div>
  );
};

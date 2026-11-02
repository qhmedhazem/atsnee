"use client";

import { useEffect, useState } from "react";
import useScroll from "@/hooks/use-scroll";
import { Navigation } from "@/payload-types";

import Link from "@/components/ui/Link";
import { motion } from "framer-motion";

interface Props {
  navigation: Navigation;
}

export default function MobileNavMenu({ navigation }: Props) {
  const isScrolled = useScroll();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const colorClass = isScrolled ? "bg-primary" : "bg-primary-foreground";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block lg:hidden">
      <button
        className="relative text-primary flex flex-col items-center justify-center space-y-1 z-50 focus:outline-hidden"
        onClick={toggleMenu}
      >
        <motion.div
          className={"w-6 h-0.5 text-inherit " + colorClass}
          animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
        />
        <motion.div
          className={"w-4 h-0.5 " + colorClass}
          animate={{ opacity: isOpen ? 0 : 1 }}
        />
        <motion.div
          className={"w-6 h-0.5 " + colorClass}
          animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
        />
      </button>

      {/* Full-Screen Overlay Menu */}
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 bg-gray-900/90 z-30 flex flex-col items-center justify-center space-y-6 overflow-y-auto`}
      >
        {navigation.navLinks?.map((link) => {
          if (link.dropdownItems && link.dropdownItems.length > 0) {
            return link.dropdownItems.map((link) => (
              <Link
                href={link.link || "#"}
                key={link.id}
                className="text-white text-3xl"
                onClick={toggleMenu}
              >
                {link.title}
              </Link>
            ));
          } else {
            return (
              <Link
                href={link.url || "#"}
                key={link.id}
                className="text-white text-3xl"
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            );
          }
        })}
      </motion.div>
    </div>
  );
}


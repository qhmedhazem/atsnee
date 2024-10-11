"use client";

import { useEffect } from "react";
import { useState } from "react";
import Link from "@/components/ui/Link";
import { motion } from "framer-motion";

interface Props {
  isScrolled: boolean;
}

export default function MobileNavMenu({ isScrolled }: Props) {
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
        className="relative text-primary flex flex-col items-center justify-center space-y-1 z-50 focus:outline-none"
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
        className={`fixed inset-0 bg-gray-900 bg-opacity-90 z-30 flex flex-col items-center justify-center space-y-6 overflow-y-auto`}
      >
        <Link
          href="/about"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          About
        </Link>
        <Link
          href="/academics"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Academics
        </Link>
        <Link
          href="/nuclearpowerplant"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Nuclear Power Plant
        </Link>
        <Link
          href="/campus"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Campus
        </Link>
        <Link
          href="/announcements"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Announcements
        </Link>
        <Link
          href="/admission"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Admission
        </Link>
        <Link
          href="/activities"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Activities
        </Link>
        <Link
          href="/contact"
          className="text-white text-3xl"
          onClick={toggleMenu}
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
}

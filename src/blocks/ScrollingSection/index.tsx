"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import { ScrollingSection as ScrollingSectionInterface } from "@/payload-types";
import { cn } from "@/lib/utils";
import ScrollingSectionItem from "./ScrollingSectionItem";

interface Props extends ScrollingSectionInterface {}

const ScrollingSection: React.FC<Props> = ({
  maxWidth,
  gap,
  paddingTop,
  paddingBottom,
  paddingX,
  items,
}) => {
  const [fillHeight, setFillHeight] = useState<number>(0);
  const [currentScrollY, setCurrentScrollY] = useState<number>(0);
  const container = useRef<HTMLUListElement>(null);

  const outerClassName = cn(maxWidth, paddingBottom, paddingTop, paddingX);
  const listClassName = cn(gap, "relative flex flex-col");

  useEffect(() => {
    const getInnerHeight = (elm: HTMLElement) => {
      var computed = getComputedStyle(elm),
        padding =
          parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);
      return elm.clientHeight - padding;
    };

    const handleScroll = () => {
      if (container.current == null) return;
      const scrollY = window.scrollY;
      const windowHalfHeight = window.innerHeight / 2;
      const currentScrollPosition = scrollY + windowHalfHeight;

      const bodyRect = document.body.getBoundingClientRect(),
        containerRect = container.current.getBoundingClientRect(),
        containerTop = containerRect.top - bodyRect.top;

      const containerHeight = getInnerHeight(container.current);
      const newFillHeight = Math.max(
        0,
        Math.min(currentScrollPosition - containerTop, containerHeight)
      );

      setFillHeight(newFillHeight);
      setCurrentScrollY(currentScrollPosition);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [container]);

  return (
    <section className={outerClassName}>
      <ul ref={container} className={listClassName}>
        <motion.span
          className="hidden lg:block absolute left-1/2 rounded-full bg-blue-500 -translate-x-1/2 w-2 transition-all duration-0"
          style={{
            height: `${fillHeight}px`,
          }}
        />
        {items?.map((item, index) => {
          return (
            <ScrollingSectionItem
              key={item.id}
              currentScrollY={currentScrollY}
              index={index}
              total={items.length}
              {...item}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default ScrollingSection;

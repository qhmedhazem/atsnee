"use client";

import React, { useEffect, useRef, useState } from "react";

import { ScrollingSection as ScrollingSectionInterface } from "@/payload-types";
import { cn } from "@/lib/utils";
import ScrollingSectionItem from "./ScrollingSectionItem";

interface Props extends ScrollingSectionInterface {}

const ScrollingSection: React.FC<Props> = ({ maxWidth, gap, paddingTop, paddingBottom, paddingX, items }) => {
  const list = useRef<HTMLUListElement>(null);
  const [fill, setFill] = useState(0);
  const [reached, setReached] = useState(0);

  // One passive listener drives both the line fill and the step dots; the probe is the middle of the viewport.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = list.current;
      if (!el) return;
      const probe = window.innerHeight / 2;
      setFill(Math.max(0, Math.min(probe - el.getBoundingClientRect().top, el.clientHeight)));
      const dots = el.querySelectorAll<HTMLElement>("[data-step-dot]");
      setReached([...dots].filter((dot) => dot.getBoundingClientRect().top < probe).length);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Line sits on the start side on small screens and in the center from lg up.
  const linePosition = "absolute top-0 w-2 rounded-full start-4 lg:start-auto lg:left-1/2 lg:-translate-x-1/2";

  return (
    <section className={cn(maxWidth, paddingBottom, paddingTop, paddingX)}>
      <ul ref={list} className={cn(gap, "relative flex flex-col")}>
        <span aria-hidden className={cn(linePosition, "bottom-0 bg-gray-200")} />
        <span
          aria-hidden
          className={cn(linePosition, "bg-blue-500 motion-safe:transition-[height] motion-safe:duration-150")}
          style={{ height: fill }}
        />
        {items?.map((item, index) => (
          <ScrollingSectionItem key={item.id} index={index} total={items.length} reached={index < reached} {...item} />
        ))}
      </ul>
    </section>
  );
};

export default ScrollingSection;

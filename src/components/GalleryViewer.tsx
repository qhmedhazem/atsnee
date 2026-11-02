"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

export type GalleryImage = { url: string; thumb: string; alt: string };

const STRINGS = {
  en: { prev: "Previous image", next: "Next image", thumb: (n: number) => `Show image ${n}` },
  ar: { prev: "الصورة السابقة", next: "الصورة التالية", thumb: (n: number) => `عرض الصورة ${n}` },
};

interface Props {
  images: GalleryImage[];
  initialIndex?: number;
  fallback?: ReactNode; // shown when there are no images
  className?: string;
  mainClassName?: string; // sizing of the main image area
  sizes?: string;
}

// Dark image viewer: main image, prev/next, "n / total", thumbnail strip, and arrow keys (mirrored in RTL).
// Mount it only while visible (e.g. inside an open dialog): the arrow keys listen on the window.
export default function GalleryViewer({ images, initialIndex = 0, fallback, className, mainClassName, sizes = "100vw" }: Props) {
  const t = STRINGS[useLocale()];
  const [index, setIndex] = useState(initialIndex);
  const total = images.length;
  const image = images[index];

  useEffect(() => {
    if (total < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const rtl = document.documentElement.dir === "rtl";
      setIndex((i) => (i + ((e.key === "ArrowRight") !== rtl ? 1 : -1) + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  return (
    <div className={cn("flex min-h-0 flex-col bg-[#0b1220]", className)}>
      <div className={cn("relative", mainClassName)}>
        {image ? <Image key={image.url} src={image.url} alt={image.alt} fill sizes={sizes} className="object-contain" /> : fallback}
        {total > 1 && (
          <>
            <NavButton label={t.prev} onClick={() => go(-1)} className="start-3">
              <ChevronLeft className="size-5 rtl:-scale-x-100" />
            </NavButton>
            <NavButton label={t.next} onClick={() => go(1)} className="end-3">
              <ChevronRight className="size-5 rtl:-scale-x-100" />
            </NavButton>
            <span className="absolute bottom-3 start-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-white tabular-nums rtl:translate-x-1/2">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t.thumb(i + 1)}
              aria-current={i === index}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                i === index ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-80"
              )}
            >
              <Image src={img.thumb} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavButton({ label, onClick, className, children }: { label: string; onClick: () => void; className: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-800 shadow hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
    >
      {children}
    </button>
  );
}

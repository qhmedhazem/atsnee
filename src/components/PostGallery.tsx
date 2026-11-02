"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import GalleryViewer, { GalleryImage } from "@/components/GalleryViewer";
import { useLocale } from "@/hooks/use-locale";

const STRINGS = {
  en: { open: (n: number) => `Open image ${n}`, close: "Close" },
  ar: { open: (n: number) => `فتح الصورة ${n}`, close: "إغلاق" },
};

type Item = GalleryImage & { cover: string };

// Photo grid; a tile opens a full-screen viewer at that photo.
export default function PostGallery({ images }: { images: Item[] }) {
  const t = STRINGS[useLocale()];
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <li key={img.url}>
            <button
              type="button"
              onClick={() => setOpenAt(i)}
              aria-label={t.open(i + 1)}
              className="group relative block aspect-square w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Image
                src={img.cover}
                alt={img.alt}
                fill
                sizes="(min-width: 960px) 25vw, (min-width: 720px) 33vw, 50vw"
                className="object-cover transition duration-500 motion-safe:group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>
      {openAt !== null && <Lightbox images={images} start={openAt} closeLabel={t.close} onClose={() => setOpenAt(null)} />}
    </>
  );
}

function Lightbox({ images, start, closeLabel, onClose }: { images: Item[]; start: number; closeLabel: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
    document.documentElement.classList.add("overflow-hidden");
    return () => document.documentElement.classList.remove("overflow-hidden");
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()} // backdrop
      className="m-auto h-[90vh] w-[calc(100%-2rem)] max-w-[1280px] overflow-hidden rounded-[20px] bg-[#0b1220] p-0 backdrop:bg-slate-900/70 backdrop:backdrop-blur-sm max-[767px]:h-dvh max-[767px]:w-full max-[767px]:max-w-none max-[767px]:rounded-none"
    >
      <button
        type="button"
        onClick={() => ref.current?.close()}
        aria-label={closeLabel}
        className="absolute end-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <X className="size-5" />
      </button>
      <GalleryViewer images={images} initialIndex={start} className="h-full" mainClassName="flex-1" sizes="(min-width: 1280px) 1280px, 100vw" />
    </dialog>
  );
}

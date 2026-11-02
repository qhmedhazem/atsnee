"use client";

import { cn } from "@/lib/utils";
import { Media } from "@/payload-types";

import React, { FC, useState } from "react";
import GallerySeeMore from "./GallerySeeMore";
import useMediaQuery from "@/hooks/use-media-query";
import GalleryImage from "./GalleryImage";
import ImageSlider from "../ImageSlider";

interface Props {
  photos: Media[];
}

const Gallery: FC<Props> = ({ photos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const openSlider = (index: number = 0) => {
    setInitialIndex(index);
    setIsOpen(true);
  };

  const closeSlider = () => {
    setIsOpen(false);
  };

  const isSmall = useMediaQuery("(max-width: 768px)");
  const showedImages = isSmall ? 1 : 2;
  const displayedPhotos =
    photos.length > showedImages ? photos.slice(0, showedImages) : photos;
  const remainingPhotos =
    photos.length > showedImages ? photos.slice(showedImages) : [];

  return (
    <div
      className={cn(
        "grid gap-2 w-full max-h-80",
        isSmall ? "grid-cols-2" : "grid-cols-3"
      )}
    >
      {displayedPhotos.map((photo, idx) => (
        <GalleryImage
          key={idx}
          src={photo.sizes?.og?.url || ""}
          alt={photo.alt || "Participation Image " + idx + 1}
          onClick={() => openSlider(idx)}
        />
      ))}
      {remainingPhotos.length > 0 && (
        <GallerySeeMore
          remainingImages={remainingPhotos}
          onClick={() => openSlider(showedImages)}
        />
      )}

      {isOpen && (
        <ImageSlider
          images={photos}
          isOpen={isOpen}
          onClose={closeSlider}
          initialIndex={initialIndex}
        />
      )}
    </div>
  );
};

export default Gallery;

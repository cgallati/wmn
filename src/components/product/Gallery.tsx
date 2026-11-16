import type { Media as MediaType, Product } from "@/payload-types";

import { Media } from "@/components/Media";
import React from "react";

type Props = {
  gallery: NonNullable<Product["gallery"]>;
  /** Responsive `sizes` hint for the main image. */
  sizes?: string;
};

/**
 * The print at its true aspect ratio. Any additional images follow, stacked, never cropped.
 * No content notice here: a visitor on a print page chose to open it.
 */
export const Gallery: React.FC<Props> = ({ gallery, sizes }) => {
  const images = gallery
    .map((item) => item.image)
    .filter(
      (image): image is MediaType =>
        typeof image === "object" && image !== null,
    );

  return (
    <div className="flex flex-col gap-8">
      {images.map((image, i) => (
        <Media
          key={`${image.id}-${i}`}
          className="w-full"
          imgClassName="h-auto w-full object-contain"
          priority={i === 0}
          resource={image}
          size={sizes}
        />
      ))}
    </div>
  );
};

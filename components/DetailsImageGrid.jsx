import React from "react";
import { DetailsGrid } from "./ui/details-grid";
import { urlForImage } from "@/sanity/lib/image";

export function DetailsImageGridLayout({ photos }) {
  const cards = photos.slice(0, 4).map((photo, index) => ({
    id: index + 1,
    content: (
      <div className="flex flex-col items-center">
        <p className="font-bold text-4xl text-white">House {index + 1}</p>
        <p className="font-normal text-base text-white"></p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          This is a description for house {index + 1}.
        </p>
      </div>
    ),
    thumbnail: urlForImage(photo),
  }));

  return (
    <div className="flex justify-center">
      <DetailsGrid cards={cards} />
    </div>
  );
}

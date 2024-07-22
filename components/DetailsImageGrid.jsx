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
        <p className="font-sm text-base text-red-400 pb-[30vh]">
          Please click on the image gallery again to exit view.
        </p>
      </div>
    ),
    className: index % 2 === 0 ? "md:col-span-3" : "col-span-2",
    thumbnail: urlForImage(photo),
  }));

  return (
    <div className="h-full px-[15%] pb-[15%] w-max-screen">
      <DetailsGrid cards={cards} />
    </div>
  );
}

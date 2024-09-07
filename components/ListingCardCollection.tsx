import React from "react";
import { urlForImage } from "@/sanity/lib/image";
import { Listing, Property, Developer } from "@/types";
import { DirectionAwareHover } from "./ui/direction-aware-hover-sm";

interface ListingCardCollectionProps {
  listings: Listing[];
  properties: Property[];
  // developers: Developer[];
}

const ListingCardCollection: React.FC<ListingCardCollectionProps> = ({
  listings,
  properties,
  // developers,
}) => {
  return (
    <div className="flex justify-center pt-0">
      <div className="flex w-screen lg:w-[1320px]">
        {/* First column (blank, taking 1/3 width) */}
        <div className="lg:block bg-blue-500 ipad-screen:w-[300px] w-[0px] text-center">
          Placeholder for filter section
        </div>

        {/* Second column (listings, taking 2/3 width) */}
        <div className="ipad-screen:w-full w-screenrounded-lg overflow-hidden bg-red-500 ipad-screen:pl-[24px] pl-0 flex justify-end items-end text-right 3xl:ml-0">
          <div className="flex grid grid-cols-1 ipad-screen:grid-cols-1 ipad-screen:gap-[24px] lg:grid-cols-3 lg:gap-2 3xl:gap-[12px] gap-[24px]">
            {listings.map((listing, index) => {
              const property =
                properties.find((prop) => prop._id === listing.property._ref) ||
                properties[0];

              return (
                <div
                  key={index}
                  onClick={() => {
                    // handlePropertyClick(listing._id);
                  }}
                  className="lg:ml-0 ipad-screen:ml-12 ipad-screen:px-0 px-5 bg-black relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                >
                  <DirectionAwareHover
                    imageUrl={urlForImage(listing.listingHero)}
                    className=""
                  >
                    <span className="font-semibold text-sm">
                      Price: {listing.price}M Baht
                    </span>
                  </DirectionAwareHover>
                  <div className="w-[320px] mt-2 p-2 bg-white rounded-lg mb-8">
                    <div className="flex pt-2">
                      <span className="pr-6 flex">
                        <img src="/icons/bedroom.png" className="pr-2" />
                        {listing.bedroom}
                      </span>
                      <span className="pr-6 flex">
                        <img src="/icons/meter.png" className="pr-2" />
                        {listing.size}
                      </span>
                      <span className="pr-6 flex">
                        <img src="/icons/shower.png" className="pr-2" />
                        {listing.bathroom}
                      </span>
                      <span className="pr-6 flex">
                        <img src="/icons/floor.png" className="pr-2" />
                        {listing.floor}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCardCollection;

import React from "react";
import { urlForImage } from "@/sanity/lib/image";
import { Listing, Property, Developer } from "@/types";
import { DirectionAwareHover } from "./ui/direction-aware-hover";

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
    <div className="w-full flex justify-center pt-3 pb-12 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.map((listing, index) => {
          const property =
            properties.find((prop) => prop._id === listing.property._ref) ||
            properties[0];

          // const developer =
          //   developers.find((dev) => dev._id === property.developer._ref) ||
          //   developers[0];

          return (
            <div
              key={index}
              onClick={() => {
                // handlePropertyClick(listing._id);
              }}
              className="relative inline-block mb-4 md:mb-0 group"
            >
              <DirectionAwareHover imageUrl={urlForImage(listing.listingHero)}>
                <span className="font-semibold text-sm">
                  Price: {listing.price}M Baht
                </span>
              </DirectionAwareHover>
              <div className="mt-2 p-2 bg-white rounded-lg mb-8">
                {/* <span className="flex items-center text-lg font-semibold">
                  {listing.listingName}
                  <img
                    src={urlForImage(developer.profileIcon)}
                    className="w-8 h-8 ml-1"
                  />
                </span> */}
                {/* <p className="font-normal text-sm">$1299 / night</p> */}
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
  );
};

export default ListingCardCollection;

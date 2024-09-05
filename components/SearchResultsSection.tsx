import React from "react";
import { Listing, Property } from "@/types";
import { useRouter } from "next/navigation";
import { urlForImage } from "@/sanity/lib/image";
import { useState } from "react";

interface SearchResultsSectionProps {
  filteredListings: Listing[];
  filteredProperties: Property[];
  isActive: boolean; // Prop to manage the active state
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  filteredListings,
  filteredProperties,
  isActive,
}) => {
  const router = useRouter();

  console.log(isActive);

  const handleListingClick = (slug: string) => {
    router.push(`/ListingDetails/${slug}`);
  };

  const handlePropertyClick = (slug: string) => {
    router.push(`/Details/${slug}`);
  };

  // Inline style for opacity
  const sectionStyle = {
    opacity: isActive ? 1 : 0,
  };

  return (
    <div style={sectionStyle} className="search-section">
      <div className="mt-2 w-screen w-[1300px] h-screen relative mx-auto max-h-[0px]">
        <div className="rounded-3xl shadow-lg h-[500px] overflow-scroll bg-gray-100 ">
          {filteredListings.length === 0 && filteredProperties.length === 0 ? (
            <div className="bg-red-500 w-[300px] h-[200px] mx-auto my-16">
              {/* Red block for testing when there are no listings or properties */}
              <span className="text-white text-center block py-16">
                Placeholder
              </span>
            </div>
          ) : (
            <div className="flex space-x-8">
              {/* Listings Column */}
              <div className="w-1/3">
                <h2 className="text-center font-semibold text-gray-600 my-8">
                  Listings
                </h2>
                {filteredListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="flex items-center space-x-8 py-4 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer pl-8 text-gray-600 hover:text-black mb-4"
                    onClick={() => handleListingClick(listing._id)}
                  >
                    <img src={urlForImage(listing.listingHero)} width={140} />
                    <span key={listing._id}>
                      <span className="text-gray-500 text-xs items-center pr-3 ">
                        <i>Listing:</i>
                      </span>
                      {listing.listingName}
                    </span>
                  </div>
                ))}
              </div>

              {/* Properties Column */}
              <div className="w-1/3">
                <h2 className="text-center font-semibold text-gray-600 my-8">
                  Properties
                </h2>
                {filteredProperties.map((property) => (
                  <div
                    key={property._id}
                    className="flex items-center space-x-8 py-4 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer pl-8 text-gray-600 hover:text-black mb-4"
                    onClick={() => handlePropertyClick(property._id)}
                  >
                    <img src={urlForImage(property.propertyHero)} width={140} />
                    <div className="flex flex-col">
                      <span key={property._id}>
                        {/* <span className="text-gray-500 text-xs items-center pr-3 ">
                        <i>Property:</i>
                      </span> */}
                        <b>{property.title}</b>
                      </span>
                      <span className="pt-2">
                        Price:{" "}
                        <i>
                          {property.minPrice}M - {property.maxPrice}M THB
                        </i>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty Column for Later */}
              <div className="w-1/3">
                <h2 className="text-center font-semibold text-gray-600 my-8">
                  Empty Column
                </h2>
                <div className="flex items-center justify-center h-full text-gray-400">
                  {/* Placeholder content */}
                  <span>No data yet</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsSection;

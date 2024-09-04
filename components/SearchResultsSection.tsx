import React from "react";
import { Listing, Property, Developer } from "@/types";
import { useRouter } from "next/navigation";

interface SearchResultsSectionProps {
  filteredListings: Listing[];
  filteredProperties: Property[];
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  filteredListings,
  filteredProperties,
}) => {
  const router = useRouter();

  const handleListingClick = (slug: String) => {
    router.push(`/ListingDetails/${slug}`);
  };

  const handlePropertyClick = (slug: String) => {
    router.push(`/Details/${slug}`);
  };

  return (
    <div>
      <div className="mt-2 w-screen relative max-w-xl mx-auto max-h-[0px]">
        <ul className="rounded-3xl shadow-lg max-h-[160px] overflow-scroll">
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-gray-100 hover:bg-gray-300 hover:cursor-pointer pl-8 py-2 text-gray-600 hover:text-black"
              onClick={() => {
                handleListingClick(listing._id);
              }}
            >
              <span key={listing._id}>
                <span className="text-gray-500 text-xs items-center pr-3">
                  <i>Listing:</i>
                </span>
                {listing.listingName}
              </span>
            </div>
          ))}
          {filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-gray-100 hover:bg-gray-300 hover:cursor-pointer pl-8 py-2 text-gray-600 hover:text-black"
              onClick={() => {
                handlePropertyClick(property.slug.current);
              }}
            >
              <span key={property._id}>
                <span className="text-gray-500 text-xs items-center pr-3">
                  <i>Property:</i>
                </span>
                {property.title}
              </span>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResultsSection;

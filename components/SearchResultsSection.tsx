import React from "react";
import { Listing, Property } from "@/types";
import { useRouter } from "next/navigation";
import { urlForImage } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  const [filteredListingsState, setFilteredListingsState] =
    useState<Listing[]>(filteredListings);

  const [filteredPropertiesState, setFilteredPropertiesState] =
    useState<Property[]>(filteredProperties);

  console.log(isActive);

  const handleListingClick = (slug: string) => {
    router.push(`/ListingDetails/${slug}`);
  };

  const handlePropertyClick = (slug: string) => {
    router.push(`/Details/${slug}`);
  };

  // Effect to filter listings when any filter changes
  useEffect(() => {
    let updatedListings = [...filteredListings];
    let updatedProperties = [...filteredProperties];

    // Filter by bedroom
    if (bedroomFilter) {
      updatedListings = updatedListings.filter(
        (listing) => listing?.bedroom === bedroomFilter
      );
    }

    // Filter by location
    if (locationFilter) {
      updatedListings = updatedListings.filter(
        (listing) =>
          listing?.description
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase()) ||
          listing?.listingName
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase())
      );
      updatedProperties = updatedProperties.filter(
        (property) =>
          property?.title
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase()) ||
          property?.description
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase())
      );
    }

    // Filter by max price
    if (maxPriceFilter) {
      updatedListings = updatedListings.filter(
        (listing) => Number(listing?.price) <= Number(maxPriceFilter)
      );
    }

    // Filter by min price
    if (minPriceFilter) {
      updatedListings = updatedListings.filter(
        (listing) => Number(listing?.price) >= Number(minPriceFilter)
      );
    }

    // Filter by price range
    if (maxPriceFilter && minPriceFilter) {
      updatedListings = updatedListings.filter(
        (listing) =>
          listing?.price >= minPriceFilter && listing?.price <= maxPriceFilter
      );
    }

    setFilteredListingsState(updatedListings); // Update filtered listings
    setFilteredPropertiesState(updatedProperties);

    // Store the filtered data in localStorage
    localStorage.setItem(
      "filteredListingsState",
      JSON.stringify(updatedListings)
    );
    localStorage.setItem(
      "filteredPropertiesState",
      JSON.stringify(updatedProperties)
    );
  }, [
    bedroomFilter,
    locationFilter,
    minPriceFilter,
    maxPriceFilter,
    filteredListings,
  ]);
  useEffect(() => {
    console.log("Filtering listings...");
    console.log("Max Price Filter:", maxPriceFilter);
    filteredListings.forEach((listing) => {
      console.log("Listing Price:", listing.price);
    });

    // ... Rest of the filtering logic
  }, [maxPriceFilter, filteredListings]);

  // Inline style for opacity
  const sectionStyle = {
    opacity: isActive ? 1 : 0,
  };

  return (
    <div style={sectionStyle} className="search-section">
      <div className="hidden ipad-screen:hidden lg:block mt-2 w-[1250px] h-screen relative mx-auto max-h-[0px]">
        <div className="rounded-3xl shadow-lg h-[500px] overflow-scroll py-8 bg-gray-100 ">
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
                <h2 className="text-center font-semibold text-gray-600 mb-8">
                  Listings
                </h2>
                {filteredListingsState.map((listing) => (
                  <div
                    key={listing._id}
                    className="flex items-center space-x-8 py-3 hover:bg-gray-200 hover:cursor-pointer pl-8 text-gray-600 hover:text-black mb-4"
                    onClick={() => handleListingClick(listing._id)}
                  >
                    <img src={urlForImage(listing.listingHero)} width={140} />
                    <span key={listing._id}>
                      <span className="text-gray-500 text-xs items-center pr-3 ">
                        <i>Listing:</i>
                      </span>
                      <h1>{listing.listingName}</h1>
                      {listing.price}M
                    </span>
                  </div>
                ))}
              </div>

              {/* Properties Column */}
              <div className="w-1/3">
                <h2 className="text-center font-semibold text-gray-600 mb-8">
                  Properties
                </h2>
                {filteredPropertiesState.map((property) => (
                  <div
                    key={property._id}
                    className="flex items-center space-x-8 py-3 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer pl-8 text-gray-600 hover:text-black mb-4"
                    onClick={() => handlePropertyClick(property.slug.current)}
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
                  Filters
                </h2>
                <div
                  className="flex justify-center text-gray-400 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Placeholder content */}
                  <Select
                    onValueChange={(value) => setBedroomFilter(Number(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a bedroom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Bedroom</SelectLabel>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedroom</SelectItem>
                        <SelectItem value="3">3 Bedroom</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="flex justify-center text-gray-400 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Placeholder content */}
                  <Select onValueChange={(value) => setLocationFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Bedroom</SelectLabel>
                        <SelectItem value="Siam">Siam</SelectItem>
                        <SelectItem value="Asoke">Asoke</SelectItem>
                        <SelectItem value="Phrom Phong">Phrom Phong</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="flex justify-center text-gray-400 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Placeholder content */}
                  <Select
                    onValueChange={(value) => setMinPriceFilter(Number(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Min Price (THB)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Price in THB</SelectLabel>
                        <SelectItem value="0">0 Million</SelectItem>
                        <SelectItem value="10">10 Million</SelectItem>
                        <SelectItem value="20">20 Million</SelectItem>
                        <SelectItem value="30">30 Million</SelectItem>
                        <SelectItem value="40">40 Million</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="flex justify-center text-gray-400 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Placeholder content */}
                  <Select
                    onValueChange={(value) => setMaxPriceFilter(Number(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Max Price (THB)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Price in THB</SelectLabel>
                        <SelectItem value="10">10 Million</SelectItem>
                        <SelectItem value="20">20 Million</SelectItem>
                        <SelectItem value="30">30 Million</SelectItem>
                        <SelectItem value="40">40 Million</SelectItem>
                        <SelectItem value="50">50 Million</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-center items-center pt-4">
                  <Button>Clear all Filters</Button>
                </div>
                <div className="flex justify-center items-center pt-2">
                  <Button>See all Results</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:hidden mt-2 w-screen h-screen relative max-w-xl mx-auto max-h-[0px]">
        <ul className="rounded-3xl shadow-lg max-h-[160px] overflow-scroll">
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-gray-100 hover:bg-gray-300 hover:cursor-pointer pl-8 py-2 text-gray-600 hover:text-black"
              onClick={() => handleListingClick(listing._id)}
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
              onClick={() => handlePropertyClick(property.slug.current)}
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

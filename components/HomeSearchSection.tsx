import React from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { Listing, Property } from "@/types";

interface BrowseCarouselProps {
  listings: Listing[];
  properties: Property[];
}

const HomeSearchSection: React.FC<BrowseCarouselProps> = ({
  listings,
  properties,
}) => {
  const placeholders = [
    "Listings around Phra Khanong",
    "Properties near Chiang Mai",
    "Close to to BTS",
    "Property RHYTHM CHaroenkrung Pavillion",
  ];

  // Define all keywords for different filters
  const listingPropertyKeywords = ["on", "about", "for", "in"];

  const addressInfoKeywords = [
    "close to",
    "near",
    "around",
    "area",
    "district",
    "province",
  ];

  // Function to determine if a value contains any keywords from the provided list
  const containsKeywords = (value: string, keywords: string[]): boolean => {
    return keywords.some((keyword) => value.toLowerCase().includes(keyword));
  };

  // Define filter function for listing and property names
  const filterByListingPropertyNames = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    console.log("INITIATING FILTER BY LISTING AND PROPERTY NAMES");

    let cleanedValue = value;

    // Loop through each keyword to find its position in the value
    for (const keyword of listingPropertyKeywords) {
      const keywordIndex = cleanedValue.toLowerCase().indexOf(keyword);
      if (keywordIndex !== -1) {
        // Remove everything before and including the keyword
        cleanedValue = cleanedValue.slice(keywordIndex + keyword.length).trim();
        break; // Exit the loop once a keyword is found and cleaned
      }
    }

    const filteredListings = listings.filter((listing) =>
      listing.listingName.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    const filteredProperties = properties.filter((property) =>
      property.title.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    return { filteredListings, filteredProperties };
  };

  // Define filter function for address-related queries
  const filterByAddressInfo = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    console.log("INITIATING FILTER BY ADDRESS INFO");

    let cleanedValue = value;

    // Loop through each keyword to find its position in the value
    for (const keyword of addressInfoKeywords) {
      const keywordIndex = cleanedValue.toLowerCase().indexOf(keyword);
      if (keywordIndex !== -1) {
        // Remove everything before and including the keyword
        cleanedValue = cleanedValue.slice(keywordIndex + keyword.length).trim();
        break; // Exit the loop once a keyword is found and cleaned
      }
    }

    const filteredListings = listings.filter((listing) =>
      listing.description?.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    const filteredProperties = properties.filter((property) =>
      property.description.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    return { filteredListings, filteredProperties };
  };

  // Perform search based on value and filters
  const performSearch = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ) => {
    const isListingSearch = containsKeywords(value, listingPropertyKeywords);
    const isAddressSearch = containsKeywords(value, addressInfoKeywords);

    let filteredListings: Listing[] = [];
    let filteredProperties: Property[] = [];

    if (isListingSearch && !isAddressSearch) {
      const result = filterByListingPropertyNames(value, listings, properties);
      filteredListings = result.filteredListings;
      filteredProperties = result.filteredProperties;
    }

    if (isAddressSearch && !isListingSearch) {
      const result = filterByAddressInfo(value, listings, properties);
      filteredListings = result.filteredListings;
      filteredProperties = result.filteredProperties;
    }

    if (isListingSearch && isAddressSearch) {
      // Handle cases where both types of keywords are present
      const result = filterByListingPropertyNames(value, listings, properties);
      filteredListings = result.filteredListings;
      filteredProperties = result.filteredProperties;
      const resultFromAddressInfoFilter = filterByAddressInfo(
        value,
        listings,
        properties
      );
    }

    return { filteredListings, filteredProperties };
  };

  // Handle input change and perform search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value); // Log the input value

    // Perform the search and get filtered results
    const { filteredListings, filteredProperties } = performSearch(
      value,
      listings,
      properties
    );

    console.log(
      "Filtered Listings: ",
      filteredListings.map((listing) => listing.listingName)
    );

    console.log(
      "Filtered Properties: ",
      filteredProperties.map((property) => property.title)
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[545px] w-[1320px] bg-red-300">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask US Anything at Mahar-Vertex
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default HomeSearchSection;

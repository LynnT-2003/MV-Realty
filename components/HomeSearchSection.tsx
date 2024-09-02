"use client";
import React, { useState, useEffect } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { Listing, Property } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const filters = [
  "Bedrooms",
  "Min Price",
  "Max Price",
  "Location",
  "Buy/Rent",
] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, any[]> = {
  Bedrooms: ["1", "2", "3"],
  "Min Price": [0, 10, 20, 30, 40],
  "Max Price": [10, 20, 30, 40, 50, 999],
  Location: ["Siam", "Asoke", "Ratchathewi", "Phrom Phong"],
  "Buy/Rent": ["Buy", "Rent"],
};

interface BrowseCarouselProps {
  listings: Listing[];
  properties: Property[];
}

const HomeSearchSection: React.FC<BrowseCarouselProps> = ({
  listings,
  properties,
}) => {
  const router = useRouter();

  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  const [bedroomFilter, setBedroomFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [transactionOption, setTransactionOption] = useState(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, any>>({
    Bedrooms: "",
    "Min Price": 0,
    "Max Price": 0,
    Location: "",
    "Buy/Rent": "",
  });

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  useEffect(() => {
    console.log("Selected Values: ", selectedValues);
  }, [selectedValues]);

  const handleListingClick = (slug: String) => {
    router.push(`/ListingDetails/${slug}`);
  };

  const handlePropertyClick = (slug: String) => {
    router.push(`/Details/${slug}`);
  };

  const provinceData = [
    "Phrom Phong",
    "Siam",
    "Asoke",
    "Sukhumvit",
    "Phra Khanong",
    "Thonglor",
    "Ekkamai",
    "Silom",
    "Chatuchak",
    "Ratchada",
    "Sathorn",
  ];

  const placeholders = [
    "I want to know more info on LIFE Asoke Rama ..",
    "Details about The Address - 2BR ?",
    "Listings around Phra Khanong ..",
    "Properties near Chiang Mai ..",
    "Any listing close to BTS ?",
  ];

  // Define all keywords for different filters
  const listingPropertyKeywords = [" on", " about", " for", " in"];

  const addressInfoKeywords = [
    "close to",
    "near",
    "around",
    "area",
    "district",
    "province",
  ];

  const searchOnlyPropertiesKeywords = ["properties", "property"];
  const searchOnlyListingsKeywords = ["listings", "listing"];

  // Function to determine if a value contains any keywords from the provided list
  const containsKeywords = (value: string, keywords: string[]): boolean => {
    return keywords.some((keyword) => value.toLowerCase().includes(keyword));
  };

  // Define default filter function (Get and Match listing + property names)
  const filterDefaultNameTitle = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    const filteredListings = listings.filter((listing) =>
      listing.description?.toLowerCase().includes(value.toLowerCase())
    );

    const filteredProperties = properties.filter((property) =>
      property.description?.toLowerCase().includes(value.toLowerCase())
    );

    return { filteredListings, filteredProperties };
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

    if (cleanedValue.length === 0) {
      return { filteredListings: [], filteredProperties: [] };
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

    if (cleanedValue.length === 0) {
      return { filteredListings: [], filteredProperties: [] };
    }

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
    const isSearchOnlyProperties = containsKeywords(
      value,
      searchOnlyPropertiesKeywords
    );
    const issearchonlyListings = containsKeywords(
      value,
      searchOnlyListingsKeywords
    );

    let filteredListings: Listing[] = [];
    let filteredProperties: Property[] = [];

    if (isListingSearch && !isAddressSearch) {
      const result = filterByListingPropertyNames(value, listings, properties);
      if (isSearchOnlyProperties) {
        filteredListings = [];
        filteredProperties = result.filteredProperties;
        return { filteredListings, filteredProperties };
      } else if (issearchonlyListings) {
        filteredListings = result.filteredListings;
        filteredProperties = [];
        return { filteredListings, filteredProperties };
      } else {
        filteredListings = result.filteredListings;
        filteredProperties = result.filteredProperties;
      }
    }

    if (isAddressSearch && !isListingSearch) {
      const result = filterByAddressInfo(value, listings, properties);
      if (isSearchOnlyProperties) {
        filteredListings = [];
        filteredProperties = result.filteredProperties;
        return { filteredListings, filteredProperties };
      } else if (issearchonlyListings) {
        filteredListings = result.filteredListings;
        filteredProperties = [];
        return { filteredListings, filteredProperties };
      } else {
        filteredListings = result.filteredListings;
        filteredProperties = result.filteredProperties;
      }
    }

    if (isListingSearch && isAddressSearch) {
      // Handle cases where both types of keywords are present
      const result = filterByListingPropertyNames(value, listings, properties);
      if (isSearchOnlyProperties) {
        filteredListings = [];
        filteredProperties = result.filteredProperties;
        return { filteredListings, filteredProperties };
      } else if (issearchonlyListings) {
        filteredListings = result.filteredListings;
        filteredProperties = [];
        return { filteredListings, filteredProperties };
      } else {
        filteredListings = result.filteredListings;
        filteredProperties = result.filteredProperties;
      }
    }

    if (!isListingSearch && !isAddressSearch && value != "") {
      const result = filterDefaultNameTitle(value, listings, properties);
      filteredListings = result.filteredListings;
      filteredProperties = result.filteredProperties;
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

    // Update state with filtered results
    setFilteredListings(filteredListings);
    setFilteredProperties(filteredProperties);

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
    <div className="flex flex-col items-center justify-center h-[545px] w-[1320px] bg-blue-200">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask US Anything at Mahar-Vertex
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      <div className="mt-2 w-full relative max-w-xl mx-auto max-h-[0px]">
        <ul className="rounded-3xl shadow-lg max-h-[160px] overflow-scroll">
          {filteredListings.map((listing) => (
            <div
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

      <div className="flex justify-center items-center w-max-[75%] mt-24">
        <div className="bg-red-100 max-sm:hidden inline-flex justify-center items-center shadow-lg md:space-x-4 md:text-base sm:space-x-5 sm:text-lg space-x-8 text-xs py-2 px-10 bg-white rounded">
          {filters.map((filter) => (
            <div key={filter} className="md:px-0">
              <Popover
                open={openFilter === filter}
                onOpenChange={(isOpen) => setOpenFilter(isOpen ? filter : null)}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openFilter === filter}
                    className="w-[200px] justify-between"
                  >
                    {selectedValues[filter] || filter}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder={`Search ${filter}...`} />
                    <CommandList>
                      <CommandEmpty>No {filter} found.</CommandEmpty>
                      <CommandGroup>
                        {options[filter].map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={() => handleSelect(filter, option)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedValues[filter] === option
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {filter === "Bedrooms"
                              ? `${option}-Bedroom`
                              : filter === "Min Price" || filter === "Max Price"
                                ? `${option}M Baht`
                                : option}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ))}
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default HomeSearchSection;

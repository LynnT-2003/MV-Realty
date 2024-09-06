"use client";
import React, { useState, useEffect, useRef } from "react";
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

import SearchResultsSection from "./SearchResultsSection";
import SearchResultsPage from "@/app/SearchResultsPage/page";

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
  onSearchSectionClick: () => void;
  searchActionClicked: boolean;
}

const HomeSearchSection: React.FC<BrowseCarouselProps> = ({
  listings,
  properties,
  onSearchSectionClick,
  searchActionClicked,
}) => {
  const router = useRouter();

  (
      onSearchSectionClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
      searchSectionClickedInternal?: (
        event: React.MouseEvent<HTMLDivElement>
      ) => void
    ) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (onSearchSectionClick) onSearchSectionClick(event);
      if (searchSectionClickedInternal) searchSectionClickedInternal(event);
    };

  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  const [bedroomFilter, setBedroomFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [transactionOption, setTransactionOption] = useState(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Add these event handlers
  const handleInputFocus = () => {
    setIsSearchActive(true);
  };
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

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

  const handleFilter = () => {
    console.log("Filter Submit clicked");

    // Construct the query string
    const query = new URLSearchParams({
      bedrooms: selectedValues.Bedrooms ?? "",
      minprice: selectedValues["Min Price"] ?? "",
      maxprice: selectedValues["Max Price"] ?? "",
      location: selectedValues.Location ?? "",
      buyRent: selectedValues["Buy/Rent"] ?? "",
    }).toString();

    // Navigate to FilterResultsPage with query parameters
    router.push(`/FilterResultsPage?${query}`);
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

  //////////////////////////////////////////////////////////////////////////////

  const placeholders = [
    "Any listing close to BTS ?",
    "Close to MRT Hua Lamphong ?",
    "Listings around BTS Phrom Phong ?",
    "Listings around BTS with 2 bathroom ?",
    "2 Bedroom near BTS ?",
  ];

  // Define all keywords for different filters
  const bedroomInfoKeywords = ["bed", "bedrooms", "bedroom", "-bedroom"];
  const bathroomInfoKeywords = ["bath", "bathrooms", "bathroom", "-bathroom"];

  const listingPropertyKeywords = [" on", " about", " for", " in"];

  const developerInfoKeywords = [
    "by",
    "from",
    "developed by",
    "developed from",
  ];

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
    // Filter listings by matching the cleaned value with their names
    const filteredListings = listings.filter((listing) =>
      [listing.listingName].some((listingField) =>
        listingField.toLowerCase().includes(value.toLowerCase())
      )
    );

    // Filter properties by matching the cleaned value with their descriptions or titles
    const filteredProperties = properties.filter((property) =>
      [property.title, property.description].some((propertyField) =>
        propertyField.toLowerCase().includes(value.toLowerCase())
      )
    );

    return { filteredListings, filteredProperties };
  };

  // Define filter function for listing and property names
  // const filterByListingPropertyNames = (
  //   value: string,
  //   listings: Listing[],
  //   properties: Property[]
  // ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
  //   console.log("INITIATING FILTER BY LISTING AND PROPERTY NAMES");

  //   let cleanedValue = value;

  //   // Loop through each keyword to find its position in the value
  //   for (const keyword of listingPropertyKeywords) {
  //     const keywordIndex = cleanedValue.toLowerCase().indexOf(keyword);
  //     if (keywordIndex !== -1) {
  //       // Remove everything before and including the keyword
  //       cleanedValue = cleanedValue.slice(keywordIndex + keyword.length).trim();
  //       break; // Exit the loop once a keyword is found and cleaned
  //     }
  //   }

  //   if (cleanedValue.length === 0) {
  //     return { filteredListings: [], filteredProperties: [] };
  //   }

  //   const filteredListings = listings.filter((listing) =>
  //     listing.listingName.toLowerCase().includes(cleanedValue.toLowerCase())
  //   );

  //   const filteredProperties = properties.filter((property) =>
  //     property.title.toLowerCase().includes(cleanedValue.toLowerCase())
  //   );

  //   return { filteredListings, filteredProperties };
  // };

  // Define filter function for address-related queries
  const filterByAddressInfo = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    console.log("INITIATING FILTER BY ADDRESS INFO");

    let cleanedValue = value;

    // Create a regular expression to capture the word/phrase after the keyword
    const addressRegex = new RegExp(
      `(?:${addressInfoKeywords.join("|")})\\s+(\\w+)`, // Match the keyword, then capture the word after it
      "i"
    );

    // Match the value against the regex
    const match = cleanedValue.match(addressRegex);

    if (match && match[1]) {
      // If a match is found, cleanedValue becomes the word after the keyword
      cleanedValue = match[1]; // Capture the word after the keyword
      console.log("Cleaned Value:", cleanedValue);
    }

    // Filter listings and properties based on the cleanedValue
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

  // Define filter function for property bedroom
  const filterByListingsBedroom = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    console.log("INITIATING FILTER BY PROPERTY BEDROOM");

    let cleanedValue = value;

    // Create a regular expression to capture any keyword preceded by a word or number
    const bedroomRegex = new RegExp(
      `(\\w+)\\s+(${bedroomInfoKeywords.join("|")})`,
      "i"
    );

    const match = cleanedValue.match(bedroomRegex);

    if (match && match[1]) {
      // match[1] contains the word before the keyword
      cleanedValue = match[1];
      console.log(cleanedValue);
    }

    const filteredListings = listings.filter(
      (listing) =>
        // listing.description?.toLowerCase().includes(cleanedValue.toLowerCase())
        listing.bedroom === Number(cleanedValue)
    );

    const filteredProperties: Property[] = [];

    if (cleanedValue.length === 0) {
      return { filteredListings: [], filteredProperties: [] };
    }

    return { filteredListings, filteredProperties };
  };

  // Define filter function for property bathroom
  const filterByListingsBathroom = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    console.log("INITIATING FILTER BY PROPERTY BATHROOM");

    let cleanedValue = value;

    // Create a regular expression to capture any keyword preceded by a word or number
    const bathroomRegex = new RegExp(
      `(\\w+)\\s+(${bathroomInfoKeywords.join("|")})`,
      "i"
    );

    const match = cleanedValue.match(bathroomRegex);

    if (match && match[1]) {
      // match[1] contains the word before the keyword
      cleanedValue = match[1];
      console.log(cleanedValue);
    }

    const filteredListings = listings.filter(
      (listing) =>
        // listing.description?.toLowerCase().includes(cleanedValue.toLowerCase())
        listing.bathroom === Number(cleanedValue)
    );

    const filteredProperties: Property[] = [];

    if (cleanedValue.length === 0) {
      return { filteredListings: [], filteredProperties: [] };
    }

    return { filteredListings, filteredProperties };
  };

  // Define filter function for property facing side

  // Define filter function by max price

  // Perform search based on value and filters
  const performSearch = (
    value: string,
    listings: Listing[],
    properties: Property[]
  ): { filteredListings: Listing[]; filteredProperties: Property[] } => {
    // Determine which filters are active based on the value
    // const isListingSearch = containsKeywords(value, listingPropertyKeywords);
    const isAddressSearch = containsKeywords(value, addressInfoKeywords);
    const isBedroomSearch = containsKeywords(value, bedroomInfoKeywords);
    const isBathroomSearch = containsKeywords(value, bathroomInfoKeywords);
    const isSearchOnlyProperties = containsKeywords(
      value,
      searchOnlyPropertiesKeywords
    );
    const isSearchOnlyListings = containsKeywords(
      value,
      searchOnlyListingsKeywords
    );

    // Initialize filtered results
    let filteredListings: Listing[] = [...listings];
    let filteredProperties: Property[] = [...properties];

    // Apply filters sequentially

    // 1. Filter by bedroom if detected
    if (isBedroomSearch) {
      const bedroomResult = filterByListingsBedroom(
        value,
        listings,
        properties
      );
      filteredListings = filteredListings.filter((listing) =>
        bedroomResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        bedroomResult.filteredProperties.includes(property)
      );
    }

    // 2. Filter by bathroom if detected
    if (isBathroomSearch) {
      const bathroomResult = filterByListingsBathroom(
        value,
        listings,
        properties
      );
      filteredListings = filteredListings.filter((listing) =>
        bathroomResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        bathroomResult.filteredProperties.includes(property)
      );
    }

    // 3. Filter by listing/property names if detected
    // if (isListingSearch) {
    //   const listingResult = filterByListingPropertyNames(
    //     value,
    //     listings,
    //     properties
    //   );
    //   filteredListings = filteredListings.filter((listing) =>
    //     listingResult.filteredListings.includes(listing)
    //   );
    //   filteredProperties = filteredProperties.filter((property) =>
    //     listingResult.filteredProperties.includes(property)
    //   );
    // }

    // 4. Filter by address if detected
    if (isAddressSearch) {
      const addressResult = filterByAddressInfo(value, listings, properties);
      filteredListings = filteredListings.filter((listing) =>
        addressResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        addressResult.filteredProperties.includes(property)
      );
    }

    // 5. Default name/title search if no specific search type matches
    if (
      !isAddressSearch &&
      !isBedroomSearch &&
      !isBathroomSearch &&
      value !== ""
    ) {
      const defaultResult = filterDefaultNameTitle(value, listings, properties);
      filteredListings = filteredListings.filter((listing) =>
        defaultResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        defaultResult.filteredProperties.includes(property)
      );
    }

    // // Handle "only properties" or "only listings" filters
    // if (isSearchOnlyProperties) {
    //   filteredListings = []; // Clear listings, only properties should remain
    // } else if (isSearchOnlyListings) {
    //   filteredProperties = []; // Clear properties, only listings should remain
    // }

    return { filteredListings, filteredProperties };
  };

  // Handle input change and perform search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSearchActive(value.trim() !== "");
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

    // Navigate to /searchResultsPage
    router.push("/SearchResultsPage");
  };

  return (
    <div
      className={`flex flex-col items-center ipad-screen:h-[445px] h-[300px] w-[1320px] bg-blue-200 `}
    >
      <h2
        className={`mt-20 mb-10 sm:mb-16 text-xl text-center lg:text-5xl ipad-screen:text-4xl text-xl dark:text-white text-black ${searchActionClicked ? "opacity-50" : "opacity-100"}`}
      >
        Ask US Anything at Mahar-Vertex
      </h2>

      <div
        className="md:w-[600px] w-[85vw] search-section search-section-internal"
        onClick={onSearchSectionClick}
        onFocus={handleInputFocus}
      >
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <div className="z-10 w-screen">
        {searchActionClicked && (
          <SearchResultsSection
            filteredListings={filteredListings}
            filteredProperties={filteredProperties}
            isActive={isSearchActive}
          />
        )}
      </div>

      {/* Filter Component */}
      <div
        className={`flex justify-center items-center w-max-[75%] w-[500px] mt-12  ${searchActionClicked ? "opacity-50 inset-0" : "opacity-100"}`}
      >
        <div className="bg-red-100 max-sm:hidden inline-flex justify-center items-center shadow-lg space-x-1 py-3 px-3 bg-white rounded">
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
                    className="flex justify-between text-right pr-4 w-full"
                  >
                    <span className="flex-1 text-left">
                      {selectedValues[filter] || filter}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 lg:ml-10 ipad-screen:ml-2" />
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
          <Button
            onClick={() => {
              handleFilter();
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeSearchSection;

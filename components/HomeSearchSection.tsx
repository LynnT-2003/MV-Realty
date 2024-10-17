"use client";
import React, { useState, useEffect, useRef } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { UnitType, Property, Listing } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners"; // Import spinner

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
import { fetchListingsByPropertyId } from "@/services/ListingServices";
import property from "@/sanity/schemas/property";

const filters = [
  "Bedrooms",
  "Min Price",
  "Max Price",
  "Location",
  // "Buy/Rent",
] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, any[]> = {
  Bedrooms: ["1", "2", "3"],
  "Min Price": [0, 10, 20, 30, 40],
  "Max Price": [10, 20, 30, 40, 50, 999],
  Location: ["Siam", "Asoke", "Ratchathewi", "Phrom Phong"],
  // "Buy/Rent": ["Buy", "Rent"],
};

// Function to create the 2D array
const createPropertieswithUnitTypes = (
  unitTypes: UnitType[],
  properties: Property[]
): Array<[Property, UnitType[]]> => {
  // Step 1: Create a map of property _id -> listings
  const propertyUnitTypesMap: { [propertyId: string]: UnitType[] } = {};

  unitTypes.forEach((unit) => {
    const propertyRef = unit.property._ref;
    console.log("Unit's property id", unit.property._ref);

    // Initialize array if this property is encountered for the first time
    if (!propertyUnitTypesMap[propertyRef]) {
      propertyUnitTypesMap[propertyRef] = [];
    }

    // Push the listing to the corresponding property
    propertyUnitTypesMap[propertyRef].push(unit);
  });

  // Step 2: Build the 2D array, but only include properties that have listings
  const propertiesWithUnitTypes: Array<[Property, UnitType[]]> = properties
    .map((property) => {
      const propertyUnitTypes = propertyUnitTypesMap[property._id] || [];
      return [property, propertyUnitTypes] as [Property, UnitType[]];
    })
    .filter(([_, propertyListings]) => propertyListings.length > 0); // Filter out properties with no listings

  return propertiesWithUnitTypes;
};

const createPropertiesWithListings = (
  listings: Listing[],
  properties: Property[]
): Array<[Property, Listing[]]> => {
  // Step 1: Create a map of property _id -> listings
  const propertyListingsMap: { [propertyId: string]: Listing[] } = {};

  listings.forEach((listing) => {
    const propertyRef = listing.property._ref;
    console.log("Listing's property id", listing.property._ref);

    // Initialize array if this property is encountered for the first time
    if (!propertyListingsMap[propertyRef]) {
      propertyListingsMap[propertyRef] = [];
    }

    // Push the listing to the corresponding property
    propertyListingsMap[propertyRef].push(listing);
  });

  // Step 2: Build the 2D array, but only include properties that have listings
  const propertiesWithListings: Array<[Property, Listing[]]> = properties
    .map((property) => {
      const propertyListings = propertyListingsMap[property._id] || [];
      return [property, propertyListings] as [Property, Listing[]];
    })
    .filter(([_, propertyListings]) => propertyListings.length > 0); // Filter out properties with no listings

  return propertiesWithListings;
};

interface HomeSearchSectionProps {
  listings: Listing[];
  unitTypes: UnitType[];
  properties: Property[];
  onSearchSectionClick: () => void;
  searchActionClicked: boolean;
}

/**
 * The HomeSearchSection component renders a search bar with a filter section
 * and a section to display search results. It takes in three props: listings,
 * properties, and onSearchSectionClick. The onSearchSectionClick prop is a
 * function that is called when the user clicks on the search section. The
 * component also has a searchActionClicked prop that is used to determine
 * whether to show the search results section or not. The component renders a
 * search bar with a filter section and a section to display search results.
 * When the user types in the search bar, the component performs a search and
 * updates the state with the filtered results. When the user clicks on the
 * search section, the component calls the onSearchSectionClick function.
 * @param {Listing[]} listings - An array of Listing objects
 * @param {Property[]} properties - An array of Property objects
 * @param {function} onSearchSectionClick - A function that is called when the user clicks on the search section
 * @param {boolean} searchActionClicked - A boolean that is used to determine whether to show the search results section or not
 * @returns {JSX.Element} - The rendered HomeSearchSection component
 */

const HomeSearchSection: React.FC<HomeSearchSectionProps> = ({
  listings,
  unitTypes,
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
  const [filteredUnitTypes, setFilteredUnitTypes] = useState<UnitType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filteredPropertiesWithListings, setFilteredPropertiesWithListings] =
    useState<Property[]>([]);

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
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, any>>({
    Bedrooms: "",
    "Min Price": 0,
    "Max Price": 0,
    Location: "",
    // "Buy/Rent": "",
  });

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  const handleFilter = () => {
    console.log("Filter Submit clicked");

    setLoading(true);

    // Construct the query string
    const query = new URLSearchParams({
      bedrooms: selectedValues.Bedrooms ?? "",
      minprice: selectedValues["Min Price"] ?? "",
      maxprice: selectedValues["Max Price"] ?? "",
      location: selectedValues.Location ?? "",
      // buyRent: selectedValues["Buy/Rent"] ?? "",
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
    unitTypes: UnitType[],
    properties: Property[]
  ): {
    filteredUnitTypes: UnitType[];
    filteredProperties: Property[];
    filteredListings: Listing[];
    filteredPropertiesWithListings: Property[];
  } => {
    // Filter listings by matching the cleaned value with their names
    const filteredUnitTypes = unitTypes.filter((unit) =>
      [unit.unitTypeName].some((listingField) =>
        listingField.toLowerCase().includes(value.toLowerCase())
      )
    );

    // Filter properties by matching the cleaned value with their descriptions or titles
    const filteredProperties = properties.filter((property) =>
      [property.title, property.description].some((propertyField) =>
        propertyField.toLowerCase().includes(value.toLowerCase())
      )
    );

    const filteredListings = listings.filter((listing) =>
      [listing.listingName, listing.description].some((listingField) =>
        listingField.toLowerCase().includes(value.toLowerCase())
      )
    );

    const filteredPropertiesWithListings = properties.filter((property) =>
      [property.title, property.description].some((propertyField) =>
        propertyField.toLowerCase().includes(value.toLowerCase())
      )
    );
    return {
      filteredUnitTypes,
      filteredProperties,
      filteredListings,
      filteredPropertiesWithListings,
    };
  };

  const filterByAddressInfo = (
    value: string,
    listings: Listing[],
    unitTypes: UnitType[],
    properties: Property[]
  ): {
    filteredUnitTypes: UnitType[];
    filteredProperties: Property[];
    filteredListings: Listing[];
    filteredPropertiesWithListings: Property[];
  } => {
    console.log("INITIATING FILTER BY ADDRESS INFO");

    let cleanedValue = value;

    // Combine all filter keywords to act as boundaries
    const allFilterKeywords = [
      ...bedroomInfoKeywords,
      ...bathroomInfoKeywords,
      ...listingPropertyKeywords,
      ...developerInfoKeywords,
    ].join("|");

    // Regular expression to match everything after the address keyword up to the next keyword or end of string, excluding digits at the end
    const addressRegex = new RegExp(
      `(?:${addressInfoKeywords.join("|")})\\s+(.+?)(?=\\s+(${allFilterKeywords}).*|$)`,
      "i"
    );

    // Match the value against the regex
    const match = cleanedValue.match(addressRegex);

    if (match && match[1]) {
      // Capture every word after the address keyword
      cleanedValue = match[1].trim(); // Clean any extra spaces

      // Remove trailing numbers if present
      cleanedValue = cleanedValue.replace(/\s+\d+$/, "").trim(); // Remove trailing numbers and trim

      console.log("Captured Address Info:", cleanedValue); // Log the captured address part
    } else {
      console.log("No address keyword match found.");
    }

    // Filter unitTypes based on the captured address value
    const filteredUnitTypes = unitTypes.filter(
      (unit) =>
        unit.description?.toLowerCase().includes(cleanedValue.toLowerCase()) ||
        unit.unitTypeName?.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    console.log("Filtered Unit Types:", filteredUnitTypes);

    // Placeholder for properties (since you're handling this separately)
    const propertiesWithUnitTypes = createPropertieswithUnitTypes(
      filteredUnitTypes,
      properties
    );

    const filteredProperties: Property[] = propertiesWithUnitTypes.map(
      ([property]) => property
    );

    const filteredListings = listings.filter(
      (listing) =>
        listing.description
          ?.toLowerCase()
          .includes(cleanedValue.toLowerCase()) ||
        listing.listingName?.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    const propertiesWithListings = createPropertiesWithListings(
      filteredListings,
      properties
    );

    const filteredPropertiesWithListings: Property[] =
      propertiesWithListings.map(([property]) => property);

    return {
      filteredUnitTypes,
      filteredProperties,
      filteredListings,
      filteredPropertiesWithListings,
    };
  };

  // Define filter function for property bedroom
  const filterByUnitsBedroom = (
    value: string,
    listings: Listing[],
    unitTypes: UnitType[],
    properties: Property[]
  ): {
    filteredUnitTypes: UnitType[];
    filteredProperties: Property[];
    filteredListings: Listing[];
    filteredPropertiesWithListings: Property[];
  } => {
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

    const filteredUnitTypes = unitTypes.filter(
      (unit) =>
        // listing.description?.toLowerCase().includes(cleanedValue.toLowerCase())
        unit.bedroom === Number(cleanedValue)
    );

    const propertyWithUnitTypes = createPropertieswithUnitTypes(
      filteredUnitTypes,
      properties
    );

    const filteredProperties: Property[] = propertyWithUnitTypes.map(
      ([property]) => property
    );

    const filteredListings = listings.filter(
      (listing) => listing.bedroom === Number(cleanedValue)
    );

    const propertiesWithListings = createPropertiesWithListings(
      filteredListings,
      properties
    );

    const filteredPropertiesWithListings: Property[] =
      propertiesWithListings.map(([property]) => property);

    console.log("Filtered Listings:", filteredListings);
    console.log("Filtered Properties:", filteredPropertiesWithListings);

    return {
      filteredUnitTypes,
      filteredProperties,
      filteredListings,
      filteredPropertiesWithListings,
    };
  };

  // Define filter function for property bathroom
  const filterByUnitsBathroom = (
    value: string,
    listings: Listing[],
    unitTypes: UnitType[],
    properties: Property[]
  ): {
    filteredUnitTypes: UnitType[];
    filteredProperties: Property[];
    filteredListings: Listing[];
    filteredPropertiesWithListings: Property[];
  } => {
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

    const filteredUnitTypes = unitTypes.filter(
      (unit) => unit.bathroom === Number(cleanedValue)
    );

    const propertyWithUnitTypes = createPropertieswithUnitTypes(
      filteredUnitTypes,
      properties
    );

    const filteredProperties: Property[] = propertyWithUnitTypes.map(
      ([property]) => property
    );

    const filteredListings = listings.filter(
      (listing) => listing.bathroom === Number(cleanedValue)
    );

    const propertiesWithListings = createPropertiesWithListings(
      filteredListings,
      properties
    );

    const filteredPropertiesWithListings: Property[] =
      propertiesWithListings.map(([property]) => property);

    return {
      filteredUnitTypes,
      filteredProperties,
      filteredListings,
      filteredPropertiesWithListings,
    };
  };

  // Define filter function for property facing side

  // Define filter function by max price

  // Perform search based on value and filters
  const performSearch = (
    value: string,
    listings: Listing[],
    unitTypes: UnitType[],
    properties: Property[]
  ): {
    filteredUnitTypes: UnitType[];
    filteredProperties: Property[];
    filteredListings: Listing[];
    filteredPropertiesWithListings: Property[];
  } => {
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
    let filteredUnitTypes: UnitType[] = [...unitTypes];
    let filteredProperties: Property[] = [...properties];
    let filteredPropertiesWithListings: Property[] = [...properties];

    // Apply filters sequentially

    // 1. Filter by bedroom if detected
    if (isBedroomSearch) {
      console.log("INITIATING FILTER BY PROPERTY BEDROOM IN PERFORM-SEARCH");
      console.log();
      const bedroomResult = filterByUnitsBedroom(
        value,
        listings,
        unitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        bedroomResult.filteredUnitTypes.includes(listing)
      );
      filteredListings = filteredListings.filter((listing) =>
        bedroomResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        bedroomResult.filteredProperties.includes(property)
      );
      filteredPropertiesWithListings = filteredPropertiesWithListings.filter(
        (property) =>
          bedroomResult.filteredPropertiesWithListings.includes(property)
      );
    }

    // 2. Filter by bathroom if detected
    if (isBathroomSearch) {
      console.log("INITIATING FILTER BY PROPERTY BATHROOM IN PERFORM-SEARCH");
      const bathroomResult = filterByUnitsBathroom(
        value,
        filteredListings,
        filteredUnitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        bathroomResult.filteredUnitTypes.includes(listing)
      );
      filteredListings = filteredListings.filter((listing) =>
        bathroomResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        bathroomResult.filteredProperties.includes(property)
      );
      filteredPropertiesWithListings = filteredPropertiesWithListings.filter(
        (property) =>
          bathroomResult.filteredPropertiesWithListings.includes(property)
      );
    }

    // 3. Filter by listing/property names if detected
    // if (isListingSearch) {
    //   const listingResult = filterByListingPropertyNames(
    //     value,
    //     listings,
    //     properties
    //   );
    //   filteredUnitTypes = filteredUnitTypes.filter((listing) =>
    //     listingResult.filteredUnitTypes.includes(listing)
    //   );
    //   filteredProperties = filteredProperties.filter((property) =>
    //     listingResult.filteredProperties.includes(property)
    //   );
    // }

    // 4. Filter by address if detected
    if (isAddressSearch) {
      console.log("INITIATING FILTER BY ADDRESS IN PERFORM-SEARCH");
      const addressResult = filterByAddressInfo(
        value,
        listings,
        filteredUnitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        addressResult.filteredUnitTypes.includes(listing)
      );
      filteredListings = filteredListings.filter((listing) =>
        addressResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        addressResult.filteredProperties.includes(property)
      );
      filteredPropertiesWithListings = filteredPropertiesWithListings.filter(
        (property) =>
          addressResult.filteredPropertiesWithListings.includes(property)
      );
    }

    // 5. Default name/title search if no specific search type matches
    if (
      !isAddressSearch &&
      !isBedroomSearch &&
      !isBathroomSearch &&
      value !== ""
    ) {
      const defaultResult = filterDefaultNameTitle(
        value,
        listings,
        filteredUnitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        defaultResult.filteredUnitTypes.includes(listing)
      );
      filteredListings = filteredListings.filter((listing) =>
        defaultResult.filteredListings.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        defaultResult.filteredProperties.includes(property)
      );
      filteredPropertiesWithListings = filteredPropertiesWithListings.filter(
        (property) =>
          defaultResult.filteredPropertiesWithListings.includes(property)
      );
    }

    // // Handle "only properties" or "only listings" filters
    // if (isSearchOnlyProperties) {
    //   filteredUnitTypes = []; // Clear listings, only properties should remain
    // } else if (isSearchOnlyListings) {
    //   filteredProperties = []; // Clear properties, only listings should remain
    // }

    return {
      filteredUnitTypes,
      filteredProperties,
      filteredListings,
      filteredPropertiesWithListings,
    };
  };

  // Handle input change and perform search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSearchActive(value.trim() !== "");
    console.log(value); // Log the input value

    // Perform the search and get filtered results
    const {
      filteredUnitTypes,
      filteredProperties,
      filteredListings,
      filteredPropertiesWithListings,
    } = performSearch(value, listings, unitTypes, properties);

    // Update state with filtered results
    setFilteredListings(filteredListings);
    setFilteredUnitTypes(filteredUnitTypes);
    setFilteredProperties(filteredProperties);
    setFilteredPropertiesWithListings(filteredPropertiesWithListings);

    console.log(
      "Filtered Units: ",
      filteredUnitTypes.map((unit) => unit.unitTypeName)
    );

    console.log(
      "Filtered Listings",
      filteredListings.map((listing) => listing.listingName)
    );

    console.log(
      "Filtered Properties: ",
      filteredProperties.map((property) => property.title)
    );

    console.log(
      "Filtered properties with listings: ",
      filteredPropertiesWithListings
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    setLoading(true);

    // Navigate to /searchResultsPage
    router.push("/SearchResultsPage");
  };

  return (
    <div className={`flex flex-col items-center md:w-[1320px] w-screen`}>
      {/* <h2
        className={`mt-20 mb-10 sm:mb-16 text-xl text-center lg:text-5xl ipad-screen:text-4xl text-xl dark:text-white text-black ${searchActionClicked ? "opacity-50" : "opacity-100"}`}
      >
        Ask US Anything at Maha-Vertex
      </h2> */}
      <div className="relative bg-red-500 h-[full] w-full">
        <img
          src="/Banner_Hero.jpg"
          className="z-0 w-full h-full object-cover"
          alt="Banner Image"
        />

        <div
          className="z-10 absolute top-[85%] md:top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" // Added background for visibility
          onClick={onSearchSectionClick}
          onFocus={handleInputFocus}
        >
          <div className="search-section search-section-internal">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />

            <div className="z-10 w-[75vw]">
              {searchActionClicked && (
                <SearchResultsSection
                  filteredUnitTypes={filteredUnitTypes}
                  filteredListings={filteredListings}
                  filteredProperties={filteredProperties}
                  filteredPropertiesWithListings={
                    filteredPropertiesWithListings
                  }
                  isActive={isSearchActive}
                />
              )}
            </div>
          </div>

          {/* <div className="max-sm:hidden inline-flex justify-center items-center space-x-1 py-3 rounded w-full">
            {filters.map((filter) => (
              <div key={filter} className="md:px-0">
                <Popover
                  open={openFilter === filter}
                  onOpenChange={(isOpen) =>
                    setOpenFilter(isOpen ? filter : null)
                  }
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
                      <ChevronsUpDown className="h-4 w-4 shrink-0 lg:ml-10 z-1 ipad-screen:ml-2" />
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
                                : filter === "Min Price" ||
                                    filter === "Max Price"
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
              variant={"destructive"}
              onClick={() => {
                handleFilter();
              }}
            >
              Search -&gt;
            </Button>
          </div> */}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      )}

      {/* Filter Component */}
      {/* <div
        className={`flex justify-center items-center w-max-[75%] w-[500px] mt-12  ${searchActionClicked ? "opacity-50 inset-0" : "opacity-100"}`}
      >
        <div className="bg-red-500 max-sm:hidden inline-flex justify-center items-center shadow-lg space-x-1 py-3 px-3 rounded">
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
      </div> */}
    </div>
  );
};

export default HomeSearchSection;

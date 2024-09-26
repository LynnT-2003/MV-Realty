"use client";
import React, { useState, useEffect, useRef } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { UnitType, Property } from "@/types";
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

interface HomeSearchSectionProps {
  // listings: Listing[];
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

  const [filteredUnitTypes, setFilteredUnitTypes] = useState<UnitType[]>([]);
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
    unitTypes: UnitType[],
    properties: Property[]
  ): { filteredUnitTypes: UnitType[]; filteredProperties: Property[] } => {
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

    return { filteredUnitTypes, filteredProperties };
  };

  const filterByAddressInfo = (
    value: string,
    // listings: Listing[],
    unitType: UnitType[],
    properties: Property[]
  ): { filteredUnitTypes: UnitType[]; filteredProperties: Property[] } => {
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

    unitTypes.forEach((unit) => {
      const nameMatch = unit.unitTypeName?.toLowerCase().includes(cleanedValue);
      const descriptionMatch = unit.description
        ?.toLowerCase()
        .includes(cleanedValue);

      console.log(unit.unitTypeName);
      // console.log(`Name Match: ${nameMatch}`);
      console.log(`Description Match: ${descriptionMatch}`);
    });

    // Filter listings and properties based on the cleanedValue
    const filteredUnitTypes = unitTypes.filter(
      (unit) =>
        unit.description?.toLowerCase().includes(cleanedValue.toLowerCase()) ||
        unit.unitTypeName?.toLowerCase().includes(cleanedValue.toLowerCase())
    );

    // const filteredProperties = properties.filter(
    //   (property) =>
    //     property.description
    //       .toLowerCase()
    //       .includes(cleanedValue.toLowerCase()) ||
    //     property.title.toLowerCase().includes(cleanedValue.toLowerCase())
    // );

    const propertiesWithListings = createPropertieswithUnitTypes(
      filteredUnitTypes,
      properties
    );

    const filteredProperties = propertiesWithListings.map(
      ([property]) => property
    );

    if (cleanedValue.length === 0) {
      return { filteredUnitTypes: [], filteredProperties: [] };
    }

    return { filteredUnitTypes, filteredProperties };
  };

  // Define filter function for property bedroom
  const filterByUnitsBedroom = (
    value: string,
    // listings: Listing[],
    unitType: UnitType[],
    properties: Property[]
  ): { filteredUnitTypes: UnitType[]; filteredProperties: Property[] } => {
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

    const propertiesWithListings = createPropertieswithUnitTypes(
      filteredUnitTypes,
      properties
    );

    const filteredProperties: Property[] = propertiesWithListings.map(
      ([property]) => property
    );

    console.log("Filtered Properties:", filteredProperties);
    console.log("Filtered Listings:", filteredUnitTypes);

    return { filteredUnitTypes, filteredProperties };
  };

  // Define filter function for property bathroom
  const filterByUnitsBathroom = (
    value: string,
    // listings: Listing[],
    unitType: UnitType[],
    properties: Property[]
  ): { filteredUnitTypes: UnitType[]; filteredProperties: Property[] } => {
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
      (unit) =>
        // listing.description?.toLowerCase().includes(cleanedValue.toLowerCase())
        unit.bathroom === Number(cleanedValue)
    );

    const filteredProperties: Property[] = [];

    if (cleanedValue.length === 0) {
      return { filteredUnitTypes: [], filteredProperties: [] };
    }

    return { filteredUnitTypes, filteredProperties };
  };

  // Define filter function for property facing side

  // Define filter function by max price

  // Perform search based on value and filters
  const performSearch = (
    value: string,
    // listings: Listing[],
    unitTypes: UnitType[],
    properties: Property[]
  ): { filteredUnitTypes: UnitType[]; filteredProperties: Property[] } => {
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
    let filteredUnitTypes: UnitType[] = [...unitTypes];
    let filteredProperties: Property[] = [...properties];

    // Apply filters sequentially

    // 1. Filter by bedroom if detected
    if (isBedroomSearch) {
      console.log("INITIATING FILTER BY PROPERTY BEDROOM IN PERFORM-SEARCH");
      console.log();
      const bedroomResult = filterByUnitsBedroom(value, unitTypes, properties);
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        bedroomResult.filteredUnitTypes.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        bedroomResult.filteredProperties.includes(property)
      );
    }

    // 2. Filter by bathroom if detected
    if (isBathroomSearch) {
      console.log("INITIATING FILTER BY PROPERTY BATHROOM IN PERFORM-SEARCH");
      const bathroomResult = filterByUnitsBathroom(
        value,
        filteredUnitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        bathroomResult.filteredUnitTypes.includes(listing)
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
        filteredUnitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        addressResult.filteredUnitTypes.includes(listing)
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
      const defaultResult = filterDefaultNameTitle(
        value,
        filteredUnitTypes,
        properties
      );
      filteredUnitTypes = filteredUnitTypes.filter((listing) =>
        defaultResult.filteredUnitTypes.includes(listing)
      );
      filteredProperties = filteredProperties.filter((property) =>
        defaultResult.filteredProperties.includes(property)
      );
    }

    // // Handle "only properties" or "only listings" filters
    // if (isSearchOnlyProperties) {
    //   filteredUnitTypes = []; // Clear listings, only properties should remain
    // } else if (isSearchOnlyListings) {
    //   filteredProperties = []; // Clear properties, only listings should remain
    // }

    return { filteredUnitTypes, filteredProperties };
  };

  // Handle input change and perform search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsSearchActive(value.trim() !== "");
    console.log(value); // Log the input value

    // Perform the search and get filtered results
    const { filteredUnitTypes, filteredProperties } = performSearch(
      value,
      unitTypes,
      properties
    );

    // Update state with filtered results
    setFilteredUnitTypes(filteredUnitTypes);
    setFilteredProperties(filteredProperties);

    console.log(
      "Filtered Units: ",
      filteredUnitTypes.map((unit) => unit.unitTypeName)
    );

    console.log(
      "Filtered Properties: ",
      filteredProperties.map((property) => property.title)
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
    <div
      className={`bg-red-200 flex flex-col items-center h-[40vh] md:h-[45vh] lg:h-[45vh] xl-[75vh] md:w-[1320px] w-screen`}
    >
      {/* <h2
        className={`mt-20 mb-10 sm:mb-16 text-xl text-center lg:text-5xl ipad-screen:text-4xl text-xl dark:text-white text-black ${searchActionClicked ? "opacity-50" : "opacity-100"}`}
      >
        Ask US Anything at Maha-Vertex
      </h2> */}
      <div className="relative bg-red-500 h-full w-full">
        <img
          src="/Banner_Hero.jpg"
          className="z-0 w-full h-full object-cover"
          alt="Banner Image"
        />

        <div
          className="search-section search-section-internal z-10 absolute top-[85%] md:top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2" // Added background for visibility
          onClick={onSearchSectionClick}
          onFocus={handleInputFocus}
        >
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />

          <div className="max-sm:hidden inline-flex justify-center items-center shadow-lg space-x-1 py-3 rounded">
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
              onClick={() => {
                handleFilter();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800">
          <ClipLoader color="#ffffff" loading={loading} size={50} />
        </div>
      )}

      <div className="z-10 w-screen">
        {searchActionClicked && (
          <SearchResultsSection
            filteredUnitTypes={filteredUnitTypes}
            filteredProperties={filteredProperties}
            isActive={isSearchActive}
          />
        )}
      </div>

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

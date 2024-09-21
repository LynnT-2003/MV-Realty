import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { Listing, Property, Developer } from "@/types";

import LensCardListings from "./LensCardListings";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
import { Check, ChevronsUpDown } from "lucide-react";

const filters = ["Bedrooms", "Location", "Buy/Rent"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, any[]> = {
  Bedrooms: ["1", "2", "3"],
  Location: ["Siam", "Asoke", "Ratchathewi", "Phrom Phong"],
  "Buy/Rent": ["Buy", "Rent"],
};

interface ListingCardCollectionProps {
  listings: Listing[];
  properties: Property[];
  // developers: Developer[];
  showFilter: boolean;
}

/**
 * The main component for displaying a list of listings and properties.
 *
 * The component takes in three props: listings, properties, and showFilter.
 * The listings and properties props are arrays of objects, where each object
 * represents a listing or property. The showFilter prop is a boolean that
 * determines whether the filter panel is shown or not.
 *
 * The component renders a filter panel on the left side of the screen if
 * showFilter is true. The filter panel contains a list of filters that can be
 * used to narrow down the list of listings and properties. The filters are
 * grouped into categories, and each category contains a list of options that
 * can be selected.
 *
 * The component also renders a list of listings and properties on the right
 * side of the screen. The list is divided into two columns, with listings on
 * the left and properties on the right. Each listing and property is rendered
 * as a card that contains the title, price, and other relevant information.
 *
 * When the user selects a filter, the component updates the list of listings
 * and properties to only show the ones that match the selected filter.
 *
 * @param {Listing[]} listings - The list of listings to display.
 * @param {Property[]} properties - The list of properties to display.
 * @param {boolean} showFilter - Whether to show the filter panel or not.
 */

const ListingCardCollection: React.FC<ListingCardCollectionProps> = ({
  listings,
  properties,
  // developers,
  showFilter,
}) => {
  const router = useRouter();

  const [maxPrice, setMaxPrice] = useState(99);
  const [maxInitPrice, setMaxInitPrice] = useState(99);

  useEffect(() => {
    if (listings.length > 0) {
      let maxListingPrice = Math.max(
        ...listings.map((listing) => listing.price)
      );
      setMaxInitPrice(maxListingPrice);
    }
  }, [listings]);

  // Desktop filter state
  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  // Mobile filter state
  const [openFilterMobile, setOpenFilterMobile] = useState<Filter | null>(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, any>>({
    Bedrooms: "",
    Location: "",
    "Buy/Rent": "",
  });

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  // Create a filtered list based on all filters
  const filteredListings = useMemo(() => {
    console.log("Applying filters...");
    console.log("Max Price:", maxPrice);
    console.log("Selected Values:", selectedValues);

    const filteredBedroom = listings.filter((listing) => {
      return selectedValues.Bedrooms
        ? listing.bedroom === Number(selectedValues.Bedrooms)
        : true;
    });

    const filteredLocation = filteredBedroom.filter((listing) => {
      return selectedValues.Location
        ? listing.listingName.includes(selectedValues.Location)
        : true;
    });

    const filteredMaxPrice = filteredLocation.filter((listing) => {
      return listing.price <= maxPrice;
    });

    console.log("Filtered Listings:", filteredMaxPrice); // Debug log

    return filteredMaxPrice;
  }, [listings, maxPrice, selectedValues]);

  const handleSliderChange = (value: number[]) => {
    setMaxPrice(value[0]);
    console.log(maxPrice);
  };

  const handleListingClick = (slug: string) => {
    router.push(`/ListingDetails/${slug}`);
  };

  return (
    <div className="flex justify-center pt-0">
      {!showFilter && (
        <div className="flex w-screen lg:w-[1320px]">
          <div className="ipad-screen:w-full w-screenrounded-lg overflow-hidden px-2 flex flex-col h-[85vh] overflow-y-scroll">
            {filteredListings.length > 1 && listings.length > 0 && (
              <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-medium">
                Listings
              </h1>
            )}

            <div className="mx-8 ipad-screen:hidden py-4">
              {/* Separate filters for mobile view */}
              <div className="flex flex-col space-y-4">
                {/* Horizontal filter row */}
                <div className="flex justify-between space-x-2">
                  {filters.slice(0, 2).map((filter) => (
                    <Popover key={filter} open={openFilterMobile === filter}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFilterMobile === filter}
                          className="flex justify-between text-right pr-4 w-full"
                          onClick={() =>
                            setOpenFilterMobile(
                              openFilterMobile === filter ? null : filter
                            )
                          }
                        >
                          <span className="flex-1 text-left">
                            {filter === "Bedrooms"
                              ? `${selectedValues[filter]} Bedroom`
                              : selectedValues[filter] || filter}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
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
                                    : option}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
                <div className="flex w-full justify-between space-x-2">
                  {filters.slice(2, 4).map((filter) => (
                    <Popover key={filter} open={openFilterMobile === filter}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFilterMobile === filter}
                          className="flex justify-between text-right pr-4 w-full"
                          onClick={() =>
                            setOpenFilterMobile(
                              openFilterMobile === filter ? null : filter
                            )
                          }
                        >
                          <span className="flex-1 text-left">
                            {filter === "Bedrooms"
                              ? `${selectedValues[filter]} Bedroom`
                              : selectedValues[filter] || filter}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
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
                                    : option}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>

                {/* Max price slider */}
                <div>
                  {maxPrice < 99 && (
                    <h1 className="my-2">Max Price: {maxPrice} Million THB</h1>
                  )}
                  <Slider
                    defaultValue={[maxInitPrice]}
                    max={maxInitPrice}
                    step={2}
                    onValueChange={handleSliderChange}
                    className="mt-2 mb-6"
                  />
                </div>
              </div>
            </div>

            {filteredListings.length > 0 && (
              <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((listing, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handleListingClick(listing._id);
                      }}
                      className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                    >
                      <LensCardListings listing={listing} />
                    </div>
                  );
                })}
              </div>
            )}

            <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-medium">
              Properties
            </h1>
            <div className="flex grid ml-5 bg-red-500 grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      // handleListingClick(listing._id);
                    }}
                    className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                  >
                    {/* <LensDemo listing={listing} properties={properties} /> */}
                    <h1>{property.title}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="flex w-screen lg:w-[1320px]">
          {/* First column (blank, taking 1/3 width) */}
          <div className="mx-5 position:fixed ipad-screen:block rounded-3xl ipad-screen:w-[300px] w-[0px] hidden">
            <div className="px-7 pt-10 pb-16 rounded-lg ">
              <h1 className="text-center font-medium">Filters</h1>
              {filters.map((filter) => (
                <div key={filter} className="md:px-0 my-10">
                  <Popover
                    open={openFilter === filter}
                    onOpenChange={(isOpen) =>
                      setOpenFilter(isOpen ? filter : null)
                    }
                  >
                    <PopoverTrigger
                      asChild
                      className="bg-blue-100 hover:bg-slate-300 border-0"
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFilter === filter}
                        className="flex justify-between text-right pr-4 w-full"
                      >
                        <span className="flex-1 text-left">
                          {filter === "Bedrooms"
                            ? `${selectedValues[filter]} Bedroom`
                            : `
                        ${selectedValues[filter] || filter}`}
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
              <div className="">
                <span className="mt-12">Max Price:</span>
                {maxPrice < 99 && (
                  <h1 className="my-2">{maxPrice} Million THB</h1>
                )}
                {maxPrice >= 99 && <span className="my-2 ml-2">Not set</span>}
                <Slider
                  defaultValue={[maxInitPrice]}
                  max={maxInitPrice}
                  step={2}
                  onValueChange={handleSliderChange}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Second column (listings, taking 2/3 width) */}
          <div className="ipad-screen:w-full w-screenrounded-lg overflow-hidden px-2 flex flex-col h-[85vh] overflow-y-scroll">
            {filteredListings.length > 1 && listings.length > 0 && (
              <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-medium">
                Listings
              </h1>
            )}

            <div className="mx-8 ipad-screen:hidden py-4">
              {/* Separate filters for mobile view */}
              <div className="flex flex-col space-y-4">
                {/* Horizontal filter row */}
                <div className="flex justify-between space-x-2">
                  {filters.slice(0, 2).map((filter) => (
                    <Popover key={filter} open={openFilterMobile === filter}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFilterMobile === filter}
                          className="flex justify-between text-right pr-4 w-full"
                          onClick={() =>
                            setOpenFilterMobile(
                              openFilterMobile === filter ? null : filter
                            )
                          }
                        >
                          <span className="flex-1 text-left">
                            {filter === "Bedrooms"
                              ? `${selectedValues[filter]} Bedroom`
                              : selectedValues[filter] || filter}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
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
                                    : option}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
                <div className="flex w-full justify-between space-x-2">
                  {filters.slice(2, 4).map((filter) => (
                    <Popover key={filter} open={openFilterMobile === filter}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFilterMobile === filter}
                          className="flex justify-between text-right pr-4 w-full"
                          onClick={() =>
                            setOpenFilterMobile(
                              openFilterMobile === filter ? null : filter
                            )
                          }
                        >
                          <span className="flex-1 text-left">
                            {filter === "Bedrooms"
                              ? `${selectedValues[filter]} Bedroom`
                              : selectedValues[filter] || filter}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
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
                                    : option}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>

                {/* Max price slider */}
                <div>
                  {maxPrice < 99 && (
                    <h1 className="my-2">Max Price: {maxPrice} Million THB</h1>
                  )}
                  <Slider
                    defaultValue={[maxInitPrice]}
                    max={maxInitPrice}
                    step={2}
                    onValueChange={handleSliderChange}
                    className="mt-2 mb-6"
                  />
                </div>
              </div>
            </div>

            {filteredListings.length > 1 && listings.length > 0 && (
              <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((listing, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handleListingClick(listing._id);
                      }}
                      className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                    >
                      <LensCardListings listing={listing} />
                    </div>
                  );
                })}
              </div>
            )}

            <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-medium">
              Properties
            </h1>
            <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      // handleListing
                      // handleListingClick(listing._id);
                    }}
                    className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                  >
                    {/* <LensDemo listing={listing} properties={properties} /> */}
                    <h1>{property.title}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingCardCollection;

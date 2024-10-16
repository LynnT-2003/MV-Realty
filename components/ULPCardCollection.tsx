"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Listing, Property, UnitType, Tag } from "@/types";
import { fetchAllTags } from "@/services/TagsServices";

import LensCardListings from "./LensCardListings";
import LensCardProperties from "./LensCardProperties";
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
import listing from "@/sanity/schemas/listing";
import ListingCardCollection from "./ListingCardCollection";
import { fetchPropertyById } from "@/services/PropertyServices";
import UnitTypeCardCollection from "./UnitTypeCardCollection";
import unitType from "@/sanity/schemas/unitType";

// const filters = ["Bedrooms", "Location", "Buy/Rent"] as const;
const filters = ["Bedrooms", "Location", "Buy/Rent"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, any[]> = {
  Bedrooms: ["1", "2", "3"],
  Location: ["Siam", "Asoke", "Ratchathewi", "Phrom Phong"],
  "Buy/Rent": ["Buy", "Rent"],
};

interface ULPCardCollectionProps {
  listings: Listing[];
  unitTypes: UnitType[];
  properties: Property[];
  showFilter: boolean;
  showProperties: boolean;
}

const ULPCardCollection: React.FC<ULPCardCollectionProps> = ({
  listings,
  unitTypes,
  properties,
  showFilter,
  showProperties,
}) => {
  const router = useRouter();

  const [isBuy, setIsBuy] = useState(true);
  const [maxPrice, setMaxPrice] = useState(9999999);
  const [maxInitPrice, setMaxInitPrice] = useState(9999999);
  const [maxUnitInitPrice, setMaxUnitInitPrice] = useState(9999999);

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<UnitType[]>([]);

  useEffect(() => {
    fetchAllTags().then((tags) => {
      setTags(tags);
      console.log("Fetched tags with ref:", tags);
    });
  }, []);

  // Desktop filter state
  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  // Mobile filter state
  const [openFilterMobile, setOpenFilterMobile] = useState<Filter | null>(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, any>>({
    Bedrooms: "",
    Location: "",
    "Buy/Rent": "",
  });

  useEffect(() => {
    if (filteredListings.length > 0) {
      let maxListingPrice = Math.max(
        ...filteredListings.map((listing) => listing.price)
      );
      setMaxInitPrice(maxListingPrice);
    }
  }, [listings, selectedValues["Buy/Rent"]]);

  useEffect(() => {
    if (filteredUnits.length > 0) {
      let maxUnitPrice = Math.max(
        ...filteredUnits.map((unit) => unit.startingPrice)
      );
      setMaxUnitInitPrice(maxUnitPrice);
    }
  }, [unitType, selectedValues["Buy/Rent"]]);

  // Create a filtered list based on all filters
  //   const filteredListings = useMemo(() => {
  //     console.log("Applying filters...");
  //     console.log("Max Price:", maxPrice);
  //     console.log("Selected Values:", selectedValues);

  //     const filteredBedroom = listings.filter((listing) => {
  //       return selectedValues.Bedrooms
  //         ? listing.bedroom === Number(selectedValues.Bedrooms)
  //         : true;
  //     });

  //     const filteredLocation = filteredBedroom.filter((listing) => {
  //       return selectedValues.Location
  //         ? listing.listingName.includes(selectedValues.Location)
  //         : true;
  //     });

  //     const filteredMaxPrice = filteredLocation.filter((listing) => {
  //       return listing.price <= maxPrice;
  //     });

  //     console.log("Listings", listings);
  //     console.log("Filtered Listings:", filteredMaxPrice); // Debug log

  //     return filteredMaxPrice;
  //   }, [listings, maxPrice, selectedValues]);

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
    if (filter === "Buy/Rent") {
      setIsBuy(value === "Buy");
      console.log("Set to Buy");
    }
  };

  const handleSliderChange = (value: number[]) => {
    setMaxPrice(value[0]);
  };

  const handlePriceChange = (value: number) => {
    setMaxInitPrice(value);
  };

  // Fetch and filter properties based on selected tags copy here
  useEffect(() => {
    const applyFilters = async () => {
      // Filter by bedrooms and location first
      let filtered = unitTypes.filter((unit) => {
        return (
          (selectedValues.Bedrooms
            ? unit.bedroom === Number(selectedValues.Bedrooms)
            : true) &&
          (selectedValues.Location
            ? unit.unitTypeName.includes(selectedValues.Location)
            : true) &&
          unit.startingPrice <= maxPrice
        );
      });

      let filteredListings = listings.filter((listing) => {
        return (
          (selectedValues.Bedrooms
            ? listing.bedroom === Number(selectedValues.Bedrooms)
            : true) &&
          (selectedValues.Location
            ? listing.listingName.includes(selectedValues.Location)
            : true) &&
          listing.price <= maxPrice
        );
      });

      // Now handle the tag filtering asynchronously
      if (selectedTags.length > 0) {
        const filteredWithTags = [];
        const filteredListingsWithTags = [];

        for (const unit of filtered) {
          const property = await fetchPropertyById(unit.property._ref);
          const propertyTags = property.tags.map((tag) => tag._ref);

          // Check if any selected tags match the property tags
          const matchesTag = selectedTags.every((selectedTag) =>
            propertyTags.includes(selectedTag)
          );

          if (matchesTag) {
            filteredWithTags.push(unit);
          }
        }

        for (const listing of filteredListings) {
          const property = await fetchPropertyById(listing.property._ref);
          const propertyTags = property.tags.map((tag) => tag._ref);

          // Check if any selected tags match the property tags
          const matchesTag = selectedTags.every((selectedTag) =>
            propertyTags.includes(selectedTag)
          );

          if (matchesTag) {
            filteredListingsWithTags.push(listing);
          }
        }

        setFilteredUnits(filteredWithTags);
        setFilteredListings(filteredListingsWithTags);
      } else {
        setFilteredUnits(filtered);
        setFilteredListings(filteredListings);
      }

      console.log("Filtered Listings:", filteredListings);
      console.log("Filtered Units:", filteredUnits);
    };

    applyFilters();
  }, [unitTypes, maxPrice, selectedValues, selectedTags]);

  const handleListingClick = (id: string) => {
    router.push(`/ListingDetails/${id}`);
  };

  const handleClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    console.log("Selected Tags:", selectedTags);
  };

  return (
    <div className="flex justify-center pt-0">
      {showFilter && (
        <div className="flex w-screen lg:w-[1320px]">
          {/* First column (blank, taking 1/3 width) */}
          <div className="mx-5 position:fixed ipad-screen:block rounded-3xl ipad-screen:w-[300px] w-[0px] hidden h-[90vh] overflow-hidden overflow-y-scroll scrollbar-hide">
            <div className="px-10 py-6 rounded-lg bg-[#e3effd]">
              <h1 className="ml-1 text-xl">Filter:</h1>
              {filters.map((filter) => (
                <div key={filter} className="md:px-0 mt-8">
                  <Popover
                    open={openFilter === filter}
                    onOpenChange={(isOpen) =>
                      setOpenFilter(isOpen ? filter : null)
                    }
                  >
                    <PopoverTrigger
                      asChild
                      className="hover:bg-slate-300 py-3 border-0"
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFilter === filter}
                        className="flex justify-between text-right pr-4 w-full"
                      >
                        <span className="flex-1 text-left text-sm text-slate-700 font-thin poppins-text">
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
              <div className="mt-8">
                <span className="mt-12 ml-2.5 font-thin poppins-text text-sm text-slate-700 font-light poppins-text">
                  Max Price:
                </span>
                {maxPrice < 9999999 ? (
                  <span className="ml-2 font-thin poppins-text text-sm text-slate-700 font-light poppins-text">
                    {isBuy ? "Million" : "THB / mo"}
                  </span>
                ) : (
                  <span className="my-2 ml-2 font-thin poppins-text text-sm text-slate-700 font-light poppins-text">
                    Not set
                  </span>
                )}

                <div
                  className="flex justify-center text-gray-400 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="number"
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Million THB"
                    className="w-[150px] text-sm pl-3 p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap pt-4">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleClick(tag._id)}
                  className={`px-5 py-1 mt-3 rounded-full bg-white border border-[#002194] font-semibold text-sm
                  transition-colors duration-200 hover:bg-[#002194] hover:text-white ${
                    selectedTags.includes(tag._id)
                      ? "bg-[#002194] text-white"
                      : "text-[#002194]"
                  }`}
                >
                  {tag.tag}
                </button>
              ))}
            </div>
          </div>

          <>
            {isBuy ? (
              <div>
                <div className="mx-8 ipad-screen:hidden py-4 ">
                  {/* Separate filters for mobile view */}
                  <div className="flex flex-col space-y-4">
                    {/* Horizontal filter row */}
                    <div className="flex justify-between space-x-2">
                      {filters.slice(0, 2).map((filter) => (
                        <Popover
                          key={filter}
                          open={openFilterMobile === filter}
                        >
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
                              <CommandInput
                                placeholder={`Search ${filter}...`}
                              />
                              <CommandList>
                                <CommandEmpty>No {filter} found.</CommandEmpty>
                                <CommandGroup>
                                  {options[filter].map((option) => (
                                    <CommandItem
                                      key={option}
                                      onSelect={() =>
                                        handleSelect(filter, option)
                                      }
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
                        <Popover
                          key={filter}
                          open={openFilterMobile === filter}
                        >
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
                              <CommandInput
                                placeholder={`Search ${filter}...`}
                              />
                              <CommandList>
                                <CommandEmpty>No {filter} found.</CommandEmpty>
                                <CommandGroup>
                                  {options[filter].map((option) => (
                                    <CommandItem
                                      key={option}
                                      onSelect={() =>
                                        handleSelect(filter, option)
                                      }
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
                      {maxPrice < 9999999 && (
                        <h1 className="my-2">
                          Max Price: {maxPrice} Million THB
                        </h1>
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
                <UnitTypeCardCollection
                  unitTypes={filteredUnits}
                  properties={properties}
                  showFilter={showFilter}
                />
              </div>
            ) : (
              <div>
                <div className="mx-8 ipad-screen:hidden py-4">
                  {/* Separate filters for mobile view */}
                  <div className="flex flex-col space-y-4">
                    {/* Horizontal filter row */}
                    <div className="flex justify-between space-x-2">
                      {filters.slice(0, 2).map((filter) => (
                        <Popover
                          key={filter}
                          open={openFilterMobile === filter}
                        >
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
                              <CommandInput
                                placeholder={`Search ${filter}...`}
                              />
                              <CommandList>
                                <CommandEmpty>No {filter} found.</CommandEmpty>
                                <CommandGroup>
                                  {options[filter].map((option) => (
                                    <CommandItem
                                      key={option}
                                      onSelect={() =>
                                        handleSelect(filter, option)
                                      }
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
                        <Popover
                          key={filter}
                          open={openFilterMobile === filter}
                        >
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
                              <CommandInput
                                placeholder={`Search ${filter}...`}
                              />
                              <CommandList>
                                <CommandEmpty>No {filter} found.</CommandEmpty>
                                <CommandGroup>
                                  {options[filter].map((option) => (
                                    <CommandItem
                                      key={option}
                                      onSelect={() =>
                                        handleSelect(filter, option)
                                      }
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
                      {maxPrice < 9999999 && (
                        <h1 className="my-2">
                          Max Price: {maxPrice} Million THB
                        </h1>
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
                <ListingCardCollection
                  listings={filteredListings}
                  properties={properties}
                  showFilter={showFilter}
                  showProperties={showProperties}
                />
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
};

export default ULPCardCollection;

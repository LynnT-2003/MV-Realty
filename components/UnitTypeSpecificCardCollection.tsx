import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { Listing, Property, Developer, UnitType } from "@/types";
import { listOfTags } from "./constants/btsStations";
import { fetchAllTags } from "@/services/TagsServices";
import { Tag } from "@/types";

import LensCardUnitTypes from "./LensCardUnitTypes";
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
import { fetchPropertyById } from "@/services/PropertyServices";

// const filters = ["Bedrooms", "Location", "Buy/Rent"] as const;
const filters = ["Bedrooms", "Location"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, any[]> = {
  Bedrooms: ["1", "2", "3"],
  Location: ["Siam", "Asoke", "Ratchathewi", "Phrom Phong"],
  // "Buy/Rent": ["Buy", "Rent"],
};

interface UnitTypeSpecificCardCollectionProps {
  unitTypes: UnitType[];
  properties: Property[];
  showFilter: boolean;
}

/**
 * The main component for displaying a list of unit types and properties.
 *
 * The component takes in three props: unit types, properties, and showFilter.
 * The unit types and properties props are arrays of objects, where each object
 * represents a listing or property. The showFilter prop is a boolean that
 * determines whether the filter panel is shown or not.
 *
 * The component renders a filter panel on the left side of the screen if
 * showFilter is true. The filter panel contains a list of filters that can be
 * used to narrow down the list of unit types and properties. The filters are
 * grouped into categories, and each category contains a list of options that
 * can be selected.
 *
 * The component also renders a list of unit types and properties on the right
 * side of the screen. The list is divided into two columns, with unit types on
 * the left and properties on the right. Each listing and property is rendered
 * as a card that contains the title, price, and other relevant information.
 *
 * When the user selects a filter, the component updates the list of unit types
 * and properties to only show the ones that match the selected filter.
 *
 * @param {UnitType[]} unit types - The list of unit types to display.
 * @param {Property[]} properties - The list of properties to display.
 * @param {boolean} showFilter - Whether to show the filter panel or not.
 */

const UnitTypeSpecificCardCollection: React.FC<
  UnitTypeSpecificCardCollectionProps
> = ({ unitTypes, properties, showFilter }) => {
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Track selected tags
  const [propertiesWithTags, setPropertiesWithTags] = useState<Property[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<UnitType[]>([]);

  useEffect(() => {
    fetchAllTags().then((tags) => {
      setTags(tags);
      console.log("Fetched tags with ref:", tags);
    });
  }, []);

  const [maxPrice, setMaxPrice] = useState(999);
  const [maxInitPrice, setMaxInitPrice] = useState(999);

  useEffect(() => {
    if (unitTypes.length > 0) {
      let maxListingPrice = Math.max(
        ...unitTypes.map((unit) => unit.startingPrice)
      );
      setMaxInitPrice(maxListingPrice);
    }
  }, [unitTypes]);

  useEffect(() => {
    console.log(properties);
    properties.map((property) => {
      console.log(property.tags.map((tag) => console.log(property.tags)));
    });
  }, [selectedTags]);

  // Desktop filter state
  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  // Mobile filter state
  const [openFilterMobile, setOpenFilterMobile] = useState<Filter | null>(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, any>>({
    Bedrooms: "",
    Location: "",
  });

  // Fetch tags initially
  useEffect(() => {
    fetchAllTags().then((tags) => {
      setTags(tags);
      console.log("Fetched tags with ref:", tags);
    });
  }, []);

  // Handle tag button click
  const handleClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    console.log("Selected Tags:", selectedTags);
  };

  // Fetch the max price based on the unit types
  useEffect(() => {
    if (unitTypes.length > 0) {
      let maxListingPrice = Math.max(
        ...unitTypes.map((unit) => unit.startingPrice)
      );
      setMaxInitPrice(maxListingPrice);
    }
  }, [unitTypes]);

  // Fetch and filter properties based on selected tags
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

      // Now handle the tag filtering asynchronously
      if (selectedTags.length > 0) {
        const filteredWithTags = [];

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

        setFilteredUnits(filteredWithTags);
      } else {
        setFilteredUnits(filtered);
      }

      console.log("Filtered Units:", filteredUnits);
    };

    applyFilters();
  }, [unitTypes, maxPrice, selectedValues, selectedTags]);

  // Handle filter value changes
  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setMaxPrice(value[0]);
    console.log(maxPrice);
  };

  const handleUnitTypeClick = (id: string) => {
    router.push(`/UnitTypeDetails/${id}`);
  };

  const handlePropertyClick = (slug: String) => {
    router.push(`/Details/${slug}`);
  };

  return (
    <div className="flex justify-center pt-0">
      {!showFilter && (
        <div className="flex w-screen lg:w-[1320px]">
          <div className="ipad-screen:w-full w-screenrounded-lg overflow-hidden px-2 flex flex-col h-[90vh] overflow-y-scroll">
            {filteredUnits.length > 0 && unitTypes.length > 0 && (
              <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-semibold poppins-text">
                Available Unit Types for Sale
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
                  {maxPrice < 999 && (
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
            {filteredUnits.length > 0 && (
              <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
                {filteredUnits.map((unit, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handleUnitTypeClick(unit._id);
                      }}
                      className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                    >
                      {/* <LensCardListings listing={listing} /> */}
                      <LensCardUnitTypes unitType={unit} />
                    </div>
                  );
                })}
              </div>
            )}
            {properties.length > 0 && (
              <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-semibold poppins-text">
                Available Properties
              </h1>
            )}
            {properties.length > 0 && (
              <div className="flex grid ml-5 grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
                {properties.map((property, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handlePropertyClick(property.slug.current);
                      }}
                      className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                    >
                      {/* <LensDemo listing={listing} properties={properties} /> */}
                      {/* <h1>{property.title}</h1> */}
                      <LensCardProperties property={property} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {showFilter && (
        <div className="flex w-screen lg:w-[1320px] overflow-hidden">
          {/* First column (blank, taking 1/3 width) */}
          <div className="mx-5 position:fixed ipad-screen:block rounded-3xl ipad-screen:w-[300px] w-[0px] hidden h-[90vh] overflow-hidden overflow-y-scroll scrollbar-hide">
            <div className="px-10 pt-10 pb-16 rounded-lg bg-[#e3effd]">
              <h1 className="ml-1 text-xl">Filter Units:</h1>
              {filters.map((filter) => (
                <div key={filter} className="md:px-0 my-8">
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
              <div className="mt-4">
                <span className="mt-12 text-sm text-slate-700 font-light poppins-text">
                  Max Price:
                </span>
                {maxPrice < 999 && (
                  <h1 className="my-2">{maxPrice} Million THB</h1>
                )}
                {maxPrice >= 999 && (
                  <span className="my-2 ml-2 text-sm text-slate-700 font-light poppins-text">
                    Not set
                  </span>
                )}
                <Slider
                  defaultValue={[maxInitPrice]}
                  max={maxInitPrice}
                  step={2}
                  onValueChange={handleSliderChange}
                  className="mt-4"
                />
              </div>
            </div>
            <div className="flex flex-wrap pt-4">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  className="p-[3px] m-2 relative"
                  onClick={() => handleClick(tag._id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div
                    className={`px-3 py-2 text-xs font-medium bg-white rounded-[6px] relative group transition duration-200 ${
                      selectedTags.includes(tag._id)
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" // Change style when clicked
                        : "text-black hover:bg-transparent hover:text-white" // Default hover style
                    }`}
                  >
                    {tag.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Second column (listings, taking 2/3 width) */}
          <div className="ipad-screen:w-full w-screenrounded-lg overflow-hidden px-2 flex flex-col h-[90vh] overflow-y-scroll">
            {filteredUnits.length > 0 && unitTypes.length > 0 && (
              <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-semibold poppins-text">
                Available Unit Types for Sale
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
                  {maxPrice < 999 && (
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
            {filteredUnits.length > 0 && unitTypes.length > 0 && (
              <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
                {filteredUnits.map((unit, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handleUnitTypeClick(unit._id);
                      }}
                      className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                    >
                      {/* <LensCardListings listing={listing} /> */}
                      <LensCardUnitTypes unitType={unit} />
                    </div>
                  );
                })}
              </div>
            )}

            {properties.length > 0 && (
              <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-semibold poppins-text">
                Available Properties
              </h1>
            )}

            {properties.length > 0 && (
              <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
                {properties.map((property, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        handlePropertyClick(property.slug.current);
                      }}
                      className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
                    >
                      {/* <LensDemo listing={listing} properties={properties} /> */}
                      {/* <h1>{property.title}</h1> */}
                      <LensCardProperties property={property} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitTypeSpecificCardCollection;

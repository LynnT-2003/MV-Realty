import React from "react";
import { Listing, Property, UnitType } from "@/types";
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

// Function to create the 2D array
const createPropertiesWithUnitTypes = (
  unitTypes: UnitType[],
  properties: Property[]
): Array<[Property, UnitType[]]> => {
  // Step 1: Create a map of property _id -> listings
  const propertyUnitTypesMap: { [propertyId: string]: UnitType[] } = {};

  unitTypes.forEach((unit) => {
    const propertyRef = unit.property._ref;

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

interface SearchResultsSectionProps {
  filteredUnitTypes: UnitType[];
  filteredProperties: Property[];
  isActive: boolean; // Prop to manage the active state
}

/**
 * SearchResultsSection component renders the search results in a tabular format.
 * The component takes in three props: filteredListings, filteredProperties, and isActive.
 * The filteredListings and filteredProperties props are arrays of objects, where each object
 * represents a listing or property. The isActive prop is a boolean that determines whether
 * the search section is shown or not.
 * @param {Listing[]} filteredListings - The filtered list of listings
 * @param {Property[]} filteredProperties - The filtered list of properties
 * @param {boolean} isActive - Whether the search section is active or not
 * @returns {JSX.Element} - The rendered SearchResultsSection component
 */

const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  filteredUnitTypes,
  filteredProperties,
  isActive,
}) => {
  const router = useRouter();

  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [minPriceFilter, setMinPriceFilter] = useState<number | null>(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  // const [filteredListingsState, setFilteredListingsState] =
  //   useState<Listing[]>(filteredListings);

  const [filteredUnitTypesState, setFilteredUnitTypesState] =
    useState<UnitType[]>(filteredUnitTypes);

  const [filteredPropertiesState, setFilteredPropertiesState] =
    useState<Property[]>(filteredProperties);

  console.log(isActive);

  const handleUnitTypeClick = (id: string) => {
    router.push(`/UnitTypeDetails/${id}`);
  };

  const handlePropertyClick = (slug: string) => {
    router.push(`/Details/${slug}`);
  };

  const handleClickAfterFilter = () => {
    console.log("Filter Submit clicked");
    router.push("/SearchResultsPage");
  };

  // Effect to filter listings when any filter changes
  useEffect(() => {
    let updatedUnitTypes = [...filteredUnitTypes];
    let updatedProperties = [...filteredProperties];

    // Filter by bedroom
    if (bedroomFilter) {
      updatedUnitTypes = updatedUnitTypes.filter(
        (unit) => unit?.bedroom === bedroomFilter
      );
      const propertiesWithListings = createPropertiesWithUnitTypes(
        updatedUnitTypes,
        updatedProperties
      );
      updatedProperties = propertiesWithListings.map(([property]) => property);
    }

    // Filter by location
    if (locationFilter) {
      updatedUnitTypes = updatedUnitTypes.filter(
        (unit) =>
          unit?.description
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase()) ||
          unit?.unitTypeName
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

      // const propertiesWithListings = createPropertiesWithListings(
      //   updatedListings,
      //   updatedProperties
      // );
      // updatedProperties = propertiesWithListings.map(([property]) => property);
    }

    // Filter by max price
    if (maxPriceFilter) {
      updatedUnitTypes = updatedUnitTypes.filter(
        (unit) => Number(unit?.startingPrice) <= Number(maxPriceFilter)
      );
    }

    // Filter by min price
    if (minPriceFilter) {
      updatedUnitTypes = updatedUnitTypes.filter(
        (unit) => Number(unit?.startingPrice) >= Number(minPriceFilter)
      );
    }

    // Filter by price range
    if (maxPriceFilter && minPriceFilter) {
      updatedUnitTypes = updatedUnitTypes.filter(
        (unit) =>
          unit?.startingPrice >= minPriceFilter &&
          unit?.startingPrice <= maxPriceFilter
      );
    }

    setFilteredUnitTypesState(updatedUnitTypes); // Update filtered listings
    setFilteredPropertiesState(updatedProperties);

    // Store the filtered data in localStorage
    localStorage.setItem(
      "filteredListingsState",
      JSON.stringify(updatedUnitTypes)
    );
    localStorage.setItem(
      "filteredPropertiesState",
      JSON.stringify(updatedProperties)
    );
    localStorage.setItem(
      "filteredUnitTypesState",
      JSON.stringify(updatedUnitTypes)
    );
  }, [
    bedroomFilter,
    locationFilter,
    minPriceFilter,
    maxPriceFilter,
    filteredUnitTypes,
  ]);
  useEffect(() => {
    console.log("Filtering Units...");
    console.log("Max Price Filter:", maxPriceFilter);
    filteredUnitTypes.forEach((unit) => {
      console.log("Unit Price:", unit.startingPrice);
    });

    // ... Rest of the filtering logic
  }, [maxPriceFilter, filteredUnitTypes]);

  // Inline style for opacity
  const sectionStyle = {
    opacity: isActive ? 1 : 0,
  };

  return (
    <div style={sectionStyle} className="search-section">
      <div className="hidden ipad-screen:hidden lg:block mt-2 lg:w-screen xl:w-[1250px] w-[1250px] h-screen relative mx-auto max-h-[0px]">
        <div className="rounded-3xl shadow-lg h-[500px] overflow-scroll py-8 glass ">
          {filteredUnitTypes.length === 0 && filteredProperties.length === 0 ? (
            <div className="w-[300px] h-[200px] mx-auto my-16">
              {/* Red block for testing when there are no listings or properties */}
              <span className="text-black text-center block py-16">
                No results found
              </span>
            </div>
          ) : (
            <div className="flex space-x-8">
              {/* Listings Column */}
              <div className="w-1/3">
                <h2 className="text-center font-semibold text-gray-600 mb-8">
                  Filtered Unit Types
                </h2>
                {filteredUnitTypesState.map((unit) => (
                  <div
                    key={unit._id}
                    className="flex items-center space-x-8 py-3 bg-transparent rounded-2xl hover:bg-gray-200 hover:cursor-pointer pl-8 text-gray-600 hover:text-black mb-4"
                    onClick={() => handleUnitTypeClick(unit._id)}
                  >
                    <img
                      src={urlForImage(unit.unitHero)}
                      width={140}
                      className="rounded-lg"
                    />
                    <span key={unit._id}>
                      <h1>
                        <b>{unit.unitTypeName}</b>
                      </h1>
                      <h1 className="pt-2">
                        Price: <i>{unit.startingPrice}M THB</i>
                      </h1>
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
                    className="flex items-center space-x-8 py-3 bg-transparent rounded-2xl hover:bg-white/30 hover:cursor-pointer pl-8 text-gray-600 hover:text-black mb-4"
                    onClick={() => handlePropertyClick(property.slug.current)}
                  >
                    <img
                      src={urlForImage(property.propertyHero)}
                      width={140}
                      className="rounded-lg"
                    />
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
                  <Button
                    onClick={() => {
                      setBedroomFilter(null);
                      setMinPriceFilter(null);
                      setMaxPriceFilter(null);
                      setLocationFilter(null);
                    }}
                  >
                    Clear all Filters
                  </Button>
                </div>
                <div className="flex justify-center items-center pt-2">
                  <Button onClick={() => handleClickAfterFilter()}>
                    See all Results
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="lg:hidden mt-2 w-screen h-screen relative max-w-xl mx-auto max-h-[0px]">
        <ul className="rounded-3xl shadow-lg max-h-[160px] overflow-scroll">
          {filteredUnitTypes.map((unit) => (
            <div
              key={unit._id}
              className="bg-gray-100 hover:bg-gray-300 hover:cursor-pointer pl-8 py-2 text-gray-600 hover:text-black"
              onClick={() => handleUnitTypeClick(unit._id)}
            >
              <span key={unit._id}>
                <span className="text-gray-500 text-xs items-center pr-3">
                  <i>Filtered Units:</i>
                </span>
                {unit.unitTypeName}
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

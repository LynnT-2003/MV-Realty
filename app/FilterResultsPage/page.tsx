"use client";

import BrowseCarousel from "@/components/BrowseCarouselListing";
import ListingCardCollection from "@/components/ListingCardCollection";
import { Property, Listing, Developer, UnitType } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

/**
 * The FilterResultsPage component is a client-side rendered page that shows
 * a list of listings and properties filtered by the query parameters.
 *
 * The component fetches data from the cache if available, and falls back to
 * fetching from the server if not. It also handles filtering of the data
 * based on the query parameters.
 *
 * The component takes no props.
 *
 * @returns A React component that renders a list of listings and properties
 * filtered by the query parameters.
 */
const FilterResultsPage: React.FC = () => {
  const searchParams = useSearchParams();

  // State variables to store the properties, listings, and developers data
  const [properties, setProperties] = useState<Property[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  // A function to retrieve data from local storage
  const getLocalStorage = (key: string) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  };

  // A function to fetch data from the cache if available, or from the server if not
  const fetchDataWithCache = async (key: string) => {
    const storedData = getLocalStorage(key);
    if (storedData) {
      return storedData;
    }
  };

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel, using cached data if available
        const [propertiesData, listingsData, developersData, unitTypesData] =
          await Promise.all([
            fetchDataWithCache("properties"),
            fetchDataWithCache("listings"),
            fetchDataWithCache("developers"),
            fetchDataWithCache("unitTypes"),
          ]);

        // Filter the listings based on the query parameters
        const filteredBedroom = unitTypesData.filter((unit: UnitType) => {
          // If the bedrooms parameter is provided, filter listings that have the same
          // number of bedrooms as the parameter
          return bedrooms ? unit.bedroom === Number(bedrooms) : true;
        });

        const filteredMinPrice = filteredBedroom.filter((unit: UnitType) => {
          // If the minprice parameter is provided and greater than 0, filter listings
          // that have a price greater than or equal to the parameter
          return minprice && Number(minprice) > 0
            ? unit.startingPrice >= Number(minprice)
            : true;
        });

        const filteredMaxPrice = filteredMinPrice.filter((unit: UnitType) => {
          // If the maxprice parameter is provided and greater than 0, filter listings
          // that have a price less than or equal to the parameter
          return maxprice && Number(maxprice) > 0
            ? unit.startingPrice <= Number(maxprice)
            : true;
        });

        const filteredLocation = filteredMaxPrice.filter((unit: UnitType) => {
          // If the location parameter is provided, filter listings that have the same
          // location as the parameter
          return location ? unit.unitTypeName.includes(location) : true;
        });

        const filteredUnitTypes = filteredLocation;

        // Update the state variables with the filtered data
        setProperties(propertiesData);
        // setListings(FilteredListings);
        setUnitTypes(filteredUnitTypes);
        setDevelopers(developersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Retrieve query parameters
  const bedrooms = searchParams.get("bedrooms") || "";
  const minprice = searchParams.get("minprice") || "";
  const maxprice = searchParams.get("maxprice") || "";
  const location = searchParams.get("location") || "";
  const buyRent = searchParams.get("buyRent") || "";

  console.log("IN FILTER PAGE:");
  console.log("Bedrooms:", bedrooms);
  console.log("Min Price:", minprice);
  console.log("Max Price:", maxprice);
  console.log("Location:", location);
  console.log("Buy/Rent:", buyRent);

  return (
    <div className="pt-12">
      <ListingCardCollection
        // listings={listings}
        unitTypes={unitTypes}
        properties={properties}
        // developers={developers}
        showFilter={true}
      />
    </div>
  );
};

const FilterResultsWrapper: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FilterResultsPage />
  </Suspense>
);

export default FilterResultsWrapper;

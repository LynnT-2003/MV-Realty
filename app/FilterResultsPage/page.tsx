"use client";

import BrowseCarousel from "@/components/BrowseCarouselListing";
import ListingCardCollection from "@/components/ListingCardCollection";
import { Property, Listing, Developer } from "@/types";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const FilterResultsPage: React.FC = () => {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  const getLocalStorage = (key: string) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  };

  const fetchDataWithCache = async (key: string) => {
    const storedData = getLocalStorage(key);
    if (storedData) {
      return storedData;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel, using cached data if available
        const [propertiesData, listingsData, developersData] =
          await Promise.all([
            fetchDataWithCache("properties"),
            fetchDataWithCache("listings"),
            fetchDataWithCache("developers"),
          ]);

        const filteredBedroom = listingsData.filter((listing: Listing) => {
          return bedrooms ? listing.bedroom === Number(bedrooms) : true;
        });

        const filteredMinPrice = filteredBedroom.filter((listing: Listing) => {
          // Check if minprice is provided and greater than 0
          return minprice && Number(minprice) > 0
            ? listing.price >= Number(minprice)
            : true;
        });

        const filteredMaxPrice = filteredMinPrice.filter((listing: Listing) => {
          // Check if maxprice is provided and greater than 0
          return maxprice && Number(maxprice) > 0
            ? listing.price <= Number(maxprice)
            : true;
        });

        const filteredLocation = filteredMaxPrice.filter((listing: Listing) => {
          return location ? listing.listingName.includes(location) : true;
        });

        const FilteredListings = filteredLocation;

        setProperties(propertiesData);
        setListings(FilteredListings);
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
        listings={listings}
        properties={properties}
        developers={developers}
      />
    </div>
  );
};

const FilterResultsWrapper: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <FilterResultsPage />
  </Suspense>
);

export default FilterResultsPage;

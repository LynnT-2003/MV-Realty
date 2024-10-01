"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property, Listing, Developer, Collections, UnitType } from "@/types";
import { fetchAllProperties } from "@/services/PropertyServices";
import BrowseCarouselProperty from "@/components/BrowseCarouselProperty";
import BrowseCarouselCollection from "@/components/BrowseCarouselCollection";
import BrowseCarouselUnitType from "@/components/BrowseCarouselUnitType";
import { fetchAllListings } from "@/services/ListingServices";
import { fetchAllUnitTypes } from "@/services/UnitTypeServices";
import BrowseCarouselListing from "@/components/BrowseCarouselListing";
import { fetchAllDevelopers } from "@/services/DeveloperServices";
import { fetchAllCollections } from "@/services/CollectionsServices";
import HomeSearchSection from "@/components/HomeSearchSection";

const filters = ["Bedrooms", "Price", "Location", "Buy/Rent"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, string[]> = {
  Bedrooms: ["1-Bedroom", "2-Bedroom", "3-Bedroom"],
  Price: ["$0 - $100k", "$100k - $200k", "$200k+"],
  Location: ["New York", "San Francisco", "Chicago", "Los Angeles"],
  "Buy/Rent": ["Buy", "Rent"],
};

const HomePage: React.FC = () => {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [collections, setCollections] = useState<Collections[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);

  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  const [bedroomFilter, setBedroomFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [transactionOption, setTransactionOption] = useState(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, string>>({
    Bedrooms: "",
    Price: "",
    Location: "",
    "Buy/Rent": "",
  });

  const [searchSectionClicked, setSearchSectionClicked] = useState(false);

  const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getLocalStorage = (key: string) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  };

  const fetchDataWithCache = async (
    key: string,
    fetchFunction: () => Promise<any>
  ) => {
    const storedData = getLocalStorage(key);
    if (storedData) {
      return storedData;
    }

    const fetchedData = await fetchFunction();
    setLocalStorage(key, fetchedData);
    return fetchedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel, using cached data if available
        const [
          propertiesData,
          listingsData,
          developersData,
          collectionsData,
          unitTypesData,
        ] = await Promise.all([
          fetchDataWithCache("properties", fetchAllProperties),
          fetchDataWithCache("listings", fetchAllListings),
          fetchDataWithCache("developers", fetchAllDevelopers),
          fetchDataWithCache("collections", fetchAllCollections),
          fetchDataWithCache("unitTypes", fetchAllUnitTypes),
        ]);

        // Update state with fetched data
        setProperties(propertiesData);
        setListings(listingsData);
        setDevelopers(developersData);
        setCollections(collectionsData);
        setUnitTypes(unitTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Active filters: ", selectedValues);
  }, [selectedValues]);

  const fetchProperties = async () => {
    try {
      const response: Property[] = await fetchAllProperties();

      if (!response) {
        throw new Error("Failed to fetch properties.");
      }
      console.log("Fetching properties...");
      setProperties(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchListings = async () => {
    try {
      const response: Listing[] = await fetchAllListings();

      if (!response) {
        throw new Error("Failed to fetch listings.");
      }
      console.log("Fetching listings...");
      setListings(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  const handlePropertyClick = (property: Property) => {
    console.log("Clicked on Property: ", { property });
    router.push(`/Details/${property.slug.current}`);
  };

  const handleSearchSectionClick = () => {
    setSearchSectionClicked(true);
    console.log("Opacity should be low.");
  };

  const handleClickOutsideSearchSection = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!(e.target as HTMLElement).closest(".search-section")) {
      setSearchSectionClicked(false);
      console.log("Opacity reverted!");
    }
  };

  return (
    <div onClick={handleClickOutsideSearchSection}>
      <div className="flex justify-center h-full">
        <HomeSearchSection
          unitTypes={unitTypes}
          properties={properties}
          onSearchSectionClick={handleSearchSectionClick}
          searchActionClicked={searchSectionClicked}
        />
      </div>

      <div
        className={`w-full flex items-center justify-center transition-opacity duration-300 ${searchSectionClicked ? "opacity-50" : "opacity-100"}`}
      >
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[62px] pb-[27px] font-semibold">
            Featured Listings
          </p>
        </div>
      </div>
      <BrowseCarouselListing
        listings={listings}
        properties={properties}
        developers={developers}
        blur={searchSectionClicked}
      />

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[42px] pb-[27px] font-semibold">
            Featured Unit Types
          </p>
        </div>
      </div>
      <BrowseCarouselUnitType
        unitTypes={unitTypes}
        properties={properties}
        developers={developers}
        blur={searchSectionClicked}
      />

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[42px] pb-[27px] font-semibold">
            Featured Properties
          </p>
        </div>
      </div>
      <BrowseCarouselProperty properties={properties} developers={developers} />

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[42px] pb-[0px] font-semibold">
            Curated Listings
          </p>
        </div>
      </div>
      <BrowseCarouselCollection collections={collections} />
    </div>
  );
};

export default HomePage;

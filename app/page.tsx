"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property, Listing, Developer, Collections, UnitType } from "@/types";
import { fetchAllProperties } from "@/services/PropertyServices";
import BrowseCarouselProperty from "@/components/BrowseCarouselProperty";
import BrowseCarouselCollection from "@/components/BrowseCarouselCollection";
import BrowseCarouselUnitType from "@/components/BrowseCarouselUnitType";
import { fetchAllUnitTypes } from "@/services/UnitTypeServices";
import BrowseCarouselListing from "@/components/BrowseCarouselListing";
import { fetchAllDevelopers } from "@/services/DeveloperServices";
import { fetchAllCollections } from "@/services/CollectionsServices";
import HomeSearchSection from "@/components/HomeSearchSection";
import {
  fetchAllListingsFromFeaturedListings,
  fetchAllPropertiesFromFeaturedProperties,
  fetchAllUnitTypeFromFeaturedUnitType,
} from "@/services/FeaturedService";

const filters = ["Bedrooms", "Price", "Location", "Buy/Rent"] as const;

type Filter = (typeof filters)[number];

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [collections, setCollections] = useState<Collections[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [featuredUnitTypes, setFeaturedUnitTypes] = useState<UnitType[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

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
        const [
          propertiesData,
          listingsData,
          developersData,
          collectionsData,
          unitTypesData,
          featuredListingsData,
          featuredUnitTypesData,
          featuredPropertiesData,
        ] = await Promise.all([
          fetchDataWithCache("properties", fetchAllProperties),
          fetchDataWithCache("listings", fetchAllListingsFromFeaturedListings),
          fetchDataWithCache("developers", fetchAllDevelopers),
          fetchDataWithCache("collections", fetchAllCollections),
          fetchDataWithCache("unitTypes", fetchAllUnitTypes),
          fetchDataWithCache(
            "featuredListings",
            fetchAllListingsFromFeaturedListings
          ),
          fetchDataWithCache(
            "featuredUnitTypes",
            fetchAllUnitTypeFromFeaturedUnitType
          ),
          fetchDataWithCache(
            "featuredProperties",
            fetchAllPropertiesFromFeaturedProperties
          ),
        ]);

        // Update state with fetched data
        setProperties(propertiesData);
        setListings(listingsData);
        setDevelopers(developersData);
        setCollections(collectionsData);
        setUnitTypes(unitTypesData);
        setFeaturedListings(featuredListingsData);
        setFeaturedUnitTypes(featuredUnitTypesData);
        setFeaturedProperties(featuredPropertiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
          listings={listings}
          unitTypes={unitTypes}
          properties={properties}
          onSearchSectionClick={handleSearchSectionClick}
          searchActionClicked={searchSectionClicked}
        />
      </div>

      <div
        className={`w-full flex items-center justify-center transition-opacity duration-300 ${searchSectionClicked ? "opacity-50" : "opacity-100"}`}
      >
        {" "}
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[62px] pb-[27px] font-semibold">
            Featured Unit Types
          </p>
        </div>
      </div>
      <BrowseCarouselUnitType
        unitTypes={featuredUnitTypes}
        properties={properties}
        developers={developers}
        blur={searchSectionClicked}
      />

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[38px] pb-[27px] font-semibold">
            Featured Listings
          </p>
        </div>
      </div>
      <BrowseCarouselListing
        listings={featuredListings}
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
      <BrowseCarouselProperty
        properties={featuredProperties}
        developers={developers}
      />

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[42px] pb-[0px] font-semibold">
            Curated Unit Types
          </p>
        </div>
      </div>
      <BrowseCarouselCollection collections={collections} />
    </div>
  );
};

export default HomePage;

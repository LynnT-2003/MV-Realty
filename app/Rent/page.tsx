"use client";
import React, { useState, useEffect } from "react";
import UnitTypeCardCollection from "@/components/UnitTypeCardCollection";
import { fetchAllListings } from "@/services/ListingServices";
import { fetchAllProperties } from "@/services/PropertyServices";
import ListingCardCollection from "@/components/ListingCardCollection";
import listing from "@/sanity/schemas/listing";
import ListingSpecificCardCollection from "@/components/ListingSpecificCardCollection";

const BuyPage = () => {
  const [listings, setListings] = useState([]);
  const [properties, setProperties] = useState([]);

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
        const [listingsData, propertiesData] = await Promise.all([
          fetchDataWithCache("Listings", fetchAllListings),
          fetchDataWithCache("properties", fetchAllProperties),
        ]);
        setListings(listingsData);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ListingSpecificCardCollection
        listings={listings}
        properties={properties}
        showFilter={true}
        showProperties={false}
      />
    </div>
  );
};

export default BuyPage;

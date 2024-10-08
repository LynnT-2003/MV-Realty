"use client";
import React, { useState, useEffect } from "react";
import UnitTypeCardCollection from "@/components/UnitTypeCardCollection";
import { fetchAllUnitTypes } from "@/services/UnitTypeServices";
import { fetchAllProperties } from "@/services/PropertyServices";
import Listing from "@/sanity/schemas/listing";

const BuyPage = () => {
  const [unitTypes, setUnitTypes] = useState([]);
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
        const [unitTypesData, propertiesData] = await Promise.all([
          fetchDataWithCache("unitTypes", fetchAllUnitTypes),
          fetchDataWithCache("properties", fetchAllProperties),
        ]);
        setUnitTypes(unitTypesData);
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div>
        <UnitTypeCardCollection
          unitTypes={unitTypes}
          properties={properties}
          showFilter={true}
        />
      </div>
    </div>
  );
};

export default BuyPage;

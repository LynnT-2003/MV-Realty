"use client";
import React from "react";
import { useState, useEffect } from "react";

const filters = ["Bedrooms", "Price", "Location", "Buy/Rent"];

const page = () => {
  const [properties, setProperties] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {}, [properties]);

  const fetchProperties = async () => {
    try {
      const response = await fetch("http://localhost:8080/properties", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch properties.");
      }
      console.log("Fetching...");
      const data = await response.json();
      setProperties(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <img
          src="/yinlin-banner.webp"
          className="h-[60vh] w-screen object-cover"
        />
      </div>
      <div
        className="flex justify-center items-center w-full absolute"
        style={{ bottom: "-20px" }}
      >
        <div className="inline-flex justify-center items-center shadow-lg md:space-x-24 md:text-base sm:space-x-5 sm:text-lg space-x-5 text-xs py-2 px-10 bg-white rounded">
          {filters.map((filter, i) => (
            <div key={filter} className="md:px-5">
              {filter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;

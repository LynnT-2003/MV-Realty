"use client";
import React from "react";
import { useState, useEffect } from "react";

const Page = () => {
  const [listings, setListings] = useState<any[] | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/condos`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      console.log("Fetching...");
      const data = await response.json();
      setListings(data); // Update listings state with fetched data
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Listings</h1>
      {listings ? (
        <ul>
          {listings.map((listing, index) => (
            <li key={index}>{listing.condoName}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;

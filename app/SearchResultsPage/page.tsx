"use client";
import "./page.css";
import React, { useEffect, useState } from "react";
import { Property, Listing } from "@/types";
import ListingCardCollection from "@/components/ListingCardCollection";

const SearchResultsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedListings = localStorage.getItem("filteredListingsState");
    const storedProperties = localStorage.getItem("filteredPropertiesState");

    if (storedListings) {
      setListings(JSON.parse(storedListings));
    }

    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }
  }, []);

  return (
    <div className=" pt-12">
      <ListingCardCollection listings={listings} properties={properties} />
    </div>
  );
};

export default SearchResultsPage;

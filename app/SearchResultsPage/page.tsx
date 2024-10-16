"use client";
import "./page.css";
import React, { useEffect, useState } from "react";
import { Property, Listing, UnitType } from "@/types";
import UnitTypeCardCollection from "@/components/UnitTypeCardCollection";
import { set } from "sanity";
import ListingCardCollection from "@/components/ListingCardCollection";
import ULPCardCollection from "@/components/ULPCardCollection";

/**
 * SearchResultsPage component renders a list of listings and properties
 * based on the user's search query.
 *
 * The component retrieves the filtered results from localStorage and
 * uses the ListingCardCollection component to display them.
 *
 * @returns {JSX.Element} The rendered SearchResultsPage component
 */

const SearchResultsPage: React.FC = () => {
  /**
   * State variables for listings and properties.
   * These are used to store the filtered results of the user's search query.
   */
  // const [listings, setListings] = useState<Listing[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);

  /**
   * Lifecycle hook that runs once when the component mounts.
   * This hook is used to retrieve the filtered results from localStorage.
   */
  useEffect(() => {
    /**
     * Retrieve the filtered results from localStorage.
     * We use the "filteredListingsState" and "filteredPropertiesState" keys to store the results.
     */
    const storedListings = localStorage.getItem("filteredListingsState");
    const storedProperties = localStorage.getItem("filteredPropertiesState");
    const storedUnitTypes = localStorage.getItem("filteredUnitTypesState");

    /**
     * If the filtered results exist in localStorage, then parse them and set the state variables.
     */
    // if (storedListings) {
    //   setListings(JSON.parse(storedListings));
    // }

    if (storedListings) {
      setListings(JSON.parse(storedListings));
    }

    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }

    if (storedUnitTypes) {
      setUnitTypes(JSON.parse(storedUnitTypes));
    }
  }, []);

  /**
   * The JSX element that renders the SearchResultsPage component.
   * This component renders a list of listings and properties using the ListingCardCollection component.
   * The showFilter prop is set to true, so that the filter section is visible.
   */
  return (
    <div className=" pt-12">
      {/* <ListingCardCollection
        listings={listings}
        properties={properties}
        showFilter={true}
        showProperties={false}
      />
      <UnitTypeCardCollection
        // listings={listings}
        unitTypes={unitTypes}
        properties={properties}
        showFilter={true}
      /> */}
      <ULPCardCollection
        listings={listings}
        unitTypes={unitTypes}
        properties={properties}
        showFilter={true}
        showProperties={true}
      />
    </div>
  );
};

export default SearchResultsPage;

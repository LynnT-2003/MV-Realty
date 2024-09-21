"use client";

import React, { useState, useEffect } from "react";
import { fetchCollectionsById } from "@/services/CollectionsServices";
import { fetchPropertyById } from "@/services/PropertyServices";
import { Property, Listing } from "@/types";
import ListingCardCollection from "@/components/ListingCardCollection";

/**
 * Fetches a collection by id and renders its properties as a list
 *
 * @param {Object} params - The id of the collection to fetch
 * @param {string} params.id - The id of the collection to fetch
 *
 * @returns {JSX.Element} A JSX element containing the properties of the collection
 */

const CollectionsPage = ({ params }: { params: { id: string } }) => {
  /**
   * Get the id from the route parameters
   */
  const { id } = params;

  /**
   * Initialize an empty array to store the listings
   */
  const [listings, setListings] = useState<Listing[]>([]);

  /**
   * Initialize an empty array to store the properties of the collection
   */
  const [collectionProperties, setCollectionProperties] = useState<Property[]>(
    []
  );

  /**
   * Initialize a flag to avoid fetching the collection multiple times
   */
  const [fetched, setFetched] = useState(false);

  /**
   * Fetch the collection by id when the component mounts
   */
  useEffect(() => {
    /**
     * If we haven't fetched the collection yet, fetch it
     */
    if (!fetched) {
      console.log("Fetching collection with id", id);
      fetchCollectionsById(id).then((collectionData) => {
        console.log("Fetched collection data", collectionData);

        /**
         * Extract the property ids from the collection data
         */
        const arrayOfPropertyIds = collectionData?.properties;
        if (arrayOfPropertyIds) {
          /**
           * Fetch each property by id and add it to the collection properties array
           */
          arrayOfPropertyIds.map((propertyId) => {
            fetchPropertyById(propertyId._ref).then((propertyData) => {
              console.log("Fetched property data", propertyData);
              setCollectionProperties((prevProperties) => [
                ...prevProperties,
                propertyData,
              ]);
            });
          });
        }
      });
      setFetched(true); // Mark fetching as done
    }
  }, [id, fetched]);

  return (
    <div className="w-full flex justify-center pb-16">
      <div className="md:max-w-[1320px] w-[95vw]">
        <ListingCardCollection
          /**
           * Pass the listings and properties to the ListingCardCollection component
           */
          listings={listings}
          properties={collectionProperties}
          /**
           * Hide the filter panel
           */
          showFilter={false}
        />
      </div>
    </div>
  );
};

export default CollectionsPage;

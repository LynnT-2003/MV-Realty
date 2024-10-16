"use client";

import React, { useState, useEffect } from "react";
import { fetchCollectionsById } from "@/services/CollectionsServices";
import { fetchPropertyById } from "@/services/PropertyServices";
import { fetchListingsByPropertyId } from "@/services/ListingServices";
import { fetchUnitTypesByPropertyId } from "@/services/UnitTypeServices";
import { Property, Listing, UnitType } from "@/types";
import UnitTypeCardCollection from "@/components/UnitTypeCardCollection";
import unitType from "@/sanity/schemas/unitType";
import UnitTypeSpecificCardCollection from "@/components/UnitTypeSpecificCardCollection";

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
  // const [listings, setListings] = useState<Listing[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
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

              /**
               * Fetch listings for each property by id and add to listings array
              //  */
              // fetchListingsByPropertyId(propertyId._ref).then((listingData) => {
              //   console.log("Fetched listing data", listingData);
              //   setListings((prevListings) => [
              //     ...prevListings,
              //     ...listingData, // Assuming listingData is an array of listings
              //   ]);
              // });
              fetchUnitTypesByPropertyId(propertyId._ref).then(
                (unitTypeData) => {
                  console.log("Fetched unit types data", unitTypeData);
                  setUnitTypes((prevUnitTypes) => [
                    ...prevUnitTypes,
                    ...unitTypeData,
                  ]);
                }
              );
            });

            console.log(unitTypes);
          });
        }
      });
      setFetched(true); // Mark fetching as done
    }
  }, [id, fetched]);

  return (
    <div className="pt-4">
      <UnitTypeSpecificCardCollection
        unitTypes={unitTypes}
        properties={collectionProperties}
        showFilter={true}
      />
    </div>
  );
};

export default CollectionsPage;

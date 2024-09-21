"use client";

import React, { useState, useEffect } from "react";
import { fetchCollectionsById } from "@/services/CollectionsServices";
import { fetchPropertyById } from "@/services/PropertyServices";
import { Property, Listing } from "@/types";
import ListingCardCollection from "@/components/ListingCardCollection";

const CollectionsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [listings, setListings] = useState<Listing[]>([]);
  const [collectionProperties, setCollectionProperties] = useState<Property[]>(
    []
  );
  const [fetched, setFetched] = useState(false); // Flag to avoid fetching multiple times

  useEffect(() => {
    if (!fetched) {
      console.log("id", id);
      fetchCollectionsById(id).then((collectionData) => {
        console.log("collectionData", collectionData);
        const arrayOfPropertyIds = collectionData?.properties;
        if (arrayOfPropertyIds) {
          arrayOfPropertyIds.map((propertyId) => {
            fetchPropertyById(propertyId._ref).then((propertyData) => {
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
          listings={listings}
          properties={collectionProperties}
          showFilter={false}
        />
      </div>
    </div>
  );
};

export default CollectionsPage;

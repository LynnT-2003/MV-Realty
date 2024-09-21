"use client";

import React, { useState, useEffect } from "react";
import { fetchCollectionsById } from "@/services/CollectionsServices";
import { fetchPropertyById } from "@/services/PropertyServices";
import { Property } from "@/types";

const CollectionsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

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
    <div>
      {collectionProperties.map((property) => (
        <div key={property._id}>{property.title}</div>
      ))}
    </div>
  );
};

export default CollectionsPage;

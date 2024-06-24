'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Property } from "../../types";

const fetchPropertiesFromSanity = async (): Promise<Property[]> => {
  return await client.fetch(`*[_type == "property"]`);
};

const PropertyPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getPropertiesFromLocalStorage = (): Property[] | null => {
      const storedProperties = localStorage.getItem("properties");
      if (storedProperties) {
        return JSON.parse(storedProperties);
      }
      return null;
    };

    const storePropertiesInLocalStorage = (properties: Property[]) => {
      localStorage.setItem("properties", JSON.stringify(properties));
    };

    const fetchProperties = async () => {
      const localProperties = getPropertiesFromLocalStorage();
      if (localProperties) {
        setProperties(localProperties);
      } else {
        const fetchedProperties = await fetchPropertiesFromSanity();
        setProperties(fetchedProperties);
        storePropertiesInLocalStorage(fetchedProperties);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = (slug: string) => {
    console.log("Clicked on property with slug:", slug);
    router.push(`/Property/${slug}`);
  };

  return (
    <div>
      {properties.map((property) => (
        <div key={property._id} onClick={() => handlePropertyClick(property.slug.current)} style={{ cursor: 'pointer' }}>
          <h1>{property.title}</h1>
          <p>Developer: {property.developer}</p>
          <p>{property.description}</p>
          <p>
            Coordinates: {property.coordinates.lat}, {property.coordinates.lng}
          </p>
          <p>Min Price: ${property.minPrice}</p>
          <p>Max Price: ${property.maxPrice}</p>
          <div>
            <h2>Facilities:</h2>
            <ul>
              {property.facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Photos:</h2>
            {property.photos.map((photo) => (
              <img
                key={photo._key}
                src={urlForImage(photo)}
                alt={property.title}
              />
            ))}
          </div>
          <p>Built: {property.built}</p>
          <p>Created at: {new Date(property.createdAt).toDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyPage;

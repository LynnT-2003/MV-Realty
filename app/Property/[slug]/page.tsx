'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Property } from "../../../types";

const fetchPropertyBySlug = async (slug: string): Promise<Property> => {
  return await client.fetch(`*[_type == "property" && slug.current == $slug][0]`, { slug });
};

const PropertyDetailPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { slug } = params;
  const [property, setProperty] = React.useState<Property | null>(null);

  React.useEffect(() => {
    if (slug) {
      fetchPropertyBySlug(slug).then(setProperty);
    }
  }, [slug]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
  );
};

export default PropertyDetailPage;

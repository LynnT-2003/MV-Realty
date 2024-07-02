"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Property } from "../../../types";
import { fetchPropertyBySlug } from "@/services/PropertyServices";

import { DetailsBento } from "@/components/DetailsBento";
import { DetailsImageGridLayout } from "@/components/DetailsImageGrid";
import { LayoutGridDemo } from "@/components/HomeLayoutGrid";

const PropertyDetailPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { slug } = params;
  const [property, setProperty] = React.useState<Property | null>(null);

  React.useEffect(() => {
    if (slug) {
      fetchPropertyBySlug(slug).then(setProperty);
      console.log("Setting property");
    }
  }, [slug]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DetailsImageGridLayout />
      <div className="pl-6">
        <h1 className="text-3xl font-medium pb-2">
          Life Rama 4-Asoke : ไลฟ์ พระราม 4 - อโศก, กรุงเทพ
        </h1>
        <h1 className="subtitle font-medium text-slate-600 pb-1">
          Choose Everything Moving From Work From Home To Work From Anywhere
        </h1>
        <h1 className="address font-base text-slate-500 pb-48">
          Rama 4 Road, Khlong Toei, Khlong Toei, Bangkok
        </h1>
      </div>

      {/* <h1>{property.title}</h1>
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
          <img key={photo._key} src={urlForImage(photo)} alt={property.title} />
        ))}
      </div>
      <p>Built: {property.built}</p>
      <p>Created at: {new Date(property.createdAt).toDateString()}</p> */}
    </div>
  );
};

export default PropertyDetailPage;

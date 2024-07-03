"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Grid from "@mui/material/Grid";
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

      <Grid container spacing={0} className="w-screen mx-auto px-4">
        <Grid item md={7}>
          {/* Title and Subtitle */}
          <div className="flex pt-3">
            <div className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                height="100"
                width="100"
                className="pl-2"
              />
            </div>
            <div className="pl-5">
              <h1 className="text-xs md:text-3xl font-medium pb-2">
                Life Rama 4-Asoke : ไลฟ์ พระราม 4 - อโศก, กรุงเทพ
              </h1>
              <h1 className="subtitle text-xs md:text-base font-medium text-slate-600 pb-1">
                Choose Everything Moving From Work From Home To Work From
                Anywhere
              </h1>
              <h1 className="address text-xs md:text-base font-base text-slate-500">
                Rama 4 Road, Khlong Toei, Khlong Toei, Bangkok
              </h1>
            </div>
          </div>

          {/* Details 1 */}
          <Grid container spacing={2} className="pt-8 pl-[1vw]s">
            <Grid item md={5}>
              <h1>Starting from ฿2,538,000</h1>
              <div className="flex">
                <h1>Mortgage</h1>
                <h1 className="pl-2 text-red-500">฿9,630 / mo</h1>
              </div>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>

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

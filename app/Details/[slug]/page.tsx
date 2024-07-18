"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import { Button } from "@/components/ui/button";
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

      <div className="md:hidden w-screen mx-auto px-4 pb-2">
        <img
          alt="Detail Banner"
          src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-screen h-[25vh] rounded-lg shadow-lg mb-4"
        />
      </div>

      <Grid container spacing={0} className="w-screen mx-auto px-4">
        <Grid item md={7}>
          {/* Title and Subtitle */}
          <div className="flex md:pt-6">
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Logo"
                className="md:pl-2 md:w-24 md:h-24 w-12 h-12"
              />
            </div>
            <div className="pl-4 md:pl-5">
              <h1 className="text-base md:text-3xl font-medium md:pb-2">
                {property.title}
              </h1>
              <h1 className="subtitle hidden md:block text-xs md:text-base md:font-medium text-slate-600 pb-1">
                Choose Everything Moving From Work From Home To Work From
                Anywhere
              </h1>
              <h1 className="address text-xs md:text-base font-base text-slate-500">
                Rama 4 Road, Khlong Toei, Khlong Toei, Bangkok
              </h1>
            </div>
          </div>

          {/* Details 1 */}
          {/* <Grid container spacing={2} className="pt-8 pl-[1vw]s">
            <Grid item md={5} className="hidden">
              <h1>Starting from ฿2,538,000</h1>
              <div className="flex">
                <h1>Mortgage</h1>
                <h1 className="pl-2 text-red-500">฿9,630 / mo</h1>
              </div>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid> */}
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>

      <div className="flex pt-4 md:gap-8 gap-4 pl-6">
        <Button variant="outline" className="md:h-12 md:text-lg h-6 font-light">
          Photos
        </Button>
        <Button variant="outline" className="md:h-12 md:text-lg h-6 font-light">
          Developer
        </Button>
        <Button variant="outline" className="md:h-12 md:text-lg h-6 font-light">
          Location
        </Button>
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

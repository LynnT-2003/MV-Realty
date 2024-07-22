"use client";
import React from "react";
import { useEffect } from "react";
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

import MapDemo from "@/components/MapDemo";
import developer from "@/sanity/schemas/developer";

const PropertyDetailPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { slug } = params;
  const [property, setProperty] = React.useState<Property | null>(null);

  React.useEffect(() => {
    if (slug) {
      fetchPropertyBySlug(slug).then(setProperty);
      console.log("Setting property");
      console.log("Developer: ", property?.developer);
      console.log(property?.photos);
    }
  }, [slug]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Grid container spacing={0} className="w-screen mx-auto px-[15%] pt-[5%]">
        <Grid item md={7}>
          {/* Title and Subtitle */}
          <div className="flex md:pt-6">
            <div className="flex-shrink-0">
              <img
                // src={urlForImage(property.developer.profileIcon)}
                src="/logo.png"
                alt="Logo"
                className="md:pl-2 md:w-48 md:h-48 macbook-air:w-38 macbook-air:h-38 w-12 h-12"
              />
            </div>
            <div className="pl-4 md:pl-10 flex flex-col justify-center">
              <h1 className="text-base md:text-5xl macbook-air:text-4xl font-medium md:pb-4">
                {property.title}
              </h1>
              <h1 className="subtitle hidden md:block text-md md:text-xl macbook-air:text-lg md:font-medium text-slate-600 pb-4">
                {/* Choose Everything Moving From Work From Home To Work From
                Anywhere */}
                {property.description}
              </h1>
              <h1 className="address text-xs md:text-lg macbook-air:text-base font-base text-slate-500">
                {/* Rama 4 Road, Khlong Toei, Khlong Toei, Bangkok */}
                {property.description}
              </h1>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>

      <div className="md:flex hidden pt-[2%] md:gap-8 md:px-[15%] gap-4 pb-[5%]">
        <Button
          variant="outline"
          className="md:h-16 md:text-2xl macbook-air:text-base macbook-air:h-12 md:px-8 h-6 font-light"
        >
          Photos
        </Button>
        <Button
          variant="outline"
          className="md:h-16 md:text-2xl macbook-air:text-base macbook-air:h-12 md:px-8 h-6 font-light"
        >
          Information
        </Button>
        <Button
          variant="outline"
          className="md:h-16 md:text-2xl macbook-air:text-base macbook-air:h-12 md:px-8 h-6 font-light"
        >
          Location
        </Button>
        <Button
          variant="outline"
          className="md:h-16 md:text-2xl macbook-air:text-base macbook-air:h-12 md:px-8 h-6 font-light"
        >
          Gallery
        </Button>
      </div>

      <DetailsImageGridLayout photos={property.photos} />

      <div className="md:hidden w-screen mx-auto pb-2">
        <img
          alt="Detail Banner"
          src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="w-screen h-[25vh] rounded-lg shadow-lg mb-4"
        />
      </div>

      <MapDemo lat={property.geoLocation.lat} lng={property.geoLocation.lng} />
    </div>
  );
};

export default PropertyDetailPage;

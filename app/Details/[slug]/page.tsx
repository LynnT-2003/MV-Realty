"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import { Button } from "@/components/ui/button";
import { Developer, Property } from "../../../types";
import { fetchPropertyBySlug } from "@/services/PropertyServices";
import { fetchDeveloperById } from "@/services/DeveloperServices";

import { DetailsBento } from "@/components/DetailsBento";
import { DetailsImageGridLayout } from "@/components/DetailsImageGrid";
import { LayoutGridDemo } from "@/components/HomeLayoutGrid";

import MapDemo from "@/components/MapDemo";
import developer from "@/sanity/schemas/developer";
import PropertyDetailsImageBento from "@/components/PropertyDetailsImageBento";
import PropertyDetailsIntro from "@/components/PropertyDetailsIntro";

const PropertyDetailPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { slug } = params;
  const [property, setProperty] = React.useState<Property | null>(null);
  const [developer, setDeveloper] = React.useState<Developer | null>(null);

  React.useEffect(() => {
    if (slug) {
      fetchPropertyBySlug(slug).then((propertyData) => {
        setProperty(propertyData);
        if (propertyData?.developer) {
          fetchDeveloperById(propertyData.developer._ref).then(setDeveloper);
        }
      });
    }
  }, [slug]);

  if (!property || !developer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PropertyDetailsImageBento propertyDetails={property} />
      <PropertyDetailsIntro propertyDetails={property} />

      {/* <div>
        <p>Facilities</p>
        <DetailsImageGridLayout photos={property.photos} />
      </div> */}

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

"use client";
import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlForFile, urlForImage } from "@/sanity/lib/image";
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

const downloadFile = (url: string) => {
  if (!url) return;

  fetch(url).then(response=>response.blob()).then(blob => {
    const blobURL = window.URL.createObjectURL(new Blob([blob]));
    const aTag = document.createElement('a');
    aTag.href = blobURL;
    aTag.setAttribute('download', 'brochure.pdf');
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  })
};

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

  console.log(property);

  const pdf_file_url = property.brochure
    ? urlForFile(property.brochure) // Generate the correct URL for the PDF
    : null;

  return (
    <div>
      <PropertyDetailsImageBento propertyDetails={property} />
      <PropertyDetailsIntro propertyDetails={property} />

      {/* <div>
        <p>Facilities</p>
        <DetailsImageGridLayout photos={property.photos} />
      </div> */}

      <div className="w-full flex justify-center mb-24 pb-24 md:pb-20">
        <div className="md:max-w-[1100px] w-[100vw] md:max-h-[805px] h-[80vw]">
          <MapDemo
            lat={property.geoLocation.lat}
            lng={property.geoLocation.lng}
          />
        </div>
      </div>
      <div className="w-full flex justify-center mb-24 pb-24 md:pb-20">

        <Button onClick={() => {
            if (pdf_file_url) downloadFile(pdf_file_url);
          }}>Download Brochure</Button>
      </div>
    </div>
  );
};

export default PropertyDetailPage;

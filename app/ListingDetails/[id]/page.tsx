"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Developer, Listing, Property } from "../../../types";
import { fetchPropertyBySlug } from "@/services/PropertyServices";
import { fetchDeveloperById } from "@/services/DeveloperServices";

import { DetailsBento } from "@/components/DetailsBento";
import { DetailsImageGridLayout } from "@/components/DetailsImageGrid";
import { LayoutGridDemo } from "@/components/HomeLayoutGrid";

import MapDemo from "@/components/MapDemo";
import PropertyDetailsImageBento from "@/components/PropertyDetailsImageBento";
import PropertyDetailsIntro from "@/components/PropertyDetailsIntro";
import { fetchListingById } from "@/services/ListingServices";
import ListingDetailsImageBento from "@/components/ListingDetailsImageBento";
import ListingDetailsIntro from "@/components/ListingDetailsIntro";
import FaqSection from "@/components/FaqSection";

const ListingDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [listing, setListing] = React.useState<Listing | null>(null);
  //   const [developer, setDeveloper] = React.useState<Developer | null>(null);

  //   React.useEffect(() => {
  //     if (slug) {
  //       fetchPropertyBySlug(slug).then((propertyData) => {
  //         setProperty(propertyData);
  //         if (propertyData?.developer) {
  //           fetchDeveloperById(propertyData.developer._ref).then(setDeveloper);
  //         }
  //       });
  //     }
  //   }, [slug]);

  React.useEffect(() => {
    if (id) {
      fetchListingById(id).then((listingData) => {
        console.log("Received ID: ", id);
        setListing(listingData);
        // if (listingData?.property) {
        // }
      });
    }
  }, [id]);

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <PropertyDetailsImageBento propertyDetails={property} />
      <PropertyDetailsIntro propertyDetails={property} /> */}

      <ListingDetailsImageBento listingDetails={listing} />
      <ListingDetailsIntro listingDetails={listing} />

      <FaqSection />

      {/* <MapDemo lat={property.geoLocation.lat} lng={property.geoLocation.lng} /> */}
    </div>
  );
};

export default ListingDetailPage;

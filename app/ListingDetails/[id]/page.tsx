"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Developer, Listing, Property } from "../../../types";
import {
  fetchPropertyById,
  fetchPropertyBySlug,
} from "@/services/PropertyServices";
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
  const [property, setProperty] = React.useState<Property | null>(null);
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

        // Fetch and log the associated property
        const propertyId = listingData.property._ref;
        fetchPropertyById(propertyId).then((propertyData) => {
          setProperty(propertyData);
        });
      });
    }
  }, [id]);

  if (!listing || !property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <PropertyDetailsImageBento propertyDetails={property} />
      <PropertyDetailsIntro propertyDetails={property} /> */}
      <ListingDetailsImageBento
        listingDetails={listing}
        propertyDetails={property}
      />
      <ListingDetailsIntro listingDetails={listing} />
      <FaqSection />

      <div className="w-full flex justify-center pb-6">
        <div className="md:max-w-[1150px] w-[85vw]">
          <p className="poppins-text-title-small md:property-details-title-text">
            Location
          </p>
        </div>
      </div>

      <div className="w-full flex justify-center mb-24 pb-24 md:pb-20">
        <div className="md:max-w-[1100px] w-[100vw] md:max-h-[805px] h-[80vw]">
          <MapDemo
            lat={property?.geoLocation.lat}
            lng={property?.geoLocation.lng}
          />
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;

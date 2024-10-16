"use client";
import React from "react";
import { PopupButton } from "react-calendly";
import { useRouter } from "next/navigation";
import { FacilityType, Listing, Property } from "../../../types";
import { fetchPropertyById } from "@/services/PropertyServices";

import MapDemo from "@/components/MapDemo";
import { fetchListingById } from "@/services/ListingServices";
import ListingDetailsImageBento from "@/components/ListingDetailsImageBento";
import ListingDetailsIntro from "@/components/ListingDetailsIntro";
import FaqSection from "@/components/FaqSection";
import FacilitiesAccordion from "@/components/FacilitiesAccordion";
import { fetchAllFacilityTypes } from "@/services/FacilityServices";
import { urlForFile } from "@/sanity/lib/image";
import LoadingPage from "./loading";
import NearbyAmenities from "@/components/NearbyAmeneties";

const downloadFile = (url: string) => {
  if (!url) return "No Url";

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = window.URL.createObjectURL(new Blob([blob]));
      const aTag = document.createElement("a");
      aTag.href = blobURL;
      aTag.setAttribute("download", "brochure.pdf");
      document.body.appendChild(aTag);
      aTag.click();
      aTag.remove();
    });
};

/**
 * A page that displays a single listing and its associated property.
 * Given a listing id, fetches the listing and its associated property.
 * Fetches all facility types and displays them in a accordion.
 * Displays the location of the property on a map.
 * Allows the user to schedule a viewing or download the property brochure.
 *
 * @param {Object} params - The id of the listing to fetch.
 * @param {string} params.id - The id of the listing to fetch.
 */

const ListingDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  // Create a state variable to hold the retrieved listing
  const [listing, setListing] = React.useState<Listing | null>(null);

  // Create a state variable to hold the retrieved property
  const [property, setProperty] = React.useState<Property | null>(null);

  // Create a state variable to hold the retrieved facility types
  const [facilityType, setFacilityType] = React.useState<FacilityType[]>([]);

  // Create a state variable to control the loading state
  const [loading, setLoading] = React.useState(true);

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

  // When the component mounts, fetch the listing and the associated property
  // and facility types
  React.useEffect(() => {
    if (id) {
      // Fetch the listing
      fetchListingById(id).then((listingData) => {
        console.log("Received ID: ", id);
        setListing(listingData);

        // Fetch the associated property
        const propertyId = listingData.property._ref;
        fetchPropertyById(propertyId).then((propertyData) => {
          setProperty(propertyData);
        });
      });

      // Fetch all facility types
      fetchAllFacilityTypes().then((facilityTypeData) => {
        console.log("Fetched all Facility Types", facilityTypeData);
        setFacilityType(facilityTypeData);
      });

      // Set a timer to stop loading after some time
      const timer = setTimeout(() => {
        setLoading(false); // Stop loading after some time or when data is ready
      }, 1000);

      // When the effect is cleaned up, clear the timer
      return () => clearTimeout(timer);
    }
  }, [id]);

  // If the loading is in progress or the data is not ready, return the loading page
  if (!listing || !property || loading) {
    return <LoadingPage />;
  }

  // Log the property data
  console.log(property);

  // Generate the URL for the PDF file
  const pdf_file_url = property.brochure
    ? urlForFile(property.brochure) // Generate the correct URL for the PDF
    : null;

  return (
    <div>
      <ListingDetailsImageBento
        listingDetails={listing}
        propertyDetails={property}
      />
      <ListingDetailsIntro listingDetails={listing} property={property} />

      <FaqSection propertyDetails={property} />

      <FacilitiesAccordion
        propertyDetails={property}
        facilityTypeDetails={facilityType}
      />

      <div className="container mx-auto p-8">
        <NearbyAmenities property={property} />
      </div>

      <div className="w-full flex justify-center pb-6">
        <div className="md:max-w-[1150px] w-[85vw]">
          <p className="poppins-text-title-small md:property-details-title-text">
            Location
          </p>
        </div>
      </div>

      <div className="w-full flex justify-center pb-24 md:pb-12 px-4 lg:px-0">
        <div className="md:max-w-[1100px] w-[100vw] ">
          <MapDemo
            lat={property?.geoLocation.lat}
            lng={property?.geoLocation.lng}
          />
        </div>
      </div>

      <div className="w-full flex justify-center pb-12 md:pb-6 px-4 lg:px-0">
        <div className="md:max-w-[1100px] w-[100vw] flex gap-4 lg:gap-16">
          <PopupButton
            className="w-1/2 py-3 bg-[#193158] hover:bg-[#132441] text-white text-sm font-bold rounded-lg shadow-md"
            url="https://calendly.com/mahavertex-info/in-person-viewing"
            rootElement={document.getElementById("root") || document.body}
            text="Schedule a viewing"
          />
          <button
            onClick={() => {
              if (pdf_file_url) downloadFile(pdf_file_url);
            }}
            className="w-1/2 py-3 bg-[#193158] hover:bg-[#132441] text-white text-sm font-bold rounded-lg shadow-md"
          >
            Download Brochure
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;

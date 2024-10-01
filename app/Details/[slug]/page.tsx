"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { urlForFile, urlForImage } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import {
  Developer,
  Facility,
  FacilityType,
  Listing,
  Property,
  UnitType,
} from "../../../types";
import { fetchPropertyBySlug } from "@/services/PropertyServices";
import { fetchDeveloperById } from "@/services/DeveloperServices";
import MapDemo from "@/components/MapDemo";
import PropertyDetailsImageBento from "@/components/PropertyDetailsImageBento";
import PropertyDetailsIntro from "@/components/PropertyDetailsIntro";
import FacilitiesAccordion from "@/components/FacilitiesAccordion";
import { fetchAllFacilityTypes } from "@/services/FacilityServices";
import { PopupButton } from "react-calendly";
import LoadingPage from "./loading";
import InfiniteMovingCardsDemo from "@/components/infinite-cards-demo";
import { fetchListingsByPropertyId } from "@/services/ListingServices";
import FaqSection from "@/components/FaqSection";
import { fetchUnitTypesByPropertyId } from "@/services/UnitTypeServices";
import BrowseCarouselForProperty from "@/components/BrowseCarouselListingForProperty";

const downloadFile = (url: string) => {
  if (!url) return;

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
 * The PropertyDetailPage component is responsible for rendering the details of a property with a given slug.
 * The PropertyDetailPage component renders the details of a property with a given slug.
 * It fetches the property data, associated listings, developer, and facility types,
 * and shows a loading page until all the data is ready.
 * It also shows a map demo component and buttons for scheduling a viewing and downloading the brochure.
 *
 * The component takes in a `params` object as a prop, which contains the value of the `slug` parameter from the URL.
 * It uses this value to fetch the data for the property with the given slug, and then renders the property details page.
 *
 * The component fetches the property data, associated listings, developer, and facility types
 * and shows a loading page until all the data is ready.
 * It also shows a map demo component and buttons for scheduling a viewing and downloading the brochure.
 *
 * @param {Object} params - The object containing the value of the `slug` parameter from the URL
 * @param {string} params.slug - The slug of the property to render
 * @returns {JSX.Element} The JSX element for the property details page
 */

const PropertyDetailPage = ({ params }: { params: { slug: string } }) => {
  // The `params` object contains the value of the `slug` parameter from the URL
  const router = useRouter();
  const { slug } = params;

  // Initialize the state variables
  const [property, setProperty] = React.useState<Property | null>(null);
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [unitTypes, setUnitTypes] = React.useState<UnitType[]>([]);
  const [developer, setDeveloper] = React.useState<Developer | null>(null);
  const [facilityType, setFacilityType] = React.useState<FacilityType[]>([]);
  const [loading, setLoading] = React.useState(true);

  // When the component mounts, fetch the data for the property with the given slug
  // and its associated listings, developer, and facility types
  // and show a loading page until all the data is ready
  React.useEffect(() => {
    if (slug) {
      // Fetch the property with the given slug
      // and set the property state to the fetched data
      fetchPropertyBySlug(slug).then((propertyData) => {
        setProperty(propertyData);
        if (propertyData?.developer) {
          // Fetch the developer associated with the property
          // and set the developer state to the fetched data
          fetchDeveloperById(propertyData.developer._ref).then(setDeveloper);
        }
        if (propertyData._id) {
          // Fetch the listings associated with the property
          // and set the listings state to the fetched data
          fetchListingsByPropertyId(propertyData._id).then(setListings);
          fetchUnitTypesByPropertyId(propertyData._id).then(
            (fetchedUnitTypes) => {
              console.log("Fetched Unit Types:", fetchedUnitTypes);
              setUnitTypes(fetchedUnitTypes);
            }
          );
        }
      });

      // Fetch all facility types
      // and set the facilityType state to the fetched data
      fetchAllFacilityTypes().then((facilityTypeData) => {
        console.log("Fetched all Facility Types", facilityTypeData);
        setFacilityType(facilityTypeData);
      });

      // Set a timer to stop loading after some time or when data is ready
      const timer = setTimeout(() => {
        setLoading(false); // Stop loading after some time or when data is ready
      }, 1000);

      // Clean up the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [slug]);

  // If the component is still loading or if any of the data is missing, show a loading page
  if (!property || !developer || loading) {
    return <LoadingPage />;
  }

  // Log the property data to the console
  console.log("Listings", listings);

  // If the property has a brochure, generate the correct URL for the PDF
  const pdf_file_url = property.brochure ? urlForFile(property.brochure) : null;

  // Return the JSX for the property details page
  return (
    <div>
      {/* Show the property details image bento component */}
      <PropertyDetailsImageBento propertyDetails={property} />

      {/* Show the property details intro component */}
      <PropertyDetailsIntro
        propertyDetails={property}
        developer={developer}
        // listings={listings}
        unitTypes={unitTypes}
      />

      <FaqSection propertyDetails={property}/>

      <div
        className={`w-full flex items-center justify-center transition-opacity duration-300`}
      >
        <div className="xl:w-[1200px]">
          <p className="poppins-text pt-[15px] pb-[27px] font-semibold">
            Featured Listings Trom This Property
          </p>
        </div>
      </div>
      <BrowseCarouselForProperty
        listings={listings}
        properties={property}
      />
      {/* Show the facilities accordion component */}
      <FacilitiesAccordion
        propertyDetails={property}
        facilityTypeDetails={facilityType}
      />

      {/* Show the map demo component */}
      <div className="w-full flex justify-center pb-24 md:pb-12 px-4 lg:px-0">
        <div className="md:max-w-[1100px] w-[100vw] ">
          <MapDemo
            lat={property.geoLocation.lat}
            lng={property.geoLocation.lng}
          />
        </div>
      </div>

      {/* Show the buttons for scheduling a viewing and downloading the brochure */}

      <div className="w-full flex justify-center pb-12 md:pb-6 px-4 lg:px-0">
        <div className="md:max-w-[1100px] w-[100vw] flex gap-4 lg:gap-16">
          <PopupButton
            className="w-1/2 py-3 bg-[#193158] hover:bg-[#132441] text-white text-sm font-bold rounded-lg shadow-md"
            url="https://calendly.com/tanat-navin/30min"
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

export default PropertyDetailPage;

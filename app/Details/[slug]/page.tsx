"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { urlForFile, urlForImage } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { Developer, Facility, FacilityType, Property } from "../../../types";
import { fetchPropertyBySlug } from "@/services/PropertyServices";
import { fetchDeveloperById } from "@/services/DeveloperServices";
import MapDemo from "@/components/MapDemo";
import PropertyDetailsImageBento from "@/components/PropertyDetailsImageBento";
import PropertyDetailsIntro from "@/components/PropertyDetailsIntro";
import FacilitiesAccordion from "@/components/FacilitiesAccordion";
import { fetchAllFacilityTypes } from "@/services/FacilityServices";
import { PopupButton } from "react-calendly";
import LoadingPage from "./loading";

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

const PropertyDetailPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { slug } = params;
  const [property, setProperty] = React.useState<Property | null>(null);
  const [developer, setDeveloper] = React.useState<Developer | null>(null);
  const [facilityType, setFacilityType] = React.useState<FacilityType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      fetchPropertyBySlug(slug).then((propertyData) => {
        setProperty(propertyData);
        if (propertyData?.developer) {
          fetchDeveloperById(propertyData.developer._ref).then(setDeveloper);
        }
      });

      fetchAllFacilityTypes().then((facilityTypeData) => {
        console.log("Fetched all Facility Types", facilityTypeData);
        setFacilityType(facilityTypeData);
      });

      const timer = setTimeout(() => {
        setLoading(false); // Stop loading after some time or when data is ready
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [slug]);

  if (!property || !developer || loading) {
    return <LoadingPage/>;
  }

  console.log(property);

  const pdf_file_url = property.brochure
    ? urlForFile(property.brochure) // Generate the correct URL for the PDF
    : null;

  return (
    <div>
      <PropertyDetailsImageBento propertyDetails={property} />
      <PropertyDetailsIntro
        propertyDetails={property} developer={developer}
      />

      <FacilitiesAccordion
        propertyDetails={property}
        facilityTypeDetails={facilityType}
      />

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
      <div className="w-full flex justify-center gap-16 mb-24 pb-24 px-56 md:pb-20">
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
  );
};

export default PropertyDetailPage;

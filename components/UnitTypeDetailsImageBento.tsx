"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import { Listing, Property, UnitType } from "@/types";
import { urlForImage } from "@/sanity/lib/image";
import { useState } from "react";
import { Lens } from "./ui/lens";
import ImageViewer from "awesome-image-viewer"; // Import image viewer

interface UnitTypeDetailsImageBentoProps {
  unitTypeDetails: UnitType;
  propertyDetails: Property;
}

const UnitTypeDetailsImageBento: React.FC<UnitTypeDetailsImageBentoProps> = ({
  unitTypeDetails,
  propertyDetails,
}) => {
  console.log("Unit Type Details:", unitTypeDetails);
  const [hovering, setHovering] = useState(false);

  const allImages = [
    unitTypeDetails.unitHero,
    unitTypeDetails.floorPlan,
    propertyDetails.propertyHero,
    ...unitTypeDetails.unitPhoto,
  ].map((image) => ({
    mainUrl: urlForImage(image),
  }));

  const handleImageClick = (index: number) => {
    new ImageViewer({
      images: allImages,
      currentSelected: index, // Index starts at 1 for ImageViewer
      isZoomable: false,
    });
  };

  return (
    <div className="w-full flex justify-center pt-3 pb-8 md:pb-20">
      {/* Desktop view */}
      <div className="md:max-w-[1200px] w-[95vw] hidden md:block">
        <Grid container spacing={{ xs: 0.5, md: 1.5 }}>
          <Grid item xs={6}>
            <div onClick={() => handleImageClick(0)}>
              <img
                src={urlForImage(unitTypeDetails.unitHero)}
                alt="Unit Hero"
                className="w-full h-full rounded-lg cursor-pointer hover:brightness-75 transition duration-300"
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div>
              <Grid
                container
                rowSpacing={0}
                columnSpacing={{ xs: 0.5, md: 1.5 }}
              >
                <Grid item xs={6}>
                  <div onClick={() => handleImageClick(3)}>
                    <img
                      src={urlForImage(unitTypeDetails.unitPhoto[0])}
                      alt="Unit Photo 1"
                      className="rounded-lg cursor-pointer hover:brightness-75 transition duration-300"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div onClick={() => handleImageClick(1)}>
                    <img
                      src={urlForImage(unitTypeDetails.floorPlan)}
                      alt="Floor Plan"
                      className="rounded-lg cursor-pointer hover:brightness-75 transition duration-300"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="pt-0.5 md:pt-2"
                    onClick={() => handleImageClick(4)}
                  >
                    <img
                      src={urlForImage(unitTypeDetails.unitPhoto[1])}
                      alt="Unit Photo 2"
                      className="rounded-lg cursor-pointer hover:brightness-75 transition duration-300"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="pt-0.5 md:pt-2"
                    onClick={() => handleImageClick(2)}
                  >
                    <img
                      src={urlForImage(propertyDetails.propertyHero)}
                      alt="Property Hero"
                      className="rounded-lg cursor-pointer hover:brightness-75 transition duration-300"
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Mobile view */}
      <div className="md:max-w-[1200px] w-[92vw] md:hidden">
        <img
          src={urlForImage(unitTypeDetails.unitHero)}
          alt="Unit Hero"
          className="rounded-lg"
          onClick={() => handleImageClick(0)} // Open image viewer on click for mobile
        />
      </div>
    </div>
  );
};

export default UnitTypeDetailsImageBento;

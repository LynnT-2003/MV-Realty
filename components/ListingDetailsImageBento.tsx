"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import { Listing, Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";
import { useState } from "react";
import { Lens } from "./ui/lens";
import ImageViewer from "awesome-image-viewer"; // Import the package


interface ListingDetailsImageBentoProps {
  listingDetails: Listing;
  propertyDetails: Property;
}

const ListingDetailsImageBento: React.FC<ListingDetailsImageBentoProps> = ({
  listingDetails,
  propertyDetails,
}) => {
  console.log("Listing Details:", listingDetails);
  const [hovering, setHovering] = useState(false);

  const allImages = [
    listingDetails.listingHero,
    listingDetails.floorPlan,
    propertyDetails.propertyHero,
    ...listingDetails.listingPhoto,
  ].map((image) => ({
    mainUrl: urlForImage(image),
  }));

  const handleImageClick = (index: number) => {
    new ImageViewer({
      images: allImages,
      currentSelected: index, // Index starts at 1 for ImageViewer
    });
  };

  return (
    <div className="w-full flex justify-center pt-3 pb-12 md:pb-20">
      {/* Desktop view */}
      <div className="md:max-w-[1200px] w-[95vw] hidden md:block">
        <Grid container spacing={{ xs: 0.5, md: 1.5 }}>
          <Grid item xs={6}>
            <div onClick={() => handleImageClick(0)}>
              <img
                src={urlForImage(listingDetails.listingHero)}
                alt="Listing Hero"
                className="w-full h-full rounded-lg cursor-pointer"
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
                      src={urlForImage(listingDetails.listingPhoto[0])}
                      alt="Listing Photo 1"
                      className="rounded-lg cursor-pointer"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div onClick={() => handleImageClick(1)}>
                    <img
                      src={urlForImage(listingDetails.floorPlan)}
                      alt="Floor Plan"
                      className="cursor-pointer"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2" onClick={() => handleImageClick(4)}>
                    <img
                      src={urlForImage(listingDetails.listingPhoto[1])}
                      alt="Listing Photo 2"
                      className="rounded-lg cursor-pointer"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2" onClick={() => handleImageClick(2)}>
                    <img
                      src={urlForImage(propertyDetails.propertyHero)}
                      alt="Property Hero"
                      className="rounded-lg cursor-pointer"
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
          src={urlForImage(listingDetails.listingHero)}
          alt="Listing Hero"
          className="rounded-lg"
          onClick={() => handleImageClick(0)} // Open image viewer on click for mobile
        />
      </div>
    </div>
  );
};

export default ListingDetailsImageBento;
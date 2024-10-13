import React from "react";
import Grid from "@mui/material/Grid";
import { Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";
import ImageViewer from "awesome-image-viewer"; // Import the package

interface PropertyDetailsImageBentoProps {
  propertyDetails: Property;
}

const PropertyDetailsImageBento: React.FC<PropertyDetailsImageBentoProps> = ({
  propertyDetails,
}) => {
  // Combine propertyHero and photos into a single array
  const allImages = [
    propertyDetails.propertyHero,
    ...propertyDetails.photos,
  ].map((image) => ({
    mainUrl: urlForImage(image),
  }));

  const handleImageClick = (index: number) => {
    new ImageViewer({
      images: allImages,
      currentSelected: index, // Index starts at 1 as per the library's documentation
    });
  };

  return (
    <div className="w-full flex justify-center pt-3 pb-12 md:pb-20">
      <div className="md:max-w-[1200px] w-[95vw] hidden md:block">
        <Grid container spacing={{ xs: 0.5, md: 1.5 }}>
          <Grid item xs={6}>
            <div onClick={() => handleImageClick(0)}>
              <img
                src={urlForImage(propertyDetails.propertyHero)}
                alt="Logo"
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
                {propertyDetails.photos.slice(0, 4).map((photo, index) => (
                  <Grid item xs={6} key={index}>
                    <div
                      className={index >= 2 ? "pt-0.5 md:pt-2" : ""}
                      onClick={() => handleImageClick(index + 1)} // Offset by 1 to account for propertyHero
                    >
                      <img
                        src={urlForImage(photo)}
                        alt={`Photo ${index + 1}`}
                        className="rounded-lg cursor-pointer hover:brightness-75 transition duration-300"
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <div
        className="md:max-w-[1200px] w-[92vw] md:hidden"
        onClick={() => handleImageClick(0)} // Offset by 1 to account for propertyHero
      >
        <img
          src={urlForImage(propertyDetails.propertyHero)}
          alt="Property Hero"
          className="rounded-lg hover:brightness-75 transition duration-300"
        />
      </div>
    </div>
  );
};

export default PropertyDetailsImageBento;

import React from "react";
import Grid from "@mui/material/Grid";
import { Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";

interface BrowseCarouselProps {
  propertyDetails: Property;
}

const PropertyDetailsImageBento: React.FC<BrowseCarouselProps> = ({
  propertyDetails,
}) => {
  return (
    <div className="w-full flex justify-center pb-24">
      <div className="md:max-w-[1200px] w-[95vw]">
        <Grid container spacing={{ xs: 0.5, md: 1.5 }}>
          <Grid item xs={6}>
            <div>
              <img
                src={urlForImage(propertyDetails.photos[0])}
                alt="Logo"
                className="w-full h-full rounded-lg"
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
                  <div>
                    <img
                      src={urlForImage(propertyDetails.photos[1])}
                      alt="Logo"
                      className="rounded-lg"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="">
                    <img
                      src={urlForImage(propertyDetails.photos[2])}
                      alt="Logo"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2">
                    <img
                      src={urlForImage(propertyDetails.photos[3])}
                      alt="Logo"
                      className="rounded-lg"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2">
                    <img
                      src={urlForImage(propertyDetails.photos[4])}
                      alt="Logo"
                      className="rounded-lg"
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PropertyDetailsImageBento;

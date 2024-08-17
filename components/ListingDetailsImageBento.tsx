import React from "react";
import Grid from "@mui/material/Grid";
import { Listing, Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";

interface ListingDetailsImageBentoProps {
  listingDetails: Listing;
  propertyDetails: Property;
}

const ListingDetailsImageBento: React.FC<ListingDetailsImageBentoProps> = ({
  listingDetails,
  propertyDetails,
}) => {
  console.log("Listing Details:", listingDetails);
  return (
    <div className="w-full flex justify-center pt-3 pb-12 md:pb-20">
      <div className="md:max-w-[1200px] w-[95vw] hidden md:block">
        <Grid container spacing={{ xs: 0.5, md: 1.5 }} className="">
          <Grid item xs={6}>
            <div>
              <img
                src={urlForImage(listingDetails.listingHero)}
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
                      src={urlForImage(listingDetails.listingPhoto[0])}
                      alt="Logo"
                      className="rounded-lg"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="">
                    <img
                      src={urlForImage(listingDetails.floorPlan)}
                      alt="Logo"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2">
                    <img
                      src={urlForImage(listingDetails.listingPhoto[1])}
                      alt="Logo"
                      className="rounded-lg"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2">
                    <img
                      src={urlForImage(propertyDetails.photos[0])}
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
      <div className="md:max-w-[1200px] w-[92vw] md:hidden">
        <img
          src={urlForImage(listingDetails.listingPhoto[0])}
          alt="Logo"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default ListingDetailsImageBento;

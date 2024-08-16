import React from "react";
import Grid from "@mui/material/Grid";
import { Listing } from "@/types";

interface ListingDetailsIntroProps {
  listingDetails: Listing;
}

const ListingDetailsIntro: React.FC<ListingDetailsIntroProps> = ({
  listingDetails,
}) => {
  return (
    <div className="w-full flex justify-center pb-24">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text">
              {listingDetails.listingName}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-4">
              {listingDetails.description}
            </p>
          </Grid>
          <Grid
            item
            md={5}
            className="pt-10 md:pt-0 flex items-center justify-center"
          >
            <Grid
              container
              rowSpacing={{ xs: 4, md: 3 }}
              columnSpacing={{ xs: 1, md: 2 }}
              //   spacing={{ xs: 0, md: 2 }}
              spacing={2}
            >
              <Grid item xs={6}>
                <div className="flex ">
                  <img src="/icons/bedroom.png" />
                  <p className="ml-3.5">{listingDetails.bedroom} Bedroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/shower.png" />
                  <p className="ml-3.5">{listingDetails.bathroom} Bathroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/floor.png" />
                  <p className="ml-3.5">{listingDetails.floor}th Floor</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/meter.png" />
                  <p className="ml-3.5">{listingDetails.size} square meter</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/compass.png" />
                  <p className="ml-3.5">
                    Facing {listingDetails.facingDirection}
                  </p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/price.png" />
                  <p className="ml-3.5">{listingDetails.price} Million Baht</p>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ListingDetailsIntro;

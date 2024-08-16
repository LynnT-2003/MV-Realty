import React from "react";
import Grid from "@mui/material/Grid";
import { Property } from "@/types";

interface PropertyDetailsIntroProps {
  propertyDetails: Property;
}

const PropertyDetailsIntro: React.FC<PropertyDetailsIntroProps> = ({
  propertyDetails,
}) => {
  return (
    <div className="w-full flex justify-center pb-24">
      <div className="md:max-w-[1200px] w-[95vw]">
        {/* {propertyDetails.title} */}
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text">
              {propertyDetails.title}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-6">
              {propertyDetails.description}
            </p>
          </Grid>
          <Grid item xs={5} className="flex items-center justify-center">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="bg-red-300">xs=6</div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/bedroom.png" />
                  <p className="ml-2">Bedroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="bg-blue-300">xs=6</div>
              </Grid>
              <Grid item xs={6}>
                <div>xs=6</div>
              </Grid>
              <Grid item xs={6}>
                <div>xs=6</div>
              </Grid>
              <Grid item xs={6}>
                <div>xs=6</div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PropertyDetailsIntro;

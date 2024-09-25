"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import { Listing, Property, UnitType } from "@/types";
import { urlForImage } from "@/sanity/lib/image";
import { useState } from "react";
import { Lens } from "./ui/lens";

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

  return (
    <div className="w-full flex justify-center pt-3 pb-12 md:pb-20">
      <div className="md:max-w-[1200px] w-[95vw] hidden md:block">
        <Grid container spacing={{ xs: 0.5, md: 1.5 }} className="">
          <Grid item xs={6}>
            <div>
              <Lens>
                <img
                  src={urlForImage(unitTypeDetails.unitHero)}
                  alt="Logo"
                  className="w-full h-full rounded-lg"
                />
              </Lens>
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
                    <Lens>
                      <img
                        src={urlForImage(unitTypeDetails.unitPhoto[0])}
                        alt="Logo"
                        className="rounded-lg"
                      />
                    </Lens>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div>
                    <Lens>
                      <img
                        src={urlForImage(unitTypeDetails.floorPlan)}
                        alt="Logo"
                      />
                    </Lens>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2">
                    <Lens>
                      <img
                        src={urlForImage(unitTypeDetails.unitPhoto[1])}
                        alt="Logo"
                        className="rounded-lg"
                      />
                    </Lens>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="pt-0.5 md:pt-2">
                    <Lens>
                      <img
                        src={urlForImage(propertyDetails.propertyHero)}
                        alt="Logo"
                        className="rounded-lg"
                      />
                    </Lens>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="md:max-w-[1200px] w-[92vw] md:hidden">
        <img
          src={urlForImage(unitTypeDetails.unitPhoto[0])}
          alt="Logo"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default UnitTypeDetailsImageBento;

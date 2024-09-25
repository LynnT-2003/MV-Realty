import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Listing, Tag, UnitType } from "@/types";
import { fetchTagsFromListing } from "@/services/TagsServices";

interface UnitTypeDetailsIntroProps {
  unitTypeDetails: UnitType;
}

const UnitTypeDetailIntro: React.FC<UnitTypeDetailsIntroProps> = ({
  unitTypeDetails,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);

  // Fetch tags when the component mounts or when listingDetails changes
  useEffect(() => {
    const fetchTags = async () => {
      if (unitTypeDetails._id) {
        const fetchedTags = await fetchTagsFromListing(unitTypeDetails._id);
        setTags(fetchedTags || []);
      }
    };

    fetchTags();
  }, [unitTypeDetails._id]);

  return (
    <div className="w-full flex justify-center pb-16 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text lg:mb-0 mb-6">
              {unitTypeDetails.unitTypeName}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-4 lg:mb-0 mb-8">
              {unitTypeDetails.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-5 lg:mb-0 mb-16">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  className="px-5 py-1 rounded-full bg-white border border-[#002194] text-[#002194] font-semibold text-sm
                  transition-colors duration-200 hover:bg-[#002194] hover:text-white"
                >
                  {tag.tag}
                </button>
              ))}
            </div>
          </Grid>
          <Grid item md={5} className="mt-10 md:mt-0">
            <Grid
              container
              rowSpacing={{ xs: 4, md: 3 }}
              columnSpacing={{ xs: 1, md: 2 }}
              //   spacing={{ xs: 0, md: 2 }}
              spacing={2}
            >
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/bed.svg" />
                  <p className="ml-3.5">{unitTypeDetails.bedroom} Bedroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/shower.svg" />
                  <p className="ml-3.5">{unitTypeDetails.bathroom} Bathroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                {/* <div className="flex">
                  <img src="/icons/floor.svg" />
                  <p className="ml-3.5">{unitTypeDetails.floor}th Floor</p>
                </div> */}
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/sqmt.svg" />
                  <p className="ml-3.5">{unitTypeDetails.size} square meter</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                {/* <div className="flex">
                  <img src="/icons/compass.svg" />
                  <p className="ml-3.5">
                    Facing {unitTypeDetails.facingDirection}
                  </p>
                </div> */}
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/price.png" />
                  <p className="ml-3.5">
                    {unitTypeDetails.startingPrice}M Baht
                  </p>
                </div>
              </Grid>
            </Grid>
            <div className="flex justify-between gap-4 mt-10 md:mt-15">
              <button className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs">
                SHARE THIS LISTING
              </button>
              <button className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs">
                CONTACT US
              </button>
            </div>
            <div className="mt-4">
              <button className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-full text-xs">
                MORE FROM THIS PROPERTY
              </button>
              <p className="mt-4 text-[#193158] font-semibold text-center text-md">
                Unit ID: {unitTypeDetails._id}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default UnitTypeDetailIntro;

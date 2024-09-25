import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Listing, Tag } from "@/types";
import { fetchTagsFromListing } from "@/services/TagsServices";

interface ListingDetailsIntroProps {
  listingDetails: Listing;
}

const ListingDetailsIntro: React.FC<ListingDetailsIntroProps> = ({
  listingDetails,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);

  // Fetch tags when the component mounts or when listingDetails changes
  useEffect(() => {
    const fetchTags = async () => {
      if (listingDetails._id) {
        const fetchedTags = await fetchTagsFromListing(listingDetails._id);
        setTags(fetchedTags || []);
      }
    };

    fetchTags();
  }, [listingDetails._id]);

  return (
    <div className="w-full flex justify-center pb-16 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text md:mb-0 mb-6">
              {listingDetails.listingName}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-4 md:mb-0 mb-8">
              {listingDetails.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-5 md:mb-0 mb-16">
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
          <Grid item md={5}>
            <Grid
              container
              rowSpacing={{ xs: 4, md: 3 }}
              columnSpacing={{ xs: 1, md: 2 }}
              //   spacing={{ xs: 0, md: 2 }}
              spacing={2}
            >
              <Grid item xs={6}>
                <div className="flex">
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
                  <p className="ml-3.5">{listingDetails.size} sqm</p>
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
                  <p className="ml-3.5">{listingDetails.price}M Baht</p>
                </div>
              </Grid>
            </Grid>
            <div className="flex justify-between gap-4 mt-16">
              <button className="py-4 md:py-2 hover:bg-slate-700 bg-[#193158] text-white  rounded-lg w-1/2 text-sm">
                SHARE LISTING
              </button>
              <button className="py-4 md:py-2 hover:bg-slate-700 bg-[#193158] text-white  rounded-lg w-1/2 text-sm">
                CONTACT US
              </button>
            </div>
            <div className="mt-4">
              <button className="py-4 md:py-2 hover:bg-slate-700 bg-[#193158] text-white  rounded-lg w-full text-sm">
                MORE FROM PROPERTY
              </button>
              <p className="mt-4 text-[#193158] font-semibold text-center text-md">
                Unit ID: {listingDetails._id}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ListingDetailsIntro;

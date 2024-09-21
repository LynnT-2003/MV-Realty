import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Developer, Property, Tag, Listing } from "@/types";
import { Button } from "./ui/button";
import { fetchTagsFromProperty } from "@/services/TagsServices";
import developer from "@/sanity/schemas/developer";
import { useRouter } from "next/navigation";

interface PropertyDetailsIntroProps {
  propertyDetails: Property;
  listings: Listing[];
  developer: Developer;
}

const PropertyDetailsIntro: React.FC<PropertyDetailsIntroProps> = ({
  // The property details that we're rendering
  propertyDetails,

  // The developer of the property
  developer,

  // The listings for this property
  listings,
}) => {
  // Get the router so we can navigate
  const router = useRouter();

  // Initialize the tags state to an empty array
  const [tags, setTags] = useState<Tag[]>([]);

  // Fetch the tags when the component mounts or when the property details change
  useEffect(() => {
    // Function to fetch the tags
    const fetchTags = async () => {
      // If the property has an ID, fetch the tags for that property
      if (propertyDetails._id) {
        // Fetch the tags using the TagsService
        const fetchedTags = await fetchTagsFromProperty(propertyDetails._id);

        // Set the tags state to the fetched tags, or an empty array if there were no tags
        setTags(fetchedTags || []);
      }
    };

    // Call the fetchTags function
    fetchTags();
    console.log("Fetched tags", tags);
  }, [propertyDetails._id]);

  // Log the tags to the console
  console.log("Tags", tags);

  // Return the JSX for the property details intro
  return (
    <div className="w-full flex justify-center pb-12 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text">
              {propertyDetails.title}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-4">
              {propertyDetails.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
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
              <div className="flex w-full ml-3.5 mb-8 mt-8">
                <img src="/icons/PriceTag.svg" className="w-10 h-10" />
                <p className="ml-3.5 pt-1 text-[#193158] text-2xl font-semibold">
                  Price Starts from {propertyDetails.minPrice}MB
                </p>
              </div>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/Calendar.svg" />
                  <p className="ml-3.5 pt-1 text-[#193158] text-sm font-semibold">
                    Completed on {propertyDetails.completedOn}
                  </p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/Developer.svg" />
                  <p className="ml-3.5 pt-1 text-[#193158] text-sm font-semibold">
                    {developer.name}
                  </p>
                </div>
              </Grid>
            </Grid>

            <div className="flex justify-between gap-4 mt-20">
              <button className="py-2 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs">
                SHARE THIS PROPERTY
              </button>
              <button className="py-2 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs">
                CONTACT US
              </button>
            </div>

            <div className="mt-4">
              <button
                className="py-2 bg-[#193158] text-white font-semibold rounded-lg w-full text-xs"
                onClick={() => {
                  const listingsParam = encodeURIComponent(
                    JSON.stringify(listings)
                  );

                  router.push(`/Listings?listings=${listingsParam}`);
                }}
              >
                LISTINGS FROM THIS PROPERTY
              </button>

              <p className="mt-4 text-[#193158] font-bold text-center text-lg">
                Property ID: {propertyDetails._id}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PropertyDetailsIntro;

"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Listing, Property, Tag, UnitType } from "@/types";
import { fetchTagsFromListing } from "@/services/TagsServices";
import { useRouter, usePathname } from "next/navigation";
import Alert from "@mui/material/Alert"; // Import Alert for notifications
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";

interface State extends SnackbarOrigin {
  open: boolean;
}

interface UnitTypeDetailsIntroProps {
  unitTypeDetails: UnitType;
  property: Property;
}

const UnitTypeDetailIntro: React.FC<UnitTypeDetailsIntroProps> = ({
  unitTypeDetails,
  property,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePropertyClick = (id: String) => {
    router.push(`/Details/${id}`);
  };

  // Function for Contact us
  const handleContactUsClick = async () => {
    alert("Contact Functionality coming soon!");
  };

  const [tags, setTags] = useState<Tag[]>([]);

  const [state, setState] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "right", // Set to 'top-right' position
  });
  const { vertical, horizontal, open } = state;

  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(unitTypeDetails._id);
      // Show snackbar after successful copy
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="w-full flex justify-center pb-16 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text lg:mb-0 mb-6">
              {unitTypeDetails.unitTypeName}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-6 lg:mb-0 mb-8">
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
          <Grid item md={5} className="md:mt-0">
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
                  Price Starts from {unitTypeDetails.startingPrice}MB
                </p>
              </div>
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
                <div className="flex">
                  <img src="/icons/sqmt.svg" />
                  <p className="ml-3.5">{unitTypeDetails.size} square meter</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/Furniture.svg" />
                  <p className="ml-3.5">{unitTypeDetails.furniture}</p>
                </div>
              </Grid>
            </Grid>
            <div className="flex justify-between gap-4 mt-10 md:mt-15">
              <button
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs"
                onClick={handleCopyToClipboard}
              >
                SHARE THIS UNIT
              </button>
              <button
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs"
                onClick={handleContactUsClick}
              >
                CONTACT US
              </button>
            </div>
            <div className="mt-4">
              <button
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-full text-xs"
                onClick={() => {
                  handlePropertyClick(property.slug.current);
                }}
              >
                MORE FROM THIS UNIT
              </button>
              <p
                className="ml-3.5 pt-1 text-[#193158] text-sm font-semibold text-center mt-4 cursor-pointer"
                onClick={handleCopyToClipboard}
              >
                Unit ID: {unitTypeDetails._id}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Snackbar to show notifications */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Unit ID copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UnitTypeDetailIntro;

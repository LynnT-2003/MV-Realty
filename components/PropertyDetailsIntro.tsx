"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Developer, Property, Tag, UnitType } from "@/types";
import { fetchTagsFromProperty } from "@/services/TagsServices";
import { useRouter } from "next/navigation";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { SnackbarCloseReason } from '@mui/material/Snackbar';

import Alert from "@mui/material/Alert"; // Import Alert for notifications

interface State extends SnackbarOrigin {
  open: boolean;
}

interface PropertyDetailsIntroProps {
  propertyDetails: Property;
  unitTypes: UnitType[];
  developer: Developer;
}

const PropertyDetailsIntro: React.FC<PropertyDetailsIntroProps> = ({
  propertyDetails,
  developer,
  unitTypes,
}) => {
  const router = useRouter();

  const [state, setState] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "right", // Set to 'top-right' position
  });
  const { vertical, horizontal, open } = state;

  const [tags, setTags] = useState<Tag[]>([]);

  // Snackbar control
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      if (propertyDetails._id) {
        const fetchedTags = await fetchTagsFromProperty(propertyDetails._id);
        setTags(fetchedTags || []);
      }
    };
    fetchTags();
  }, [propertyDetails._id]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(propertyDetails._id);
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
    <div className="w-full flex justify-center pb-12 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text">
              {propertyDetails.title}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-6">
              {propertyDetails.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  className="px-5 py-1 rounded-full bg-white border border-[#002194] text-[#002194] font-semibold text-sm transition-colors duration-200 hover:bg-[#002194] hover:text-white"
                >
                  {tag.tag}
                </button>
              ))}
            </div>
          </Grid>
          <Grid item md={5} className="mt-10 md:mt-0">
            <Grid container rowSpacing={{ xs: 4, md: 3 }} spacing={2}>
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

            <div className="flex justify-between gap-4 mt-16">
              <button className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs">
                SHARE THIS PROPERTY
              </button>
              <button className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs">
                CONTACT US
              </button>
            </div>

            <div className="mt-4 cursor-pointer" onClick={handleCopyToClipboard}>
              <p className="ml-3.5 pt-1 text-[#193158] text-sm font-semibold text-center">
                Property ID: {propertyDetails._id}
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
          Property ID copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PropertyDetailsIntro;

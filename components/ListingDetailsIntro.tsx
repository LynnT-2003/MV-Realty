"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Listing, Property, Tag } from "@/types";
import { fetchTagsFromListing } from "@/services/TagsServices";
import { useRouter, usePathname } from "next/navigation";
import Alert from "@mui/material/Alert"; // Import Alert for notifications
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Import icons
import Box from "@mui/material/Box";


// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: 0,
  borderRadius: 4,
};

// Button container style (for the social icons)
const iconButtonContainer = {
  display: "flex",
  justifyContent: "space-between",
  width: "50%", // Adjust size of the container
  marginTop: "20px",
};

const iconButtonStyle = {
  fontSize: "42px", // Adjust icon size
  color: "#193059", // Adjust color (optional)
  padding: "10px",
  border: "1px solid #E0E0E0",
  borderRadius: "50%",
  cursor: "pointer",
};

interface State extends SnackbarOrigin {
  open: boolean;
}

interface ListingDetailsIntroProps {
  listingDetails: Listing;
  property: Property;
}

const ListingDetailsIntro: React.FC<ListingDetailsIntroProps> = ({
  listingDetails,
  property,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);

  const handlePropertyClick = (slug: String) => {
    router.push(`/Details/${slug}`);
  };

  // Function to handle copy to clipboard
  const handleCopyToClipboard = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      // Show snackbar after successful copy
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
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
      if (listingDetails._id) {
        const fetchedTags = await fetchTagsFromListing(listingDetails._id);
        setTags(fetchedTags || []);
      }
    };

    fetchTags();
  }, [listingDetails._id]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="w-full flex justify-center pb-16 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text lg:mb-0 mb-6">
              {listingDetails.listingName}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-6 lg:mb-0 mb-8">
              {listingDetails.description}
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
                  <p className="ml-3.5">{listingDetails.bedroom} Bedroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/shower.svg" />
                  <p className="ml-3.5">{listingDetails.bathroom} Bathroom</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/floor.svg" />
                  <p className="ml-3.5">{listingDetails.floor}th Floor</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/sqmt.svg" />
                  <p className="ml-3.5">{listingDetails.size} square meter</p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/compass.svg" />
                  <p className="ml-3.5">
                    Facing {listingDetails.facingDirection}
                  </p>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="flex">
                  <img src="/icons/price.svg" />
                  <p className="ml-3.5">
                    {new Intl.NumberFormat("th-TH", {
                      style: "currency",
                      currency: "THB",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(listingDetails.price)}{" "}
                    per Month
                  </p>
                </div>
              </Grid>
              <div className="flex w-full ml-3.5 mb-2 mt-8 justify-center">
                <p className="ml-3.5 pt-1">
                  Minimum Contract Period of{" "}
                  {listingDetails.minimumContractInMonth} Months
                </p>
              </div>
            </Grid>
            <div className="flex justify-between gap-4 mt-10 md:mt-15">
              <button
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs"
                onClick={() => handleCopyToClipboard(currentUrl)}
              >
                SHARE THIS LISTING
              </button>
              <button
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs"
                onClick={handleOpenModal}
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
                MORE FROM THIS LISTING
              </button>
              <p
                onClick={() => handleCopyToClipboard(listingDetails._id)}
                className="cursor-pointer ml-3.5 pt-1 text-[#193158] text-sm font-light text-center mt-4"
              >
                Listing ID: {listingDetails._id}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
      {/* Modal for Contact Us */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            className="font-bold text-xl"
          >
            Contact Us
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <b className=" text-base">Email:</b>{" "}
            <a href="mailto:info@mahavertex.com">info@mahavertex.com</a>
            <br />
            <div className="mt-1">
              {" "}
              <b className=" text-base">Phone:</b>{" "}
              <a href="tel:+66022001020" className="ml-1">
                +66 02 200 1020
              </a>
              <br />
            </div>
            <div className="mt-1">
              {" "}
              <b className=" text-base">Adrress:</b> Suite: 28, Level 2, Summer
              Point Building, 7 Sukhumvit 69 Alley, Phra Khanong, Watthana,
              Bangkok 10110
              <br />
            </div>
            <div style={iconButtonContainer}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="hover:brightness-75 transition duration-300"
              >
                <FaTwitter style={iconButtonStyle} />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="hover:brightness-75 transition duration-300"
              >
                <FaFacebookF style={iconButtonStyle} />
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="hover:brightness-75 transition duration-300"
              >
                <FaLinkedinIn style={iconButtonStyle} />
              </a>
            </div>
          </Typography>
        </Box>
      </Modal>
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
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListingDetailsIntro;

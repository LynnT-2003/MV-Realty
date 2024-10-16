import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Developer, Property, Tag, UnitType } from "@/types";
import { fetchTagsFromProperty } from "@/services/TagsServices";
import { useRouter } from "next/navigation";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { radioClasses } from "@mui/material";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa"; // Import icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

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
  const [openModal, setOpenModal] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);

  // Snackbar state
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
              <button
                onClick={() => handleCopyToClipboard(currentUrl)}
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs"
              >
                SHARE THIS PROPERTY
              </button>
              <button
                onClick={handleOpenModal}
                className="py-3 lg:py-2 hover:bg-slate-700 bg-[#193158] text-white font-semibold rounded-lg w-1/2 text-xs"
              >
                CONTACT US
              </button>
            </div>

            <div
              className="mt-4 cursor-pointer"
              onClick={() => handleCopyToClipboard(propertyDetails._id)}
            >
              <p className="ml-3.5 pt-1 text-[#193158] text-sm font-light text-center underline curson-pointer">
                Property ID: {propertyDetails._id}
                <FontAwesomeIcon
                  icon={faCopy}
                  className="ml-2 text-[#193158] cursor-pointer w-4 h-4"
                  onClick={() => handleCopyToClipboard(propertyDetails._id)}
                />
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
              <b className=" text-base">Address:</b> Suite: 28, Level 2, Summer
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

      {/* Snackbar for notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default PropertyDetailsIntro;

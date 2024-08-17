import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Listing, Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";

interface FacilitiesAccordionProps {
  listingDetails: Listing;
  propertyDetails: Property;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    // borderBottom: "1px solid rgba(0, 0, 0, .125)",
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const FacilitiesAccordion: React.FC<FacilitiesAccordionProps> = ({
  listingDetails,
  propertyDetails,
}) => {
  console.log("Property Facility Details:", propertyDetails.facilities);

  return (
    <div className="w-full flex justify-center pb-6">
      <div className="md:max-w-[1150px] w-[85vw]">
        <p className="poppins-text-title-small md:property-details-title-text">
          Facilities
        </p>
        {propertyDetails.facilities.map((facility, index) => (
          <Accordion key={index} className="pt-6">
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <span className="poppins-text-small md:poppins-text-avg-bold">
                {facility.facilityName}
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="pb-4">
                <img src={urlForImage(facility.photos[0])} />
              </div>
              <span className="poppins-text-small md:poppins-text-avg">
                {facility.description}
              </span>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesAccordion;

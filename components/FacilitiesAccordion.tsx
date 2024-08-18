import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { FacilityType, Listing, Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";

interface FacilitiesAccordionProps {
  listingDetails: Listing;
  propertyDetails: Property;
  facilityTypeDetails: FacilityType[];
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
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
  facilityTypeDetails,
}) => {
  console.log("Property Facility Details:", propertyDetails.facilities);
  console.log("Property FacilityType Details:", facilityTypeDetails);

  // Create a mapping from facilityType _id to name
  const facilityTypeMap = facilityTypeDetails.reduce(
    (acc, type) => {
      acc[type._id] = type.name;
      return acc;
    },
    {} as Record<string, string>
  );

  // Group facilities by their facilityType
  const groupedFacilities = propertyDetails.facilities.reduce(
    (acc, facility) => {
      const type = facility.facilityType._ref;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(facility);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className="w-full flex justify-center pb-6">
      <div className="md:max-w-[1150px] w-[85vw]">
        <p className="poppins-text-title-small md:property-details-title-text pb-2">
          Facilities
        </p>

        {Object.keys(groupedFacilities).map((facilityType, index) => (
          <Accordion key={index} className="py-3">
            <AccordionSummary
              aria-controls={`panel-${index}-content`}
              id={`panel-${index}-header`}
            >
              <span className="poppins-text-small-bold md:poppins-text-avg-bold">
                {facilityTypeMap[facilityType] || "Unknown Facility Type"}
              </span>
            </AccordionSummary>
            <AccordionDetails>
              {groupedFacilities[facilityType].map(
                (facility, facilityIndex) => (
                  <div
                    key={facilityIndex}
                    className="pb-12 flex flex-col md:flex-row"
                  >
                    <div className="md:w-1/2">
                      <img
                        src={urlForImage(facility.photos[0])}
                        alt={facility.name}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="md:w-1/2 md:pl-6 pt-0 md:pt-2">
                      <p className="poppins-text-small-bold md:poppins-text-heading-name py-3 md:py-0">
                        {facility.facilityName}
                      </p>
                      <p className="poppins-text-small md:poppins-text-avg pt-0 md:pt-4">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                )
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesAccordion;

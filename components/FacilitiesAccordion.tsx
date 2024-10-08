import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { FacilityType, Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";

interface FacilitiesAccordionProps {
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
  propertyDetails,
  facilityTypeDetails,
}) => {
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

  // Manage expanded state for all accordions, open all by default
  const [expanded, setExpanded] = React.useState<string[]>(
    Object.keys(groupedFacilities) // Initialize with all facility types open
  );

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(
        (prevExpanded) =>
          isExpanded
            ? [...prevExpanded, panel] // Add to expanded array if not already expanded
            : prevExpanded.filter((p) => p !== panel) // Remove from expanded array if collapsed
      );
    };

  return (
    <div className="w-full flex justify-center md:pt-0 pt-6 pb-0">
      <div className="md:max-w-[1150px] w-[85vw]">
        <p className="poppins-text-title-small md:property-details-title-text">
          Facilities
        </p>

        {Object.keys(groupedFacilities).map((facilityType, index) => (
          <Accordion
            key={index}
            expanded={expanded.includes(facilityType)} // Check if the current panel is expanded
            onChange={handleChange(facilityType)}
            className="py-3"
          >
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
                        src={
                          facility.photos && facility.photos[0]
                            ? urlForImage(facility.photos[0])
                            : "/placeholder.jpg"
                        }
                        alt={facility.name || "Placeholder"}
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

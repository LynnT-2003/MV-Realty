import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import {
  fetchAllFaqs,
  fetchAllPropertyFaqsByPropertyId,
} from "@/services/faqsServices"; // Ensure the correct path
import { Faqs, Property, PropertyFaqs } from "@/types";

interface FaqSectionProps {
  propertyDetails: Property;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
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

const CustomizedAccordions: React.FC<FaqSectionProps> = ({
  propertyDetails,
}) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [faqs, setFaqs] = React.useState<Faqs[]>([]);
  const [propertyFaqs, setPropertyFaqs] = React.useState<{ question: PropertyFaqs; answer: string }[]>([]); // Update type here

  React.useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await fetchAllFaqs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs", error);
      }
    };

    const fetchPropertyFaqs = async () => {
      try {
        const data = await fetchAllPropertyFaqsByPropertyId(
          propertyDetails._id
        );
        setPropertyFaqs(data);
      } catch (error) {
        console.error("Failed to fetch property FAQs", error);
      }
    };

    fetchFaqs();
    fetchPropertyFaqs();
  }, [propertyDetails._id]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  console.log("propertyFaqs", propertyFaqs);
  return (
    <div className="w-full flex justify-center pb-12 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        <p className="poppins-text-title-small md:property-details-title-text">
          Frequently Asked Questions
        </p>

        {faqs.length > 0 ? (
          faqs.map((faq, index) => (
            <Accordion
              key={faq._id}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              className="pt-6"
            >
              <AccordionSummary
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <span className="poppins-text-small-bold md:poppins-text-avg-bold">
                  {faq.question}
                </span>
              </AccordionSummary>
              <AccordionDetails>
                <span className="poppins-text-small md:poppins-text-avg">
                  {faq.answer}
                </span>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography></Typography>
        )}
        {propertyFaqs.length > 0 ? (
          propertyFaqs.map((propertyFaq, index) => (
            <Accordion
              key={propertyFaq.question._id} // Use question._id for key
              expanded={expanded === `propertyPanel${index}`}
              onChange={handleChange(`propertyPanel${index}`)}
              className="pt-6"
            >
              <AccordionSummary
                aria-controls={`propertyPanel${index}-content`}
                id={`propertyPanel${index}-header`}
              >
                <span className="poppins-text-small-bold md:poppins-text-avg-bold">
                  {propertyFaq.question.question}
                </span>
              </AccordionSummary>
              <AccordionDetails>
                <span className="poppins-text-small md:poppins-text-avg">
                  {propertyFaq.answer}
                </span>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography></Typography>
        )}
      </div>
    </div>
  );
};

export default CustomizedAccordions;

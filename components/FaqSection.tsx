import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { fetchAllFaqs } from "@/services/faqsServices"; // Ensure the correct path
import { Faqs } from "@/types";

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

const CustomizedAccordions: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [faqs, setFaqs] = React.useState<Faqs[]>([]);

  React.useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await fetchAllFaqs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs", error);
      }
    };
    fetchFaqs();
  }, []);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

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
          <Typography>No FAQs available</Typography>
        )}
      </div>
    </div>
  );
};

export default CustomizedAccordions;

import React from "react";
import Grid from "@mui/material/Grid";
import { Property } from "@/types";
import { Button } from "./ui/button";

interface PropertyDetailsIntroProps {
  propertyDetails: Property;
  pdf_file_url: string | null;
}

const downloadFile = (url: string) => {
  if (!url) return;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = window.URL.createObjectURL(new Blob([blob]));
      const aTag = document.createElement("a");
      aTag.href = blobURL;
      aTag.setAttribute("download", "brochure.pdf");
      document.body.appendChild(aTag);
      aTag.click();
      aTag.remove();
    });
};

const PropertyDetailsIntro: React.FC<PropertyDetailsIntroProps> = ({
  propertyDetails,
  pdf_file_url,
}) => {
  return (
    <div className="w-full flex justify-center pb-6 md:pb-20">
      <div className="md:max-w-[1150px] w-[85vw]">
        {/* {propertyDetails.title} */}
        <Grid container columnSpacing={10}>
          <Grid item md={7}>
            <p className="poppins-text-title-small md:property-details-title-text">
              {propertyDetails.title}
            </p>
            <p className="poppins-text-small md:poppins-text-avg mt-6">
              {propertyDetails.description}
            </p>
          </Grid>

          <Grid
            item
            md={5}
            className="pt-10 md:pt-0 items-center justify-center hidden md:flex"
          >
            <Grid
              container
              rowSpacing={{ xs: 4, md: 3 }}
              columnSpacing={{ xs: 1, md: 2 }}
              //   spacing={{ xs: 0, md: 2 }}
              spacing={2}
            >
              <Grid item xs={12}>
                <div className="w-full flex flex-col justify-center mb-24 pb-24 md:pb-18 px-20 pt-5">
                  <Button
                    onClick={() => {
                      if (pdf_file_url) downloadFile(pdf_file_url);
                    }}
                    className="my-2"
                  >
                    Download Brochure
                  </Button>
                  <Button
                    onClick={() => {
                      alert("LOL this doesnt work yet.");
                    }}
                    className="my-2 px-14"
                  >
                    Contact Us !
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PropertyDetailsIntro;

import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Grid from "@mui/material/Grid"; // Import MUI Grid

function LoadingPage() {
  return (
    <div>
      {/* First part: Image section skeleton */}
      <div className="w-full flex justify-center pt-3 pb-12 md:pb-20">
        <div className="md:max-w-[1200px] w-[95vw] hidden md:block">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-full h-[300px] rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-[150px] rounded-lg" />
              <Skeleton className="h-[150px] rounded-lg" />
              <Skeleton className="h-[150px] rounded-lg pt-2" />
              <Skeleton className="h-[150px] rounded-lg pt-2" />
            </div>
          </div>
        </div>
        <div className="md:max-w-[1200px] w-[92vw] md:hidden">
          <Skeleton className="w-full h-[150px] rounded-lg" />
        </div>
      </div>

      {/* Second part: Property details section skeleton */}
      <div className="w-full flex justify-center pb-12 md:pb-20">
        <div className="md:max-w-[1150px] w-[85vw]">
          <Grid container columnSpacing={10}>
            <Grid item md={7}>
              <Skeleton className="h-[40px] w-[80%] mb-4" />
              <Skeleton className="h-[80px] w-[100%] mb-4" />
              <div className="flex flex-wrap gap-2 mt-5">
                <Skeleton className="h-[30px] w-[70px] rounded-full" />
                <Skeleton className="h-[30px] w-[70px] rounded-full" />
                <Skeleton className="h-[30px] w-[70px] rounded-full" />
              </div>
            </Grid>

            <Grid item md={5}>
              <Grid
                container
                rowSpacing={{ xs: 4, md: 3 }}
                columnSpacing={{ xs: 1, md: 2 }}
                spacing={2}
              >
                <Skeleton className="h-[32px] w-[80%] ml-4 mt-6" />
                <Grid item xs={6}>
                  <Skeleton className="h-[24px] w-[80%]" />
                </Grid>
                <Grid item xs={6}>
                  <Skeleton className="h-[24px] w-[80%]" />
                </Grid>
              </Grid>
              <div className="flex justify-between gap-4 mt-20">
                <Skeleton className="h-[40px] w-[45%]" />
                <Skeleton className="h-[40px] w-[45%]" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-[40px] w-[100%]" />
                <Skeleton className="h-[24px] w-[60%] mt-4" />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;

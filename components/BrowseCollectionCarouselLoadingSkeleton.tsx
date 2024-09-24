import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { ChevronLeft, ChevronRight } from "lucide-react";

const BrowseCollectionCarouselLoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center pb-4">
      {/* Left Chevron for scrolling */}
      <button className="hidden md:block mr-10 bg-white shadow-md rounded-full">
        <ChevronLeft size={24} />
      </button>

      <div className="md:w-[1200px] w-screen mx-4 md:mx-0 overflow-hidden whitespace-nowrap flex flex-col md:flex-row">
        {/* Simulating multiple listing cards */}
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="relative inline-block mb-4 md:mb-0 group px-2"
          >
            <Skeleton className="w-[370px] h-[280px] rounded-lg mb-4 md:w-[385px]" />{" "}
          </div>
        ))}
      </div>

      {/* Right Chevron for scrolling */}
      <button className="hidden md:block ml-10 bg-white shadow-md rounded-full">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default BrowseCollectionCarouselLoadingSkeleton;

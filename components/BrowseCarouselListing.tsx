import { urlForImage } from "@/sanity/lib/image";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DirectionAwareHover } from "./ui/direction-aware-hover";
import { Property, Listing, Developer } from "@/types";
import { useRouter } from "next/navigation";
import BrowseListingCarouselLoadingSkeleton from "./BrowseListingCarouselLoadingSkeleton";
// Define the prop types
interface BrowseCarouselProps {
  listings: Listing[];
  properties: Property[];
  developers: Developer[];
  blur: boolean;
}

const BrowseCarousel: React.FC<BrowseCarouselProps> = ({
  listings,
  properties,
  developers,
  blur,
}) => {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false); // Simulated loading
    }, 1000); // Adjust to the real loading time
    return () => clearTimeout(timeout);
  }, [listings, properties, developers]);
  
  const handlePropertyClick = (slug: String) => {
    // console.log("Clicked on Property: ", { property });
    router.push(`/ListingDetails/${slug}`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (carouselRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the drag speed by changing the multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const scrollLeftClick = () => {
    if (carouselRef.current) {
      //  const remToPx = 16; // base font size in pixels
      // const moveAmountPx = 30.55 * remToPx; // converting rem to pixels
      carouselRef.current.scrollBy({ left: -488, behavior: "smooth" });
    }
  };

  const scrollRightClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 488, behavior: "smooth" });
    }
  };

  if (loading) {
    return <BrowseListingCarouselLoadingSkeleton />; // Render loading skeleton
  }

  return (
    <div className="w-full flex items-center justify-center pb-4">
      <div></div>
      <button
        className="hidden md:block mr-10 bg-white shadow-md rounded-full"
        onClick={scrollLeftClick}
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        id="slider"
        ref={carouselRef}
        className="md:w-[1210px] w-screen mx-4 md:mx-0 overflow-hidden md:overflow-x-scroll scroll scrollbar-hide whitespace-nowrap scroll-smooth flex flex-col md:flex-row "
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {listings.map((listing, index) => {
          const property =
            properties.find((prop) => prop._id === listing.property._ref) ||
            properties[0];

          const developer =
            developers.find((dev) => dev._id === property.developer._ref) ||
            developers[0];

          return (
            <div
              key={index}
              onClick={() => {
                handlePropertyClick(listing._id);
              }}
              className="relative inline-block macbook-air:w-[24.2rem] md:w-[30.55rem] mb-4 md:mb-0 md:mr-[1vw] group"
              // className="relative inline-block mb-4 md:mb-0 group"
            >
              <DirectionAwareHover
                imageUrl={urlForImage(listing.listingHero)}
                className={`${blur ? "opacity-50" : "opacity-100"}`}
              >
                <p className="font-bold text-xl">{listing.listingName}</p>
                <span className="font-semibold text-sm">
                  Price: {listing.price}M Baht
                </span>
              </DirectionAwareHover>
              <div className="mt-4 pt-2 pr-2 bg-white rounded-lg mb-8">
                <div className="relative flex">
                  <div className="w-80 inline-flex items-center overflow-hidden pr-3">
                    <span className="truncate text-lg font-light overflow-hidden whitespace-nowrap">
                      {listing.listingName}
                    </span>
                  </div>
                  <div className="w-20">
                    <p className="mr-0 ml-3 absolute top-0 right-0 font-semibold text-xl text-[#193158]">
                      {listing.price} MB
                    </p>
                  </div>
                </div>

                {/* <div className="relative flex items-center justify-between text-lg font-light w-full">
                  <div className="flex-1 pr-16 truncate w-1/2">
                    <span className="inline-flex item-baseline">
                    {listing.listingName}
                    <img
                      src={urlForImage(developer.profileIcon)}
                      className="w-8 h-8 ml-1"
                    /> 
                    </span>
                  </div>
                </div> */}
                <div className="flex pt-4">
                  <span className="pr-6 flex">
                    <img src="/icons/bed.svg" className="pr-2" />
                    {listing.bedroom}
                  </span>
                  <span className="pr-6 flex">
                    <img src="/icons/sqmt.svg" className="pr-2" />
                    {listing.size}
                  </span>
                  <span className="pr-6 flex">
                    <img src="/icons/shower.svg" className="pr-2" />
                    {listing.bathroom}
                  </span>
                  <span className="pr-6 flex">
                    <img src="/icons/floor.svg" className="pr-2" />
                    {listing.floor}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="hidden md:block ml-10 bg-white shadow-md rounded-full"
        onClick={scrollRightClick}
        aria-label="Scroll Right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default BrowseCarousel;

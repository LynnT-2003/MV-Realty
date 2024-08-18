import { urlForImage } from "@/sanity/lib/image";
import React, { useRef, useState } from "react";
import { Image } from "sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DirectionAwareHover } from "./ui/direction-aware-hover";
import { Property, Listing } from "@/types";
import { useRouter } from "next/navigation";

// Define the prop types
interface BrowseCarouselProps {
  listings: Listing[];
}

const BrowseCarousel: React.FC<BrowseCarouselProps> = ({ listings }) => {
  const router = useRouter();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
        className="md:w-[1200px] w-screen mx-4 md:mx-0 overflow-hidden md:overflow-x-scroll scroll whitespace-nowrap scroll-smooth flex flex-col md:flex-row "
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {listings.map((listing, index) => (
          <div
            key={index}
            onClick={() => {
              handlePropertyClick(listing._id);
            }}
            className="relative inline-block mb-4 md:mb-0 group"
          >
            <DirectionAwareHover
              imageUrl={urlForImage(listing.listingPhoto[0])}
            >
              <p className="font-bold text-xl">{listing.listingName}</p>
              <p className="font-normal text-sm">$1299 / night</p>
            </DirectionAwareHover>
            <div className="mt-2 p-2 bg-white rounded-lg mb-8">
              <p className="text-lg font-semibold">{listing.listingName}</p>
              {/* <p className="font-normal text-sm">$1299 / night</p> */}
              <div className="flex pt-2">
                <span className="pr-6 flex">
                  <img src="/icons/bedroom.png" className="pr-2" />
                  {listing.bedroom}
                </span>
                <span className="pr-6 flex">
                  <img src="/icons/meter.png" className="pr-2" />
                  {listing.size}
                </span>
                <span className="pr-6 flex">
                  <img src="/icons/shower.png" className="pr-2" />
                  {listing.bathroom}
                </span>
                <span className="pr-6 flex">
                  <img src="/icons/floor.png" className="pr-2" />
                  {listing.floor}
                </span>
              </div>
            </div>
          </div>
        ))}
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

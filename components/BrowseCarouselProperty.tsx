import { urlForImage } from "@/sanity/lib/image";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DirectionAwareHover } from "./ui/direction-aware-hover";
import { Developer, Property } from "@/types";
import { useRouter } from "next/navigation";
import BrowsePropertyCarouselLoadingSkeleton from "./BrowsePropertyCarouselLoadingSkeleton";
// Define the prop types
interface BrowseCarouselProps {
  properties: Property[];
  developers: Developer[];
}

const BrowseCarouselProperty: React.FC<BrowseCarouselProps> = ({
  properties,
  developers
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
  }, [properties, developers]);

  const handlePropertyClick = (slug: String) => {
    // console.log("Clicked on Property: ", { property });
    router.push(`/Details/${slug}`);
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
    return <BrowsePropertyCarouselLoadingSkeleton />; // Render loading skeleton
  }

  return (
    <div className="w-full flex items-center justify-center pb-12">
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
        className="md:w-[1200px] w-screen mx-4 md:mx-0 overflow-hidden md:overflow-x-scroll scroll scrollbar-hide whitespace-nowrap scroll-smooth flex flex-col md:flex-row"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {properties.map((property, index) => {
          const developer =
            developers.find((dev) => dev._id === property.developer._ref) ||
            developers[0];
          return (
            <div
              key={index}
              onClick={() => {
                handlePropertyClick(property.slug.current);
              }}
              // className="relative inline-block macbook-air:w-[24.2rem] macbook-air:h-[16.60rem] md:w-[30.55rem] mb-4 md:mb-0 md:h-[20.78rem] md:mr-[1vw] group"
              className="relative inline-block mb-4 md:mb-0 group"
            >
              <DirectionAwareHover
                imageUrl={urlForImage(property.propertyHero)}
              >
                <p className="font-bold text-xl">{property.title}</p>
              </DirectionAwareHover>
              <div className="mt-4 pt-2 pr-2 bg-white rounded-lg mb-8">
                <div className="relative flex">
                  <div className="w-80 inline-flex items-center overflow-hidden pr-10">
                    <span className="truncate text-lg font-light overflow-hidden whitespace-nowrap">
                      {property.title}
                    </span>
                    <img
                      src={urlForImage(developer.profileIcon)}
                      className="w-8 h-8 ml-1 flex-shrink-0"
                    />
                  </div>
                  <div className="w-20 ml-4">
                    <p className="mr-3 ml-3 absolute top-0 right-0 font-semibold text-xl text-[#193158]">
                      {property.minPrice}-{property.maxPrice} MB
                    </p>
                  </div>
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

export default BrowseCarouselProperty;

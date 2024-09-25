import { urlForImage } from "@/sanity/lib/image";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DirectionAwareHover } from "./ui/direction-aware-hover";
import { DirectionAwareHoverCollections } from "./ui/direction-aware-hover-collections";
import { Collections } from "@/types";
import { useRouter } from "next/navigation";
import BrowseCollectionCarouselLoadingSkeleton from "./BrowseCollectionCarouselLoadingSkeleton";

// Define the prop types
interface BrowseCarouselProps {
  collections: Collections[];
}

/**
 * A carousel component for browsing collections
 * @param collections A list of collection objects
 * @returns A carousel component that renders a list of collections
 */

const BrowseCarouselCollection: React.FC<BrowseCarouselProps> = ({
  collections,
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
  }, [collections]);

  const handleCollectionClick = (id: String) => {
    router.push(`/Collections/${id}`); // Here
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
    return <BrowseCollectionCarouselLoadingSkeleton />; // Render loading skeleton
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
        className="md:w-[1210px] w-screen mx-4 md:mx-0 overflow-hidden md:overflow-x-scroll scroll whitespace-nowrap scroll-smooth flex flex-col md:flex-row"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {collections.map((collection, index) => (
          <div
            key={index}
            onClick={() => {
              handleCollectionClick(collection._id);
            }}
            // className="relative inline-block macbook-air:w-[25rem] h-full md:w-[30.55rem] mb-4 md:mb-0 md:mr-[1vw] group"
            className="relative inline-block mb-4 md:mb-0 group"
          >
            <DirectionAwareHoverCollections
              imageUrl={urlForImage(collection.thumbnail)}
            >
              <p className="font-bold text-xl"></p>
            </DirectionAwareHoverCollections>
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

export default BrowseCarouselCollection;

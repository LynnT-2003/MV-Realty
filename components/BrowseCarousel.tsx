import { urlForImage } from "@/sanity/lib/image";
import React, { useRef, useState } from "react";
import { Image } from "sanity";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the prop types
interface BrowseCarouselProps {
  properties: Array<{ photos: Image[]; title: String }>;
}

const BrowseCarousel: React.FC<BrowseCarouselProps> = ({ properties }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRightClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <button
        className="mr-10 bg-white shadow-md rounded-full"
        onClick={scrollLeftClick}
        aria-label="Scroll Left"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        id="slider"
        ref={carouselRef}
        className="w-[1500px] overflow-x-scroll scroll whitespace-nowrap scroll-smooth"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {properties.map((property, index) => (
          <div
            key={index}
            className="relative inline-block w-[30.55rem] h-[20.78rem] mr-[1vw]"
          >
            <img
              src={urlForImage(property.photos[0])}
              alt={`Property ${property.title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4">
              <p className="text-lg font-semibold">{property.title}</p>
            </div>
          </div>
        ))}
        {properties.map((property, index) => (
          <div
            key={index}
            className="relative inline-block w-[30.55rem] h-[20.78rem] mr-[1vw]"
          >
            <img
              src={urlForImage(property.photos[0])}
              alt={`Property ${property.title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-transparent text-white p-4">
              <p className="text-lg font-semibold">{property.title}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="ml-10 bg-white shadow-md rounded-full"
        onClick={scrollRightClick}
        aria-label="Scroll Right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default BrowseCarousel;

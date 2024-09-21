"use client";
import React, { useState } from "react";
import { Lens } from "./ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { Listing, Property, Developer } from "@/types";
import property from "@/sanity/schemas/property";

interface LensDemoProps {
  property: Property;
  //   developers: Developer[];
}

const LensCardProperties: React.FC<LensDemoProps> = ({
  // The property object, which contains information about the property, such as its title, price, and hero image.
  property,
  //   developers: An array of developers, which would be used to display the developers involved in the property.
}) => {
  // A boolean state variable that determines whether the lens is currently being hovered over.
  const [hovering, setHovering] = useState(false);

  // The main JSX component, which renders the Lens component along with the property image and title.
  return (
    <div>
      <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto p-4">
        {/* The Rays and Beams components were previously used to create a nice background effect, but they have been removed. */}
        {/* <Rays /> */}
        {/* <Beams /> */}
        <div className="relative z-10">
          {/* The Lens component creates a lens that zooms in on the property image when hovered over. */}
          <Lens
            // The hovering prop is passed the hovering state variable, which determines whether the lens is currently being hovered over.
            hovering={hovering}
            // The setHovering prop is passed the setHovering function, which updates the hovering state variable when the lens is hovered over.
            setHovering={setHovering}
          >
            {/* The Image component renders the property hero image. */}
            <Image
              // The src prop is passed the URL of the property hero image.
              src={urlForImage(property?.propertyHero)}
              // The alt prop is passed the string "image", which is used to describe the image for accessibility purposes.
              alt="image"
              // The width and height props are passed the value 500, which sets the width and height of the image to 500px.
              width={500}
              height={500}
              // The className prop is passed the string "rounded-2xl", which adds a rounded border to the image.
              className="rounded-2xl"
            />
          </Lens>
          {/* The motion.div component creates a motion component that animates the filter property of its children. */}
          <motion.div
            // The animate prop is passed an object with a single property, filter, which is set to "blur(2px)" when the lens is hovered over and "blur(0px)" when the lens is not hovered over.
            animate={{
              filter: hovering ? "blur(2px)" : "blur(0px)",
            }}
            // The className prop is passed the string "py-4 relative z-20", which adds padding to the top and bottom of the component and sets its z-index to 20.
            className="py-4 relative z-20"
          >
            {/* The h2 component renders the property title. */}
            <h2 className="text-xl text-left">{property.title}</h2>
            {/* The p component renders a paragraph with the property price, but it is currently commented out. */}
            {/* <p className="text-left mt-2">Price: {property.price} Million THB</p> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LensCardProperties;

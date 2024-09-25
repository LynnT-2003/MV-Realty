"use client";
import React, { useState } from "react";
import { Lens } from "./ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { Listing, Property, Developer, UnitType } from "@/types";

interface LensDemoProps {
  //   listing: Listing;
  unitType: UnitType;
  //   developers: Developer[];
}

const LensCardUnitTypes: React.FC<LensDemoProps> = ({
  unitType,
  //   developers,
}) => {
  // We use a state variable to track whether the card is being hovered over.
  // We use this to conditionally apply a blur effect to the card when it's
  // not being hovered over.
  const [hovering, setHovering] = useState(false);

  // We return a JSX element that renders the listing card.
  return (
    <div>
      {/* We wrap the entire card in a containing div to set its max width and
        add some padding. */}
      <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto p-4">
        <div className="relative z-10">
          {/* We wrap the image in a <Lens> component, which applies a blur
            effect to the image when the card is not being hovered over. */}
          <Lens hovering={hovering} setHovering={setHovering}>
            <Image
              src={urlForImage(unitType?.unitHero)}
              alt="image"
              width={500}
              height={500}
              className="rounded-2xl"
            />
          </Lens>
          {/* We render the listing details (name and price) in a separate div
            that is positioned absolutely over the image. */}
          <motion.div
            // We animate the filter property of the div to apply a blur effect
            // when the card is not being hovered over.
            animate={{
              filter: hovering ? "blur(2px)" : "blur(0px)",
            }}
            // We set the class name to py-4 to add some padding to the div.
            className="py-4 relative z-20"
          >
            {/* We render the listing name as an h2 element. */}
            <h2 className="text-xl text-left">{unitType.unitTypeName}</h2>
            {/* We render the listing price as a paragraph element. */}
            <p className="text-left mt-2">
              Price: {unitType.startingPrice} Million THB
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LensCardUnitTypes;

"use client";
import React, { useState } from "react";
import { Lens } from "./ui/lens";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/image";
import { Listing, Property, Developer } from "@/types";

interface LensDemoProps {
  listing: Listing;
  //   developers: Developer[];
}

const LensCardListings: React.FC<LensDemoProps> = ({
  listing,
  //   developers,
}) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div>
      <div className="w-full relative rounded-3xl overflow-hidden max-w-md mx-auto p-4">
        {/* <Rays /> */}
        {/* <Beams /> */}
        <div className="relative z-10">
          <Lens hovering={hovering} setHovering={setHovering}>
            <Image
              src={urlForImage(listing?.listingHero)}
              alt="image"
              width={500}
              height={500}
              className="rounded-2xl"
            />
          </Lens>
          <motion.div
            animate={{
              filter: hovering ? "blur(2px)" : "blur(0px)",
            }}
            className="py-4 relative z-20"
          >
            <h2 className="text-xl text-left">{listing.listingName}</h2>
            <p className="text-left mt-2">Price: {listing.price} Million THB</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LensCardListings;

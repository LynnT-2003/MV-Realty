"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { Listing } from "@/types";

interface InfiniteMovingCardsDemoProps {
  listings: Listing[];
}
const InfiniteMovingCardsDemo: React.FC<InfiniteMovingCardsDemoProps> = ({
  listings,
}) => {
  return (
    <div className="h-full rounded-md flex flex-col antialiased bg-white items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={listings} direction="right" speed="fast" />
    </div>
  );
};

export default InfiniteMovingCardsDemo;

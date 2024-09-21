"use client";

import { cn } from "@/lib/utils";
import { Property, Listing } from "@/types";
import React, { useEffect, useState } from "react";
import LensCardProperties from "../LensCardProperties";
import LensCardListings from "../LensCardListings";
import { useRouter } from "next/navigation";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Listing[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const router = useRouter();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const handleListingClick = (slug: string) => {
    router.push(`/ListingDetails/${slug}`);
  };

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item, index) => {
        const duplicatedItem = item.cloneNode(true) as Element;
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
          addClickListener(duplicatedItem, items[index % items.length]); // Add click listener with corresponding item
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  // Add click listener with access to the item's properties
  function addClickListener(item: Element, listing: Listing) {
    item.addEventListener("click", () => {
      console.log(`Clicked on: ${listing.listingName}`); // Access the listing's properties
      handleListingClick(listing._id);
    });
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-0 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <div
            className="w-[450px] max-w-full relative rounded-2xl flex-shrink-0 border-slate-700 py-6"
            onClick={() => {
              console.log(`Clicked on ${item.listingName}!`);
              handleListingClick(item._id);
            }}
            key={item._id}
          >
            <LensCardListings listing={item} />
          </div>
        ))}
      </ul>
    </div>
  );
};

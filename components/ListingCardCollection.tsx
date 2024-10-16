"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Listing, Property } from "@/types";

import LensCardListings from "./LensCardListings";
import LensCardProperties from "./LensCardProperties";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import listing from "@/sanity/schemas/listing";

// const filters = ["Bedrooms", "Location", "Buy/Rent"] as const;
const filters = ["Bedrooms", "Location"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, any[]> = {
  Bedrooms: ["1", "2", "3"],
  Location: ["Siam", "Asoke", "Ratchathewi", "Phrom Phong"],
  // "Buy/Rent": ["Buy", "Rent"],
};

interface ListingCardCollectionProps {
  listings: Listing[];
  properties: Property[];
  showFilter: boolean;
  showProperties: boolean;
}

const ListingCardCollection: React.FC<ListingCardCollectionProps> = ({
  listings,
  properties,
  showFilter,
  showProperties,
}) => {
  const router = useRouter();

  const [maxPrice, setMaxPrice] = useState(9999999);
  const [maxInitPrice, setMaxInitPrice] = useState(9999999);

  useEffect(() => {
    if (listings.length > 0) {
      let maxListingPrice = Math.max(
        ...listings.map((listing) => listing.price)
      );
      setMaxInitPrice(maxListingPrice);
    }
  }, [listings]);

  // Desktop filter state
  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  // Mobile filter state
  const [openFilterMobile, setOpenFilterMobile] = useState<Filter | null>(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, any>>({
    Bedrooms: "",
    Location: "",
    // "Buy/Rent": "",
  });

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  // Create a filtered list based on all filters
  const filteredListings = useMemo(() => {
    console.log("Applying filters...");
    console.log("Max Price:", maxPrice);
    console.log("Selected Values:", selectedValues);

    const filteredBedroom = listings.filter((listing) => {
      return selectedValues.Bedrooms
        ? listing.bedroom === Number(selectedValues.Bedrooms)
        : true;
    });

    const filteredLocation = filteredBedroom.filter((listing) => {
      return selectedValues.Location
        ? listing.listingName.includes(selectedValues.Location)
        : true;
    });

    const filteredMaxPrice = filteredLocation.filter((listing) => {
      return listing.price <= maxPrice;
    });

    console.log("Listings", listings);
    console.log("Filtered Listings:", filteredMaxPrice); // Debug log

    return filteredMaxPrice;
  }, [listings, maxPrice, selectedValues]);

  const handleSliderChange = (value: number[]) => {
    setMaxPrice(value[0]);
    console.log(maxPrice);
  };

  const handleListingClick = (id: string) => {
    router.push(`/ListingDetails/${id}`);
  };
  return (
    <div className="ipad-screen:w-full w-screenrounded-lg overflow-hidden px-2 flex flex-col h-[85vh] overflow-y-scroll">
      {filteredListings.length > 0 && listings.length > 0 && (
        <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-semibold poppins-text">
          Available Listings for Rent
        </h1>
      )}

      {filteredListings.length > 0 && listings.length > 0 && (
        <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  handleListingClick(listing._id);
                }}
                className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
              >
                {/* <LensCardListings listing={listing} /> */}
                <LensCardListings listing={listing} />
              </div>
            );
          })}
        </div>
      )}

      {properties.length > 0 && showProperties == true && (
        <h1 className="pb-1 ipad-screen:ml-5 ml-9 font-semibold poppins-text">
          Available Properties
        </h1>
      )}

      {properties.length > 0 && showProperties == true && (
        <div className="flex grid grid-cols-1 ipad-screen:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  // handlePropertyClick(property._id);
                }}
                className="lg:ml-0 ipad-screen:px-0 px-5 relative rounded-lg overflow-hidden inline-block mb-4 md:mb-0 group w-full"
              >
                {/* <LensDemo listing={listing} properties={properties} /> */}
                {/* <h1>{property.title}</h1> */}
                <LensCardProperties property={property} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListingCardCollection;

"use client";
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types";
import getAllProperties from "@/services/getAllProperties";

// interface Property {
//   property_id?: string;
//   Title: string;
//   Developer: string;
//   Description: string;
//   Coordinates: [number, number];
//   MinPrice: number;
//   MaxPrice: number;
//   Facilities: string[];
//   Images: string[];
//   Built: number;
//   Created_at: string; // Use string to represent date
// }

const filters = ["Bedrooms", "Price", "Location", "Buy/Rent"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, string[]> = {
  Bedrooms: ["1-Bedroom", "2-Bedroom", "3-Bedroom"],
  Price: ["$0 - $100k", "$100k - $200k", "$200k+"],
  Location: ["New York", "San Francisco", "Chicago", "Los Angeles"],
  "Buy/Rent": ["Buy", "Rent"],
};

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [openFilter, setOpenFilter] = useState<Filter | null>(null);

  const [bedroomFilter, setBedroomFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [locationFilter, setLocationFilter] = useState(null);
  const [transactionOption, setTransactionOption] = useState(null);

  const [selectedValues, setSelectedValues] = useState<Record<Filter, string>>({
    Bedrooms: "",
    Price: "",
    Location: "",
    "Buy/Rent": "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    console.log("Active filters: ", selectedValues);
  }, [selectedValues]);

  const fetchProperties = async () => {
    try {
      // const response = await fetch("http://localhost:8080/properties", {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      const response: Property[] = await getAllProperties();

      if (!response) {
        throw new Error("Failed to fetch properties.");
      }
      console.log("Fetching...");
      // const data = await response.json();
      setProperties(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  return (
    <div>
      <div className="relative">
        <div className="flex items-center justify-center">
          <img
            src="/yinlin-banner.webp"
            className="md:h-[60vh] h-[30vh] w-screen object-cover"
          />
        </div>
        <div className="flex justify-center items-center w-full absolute bottom-0 translate-y-1/2">
          <div className="max-sm:hidden inline-flex justify-center items-center shadow-lg md:space-x-24 md:text-base sm:space-x-5 sm:text-lg space-x-8 text-xs py-2 px-10 bg-white rounded">
            {filters.map((filter) => (
              <div key={filter} className="md:px-0">
                <Popover
                  open={openFilter === filter}
                  onOpenChange={(isOpen) =>
                    setOpenFilter(isOpen ? filter : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFilter === filter}
                      className="w-[200px] justify-between"
                    >
                      {selectedValues[filter] || filter}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder={`Search ${filter}...`} />
                      <CommandList>
                        <CommandEmpty>No {filter} found.</CommandEmpty>
                        <CommandGroup>
                          {options[filter].map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={() => handleSelect(filter, option)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedValues[filter] === option
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:py-16 flex flex-col items-center justify-center">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full md:max-w-screen-xl pl-6 flex flex-col justify-center"
        >
          <h1 className="md:text-xl text-base pt-4 md:pl-4">
            Featured Listings:
          </h1>
          <CarouselContent className="w-full">
            {properties.map((property) => (
              <CarouselItem
                key={property._id}
                className="flex justify-center items-center md:w-full w-screen md:basis-1/4 basis-1/3"
              >
                <div className="p-2">
                  <Card className="w-full">
                    <CardContent className="flex aspect-square items-center justify-center p-0 shadow-lg">
                      <span className="text-3xl font-semibold text-center">
                        {property.photos.map((photo) => (
                          <img
                            key={photo._key}
                            src={urlForImage(photo)}
                            alt={property.title}
                            className="md:h-64 md:w-64 h-32 object-cover"
                          />
                        ))}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>

      <div className="md:py-16 flex flex-col items-center justify-center md:pt-0 pt-1">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full md:max-w-screen-xl pl-6 flex flex-col justify-center"
        >
          <h1 className="md:text-xl text-base pt-4 md:pl-4">
            Recommended for You:
          </h1>
          <CarouselContent className="w-full">
            {properties.map((property) => (
              <CarouselItem
                key={property._id}
                className="flex justify-center items-center md:w-full w-screen md:basis-1/4 basis-1/3"
              >
                <div className="p-2">
                  <Card className="w-full">
                    <CardContent className="flex aspect-square items-center justify-center p-0 shadow-lg">
                      <span className="text-3xl font-semibold text-center">
                        {property.photos.map((photo) => (
                          <img
                            key={photo._key}
                            src={urlForImage(photo)}
                            alt={property.title}
                            className="md:h-64 md:w-64 h-32 object-cover"
                          />
                        ))}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
    </div>
  );
};

export default HomePage;

"use client";
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";
import { useRouter } from "next/navigation";

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
import { Property, Listing, Developer } from "@/types";
import { fetchAllProperties } from "@/services/PropertyServices";

import { LayoutGridDemo } from "@/components/HomeLayoutGrid";
import { AnimatedHero } from "@/components/AnimatedHero";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import BrowseCarouselProperty from "@/components/BrowseCarouselProperty";
import { fetchAllListings } from "@/services/ListingServices";
import { List } from "postcss/lib/list";
import BrowseCarouselListing from "@/components/BrowseCarouselListing";
import { fetchAllDevelopers } from "@/services/DeveloperServices";
import HomeSearchSection from "@/components/HomeSearchSection";

const filters = ["Bedrooms", "Price", "Location", "Buy/Rent"] as const;

type Filter = (typeof filters)[number];

const options: Record<Filter, string[]> = {
  Bedrooms: ["1-Bedroom", "2-Bedroom", "3-Bedroom"],
  Price: ["$0 - $100k", "$100k - $200k", "$200k+"],
  Location: ["New York", "San Francisco", "Chicago", "Los Angeles"],
  "Buy/Rent": ["Buy", "Rent"],
};

const HomePage: React.FC = () => {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);

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

  // useEffect(() => {
  //   fetchProperties();
  //   fetchListings();
  // }, []);

  const setLocalStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const getLocalStorage = (key: string) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  };

  const fetchDataWithCache = async (
    key: string,
    fetchFunction: () => Promise<any>
  ) => {
    const storedData = getLocalStorage(key);
    if (storedData) {
      return storedData;
    }

    const fetchedData = await fetchFunction();
    setLocalStorage(key, fetchedData);
    return fetchedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel, using cached data if available
        const [propertiesData, listingsData, developersData] =
          await Promise.all([
            fetchDataWithCache("properties", fetchAllProperties),
            fetchDataWithCache("listings", fetchAllListings),
            fetchDataWithCache("developers", fetchAllDevelopers),
          ]);

        // Update state with fetched data
        setProperties(propertiesData);
        setListings(listingsData);
        setDevelopers(developersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Active filters: ", selectedValues);
  }, [selectedValues]);

  const fetchProperties = async () => {
    try {
      const response: Property[] = await fetchAllProperties();

      if (!response) {
        throw new Error("Failed to fetch properties.");
      }
      console.log("Fetching properties...");
      setProperties(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchListings = async () => {
    try {
      const response: Listing[] = await fetchAllListings();

      if (!response) {
        throw new Error("Failed to fetch listings.");
      }
      console.log("Fetching listings...");
      setListings(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (filter: Filter, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [filter]: value }));
    setOpenFilter(null);
  };

  const handlePropertyClick = (property: Property) => {
    console.log("Clicked on Property: ", { property });
    router.push(`/Details/${property.slug.current}`);
  };

  return (
    <div className="">
      {/* <AnimatedHero /> */}

      <div className="relative">
        {/* <div className="flex items-center justify-center">
          <img
            src="/mv_home_hero.jpg"
            // className="h-[600px] w-[1600px] macbook-air:w-[1280px] object-cover py-10"
          />
        </div> */}

        {/* <div className="flex justify-center items-center w-full absolute bottom-10 translate-y-1/2">
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
        </div> */}
      </div>

      {/* <div className="md:py-16 md:w-max-xl flex flex-col items-center justify-center">
        <LayoutGridDemo />
      </div> */}

      <div className="flex justify-center">
        <HomeSearchSection listings={listings} properties={properties} />
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px] overflow-x-scroll scroll whitespace-nowrap scroll-smooth">
          <p className="poppins-text pt-[62px] pb-[37px]">Featured Listings</p>
        </div>
      </div>
      <BrowseCarouselListing
        listings={listings}
        properties={properties}
        developers={developers}
      />

      <div className="w-full flex items-center justify-center">
        <div className="xl:w-[1200px] overflow-x-scroll scroll whitespace-nowrap scroll-smooth">
          <p className="poppins-text pt-[62px] pb-[37px]">
            Available Properties
          </p>
        </div>
      </div>
      <BrowseCarouselProperty properties={properties} />
    </div>
  );
};

export default HomePage;

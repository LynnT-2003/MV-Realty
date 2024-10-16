// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { LayoutGrid } from "@/components/ui/layout-grid";

// export default function LayoutGridDemo() {
//   return (
//     <div className="h-screen pt-12 w-full">
//       <LayoutGrid cards={cards} />
//     </div>
//   );
// }

// const SkeletonOne = () => {
//   return (
//     <div>
//       <p className="font-bold text-4xl text-white">House in the woods</p>
//       <p className="font-normal text-base text-white"></p>
//       <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
//         A serene and tranquil retreat, this house in the woods offers a peaceful
//         escape from the hustle and bustle of city life.
//       </p>
//     </div>
//   );
// };

// const SkeletonTwo = () => {
//   return (
//     <div>
//       <p className="font-bold text-4xl text-white">House above the clouds</p>
//       <p className="font-normal text-base text-white"></p>
//       <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
//         Perched high above the world, this house offers breathtaking views and a
//         unique living experience. It&apos;s a place where the sky meets home,
//         and tranquility is a way of life.
//       </p>
//     </div>
//   );
// };
// const SkeletonThree = () => {
//   return (
//     <div>
//       <p className="font-bold text-4xl text-white">Greens all over</p>
//       <p className="font-normal text-base text-white"></p>
//       <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
//         A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
//         perfect place to relax, unwind, and enjoy life.
//       </p>
//     </div>
//   );
// };
// const SkeletonFour = () => {
//   return (
//     <div>
//       <p className="font-bold text-4xl text-white">Rivers are serene</p>
//       <p className="font-normal text-base text-white"></p>
//       <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
//         A house by the river is a place of peace and tranquility. It&apos;s the
//         perfect place to relax, unwind, and enjoy life.
//       </p>
//     </div>
//   );
// };

// const cards = [
//   {
//     id: 1,
//     content: <SkeletonOne />,
//     className: "md:col-span-2",
//     thumbnail:
//       "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 2,
//     content: <SkeletonTwo />,
//     className: "col-span-1",
//     thumbnail:
//       "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 3,
//     content: <SkeletonThree />,
//     className: "col-span-1",
//     thumbnail:
//       "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 4,
//     content: <SkeletonFour />,
//     className: "md:col-span-2",
//     thumbnail:
//       "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
// ];

// pages/TagProperties.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Listing, Property, UnitType } from "@/types"; // Import types if needed
import {
  fetchAllListingsAndUnitTypeFromTags,
} from "@/services/TagsServices";

const TagPropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  const [loading, setLoading] = useState(true);

  // Tag ID for the service calls
  const tagId = "82131086-8e0c-4d89-a057-d4f1d0cd8551";

  // Fetch properties and unit types
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch properties by tagId
        const fetchedProperties = await fetchAllListingsAndUnitTypeFromTags(tagId);
        console.log("Fetched Properties:", fetchedProperties);
        setProperties(fetchedProperties);

      } catch (error) {
        console.error("Error fetching properties or unit types:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tagId]);

  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the fetched data
  return (
    <div>
      <h1>Properties with Tag: {tagId}</h1>

      <div>
        <h2>Properties:</h2>
        {properties.length > 0 ? (
          <ul>
            {properties.map((property) => (
              <li key={property._id}>Property ID: {property._id}</li>
            ))}
          </ul>
        ) : (
          <p>No properties found.</p>
        )}
      </div>

    </div>
  );
};

export default TagPropertiesPage;

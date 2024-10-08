"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Listing, UnitType } from "@/types";
import UnitTypeCardCollection from "@/components/UnitTypeCardCollection";

const ListingsContent = () => {
  // Get the search parameters from the URL
  const searchParams = useSearchParams();

  // Get the listings from the search parameters
  // The listings are stored in the search parameters as a JSON string
  // We need to parse the JSON string into an array of listings

  // const listings = JSON.parse(
  //   // Get the listings from the search parameters
  //   // The listings are stored in the search parameters as a JSON string
  //   // We need to decode the JSON string first
  //   decodeURIComponent(searchParams.get("listings") ?? "")
  // );

  console.log(searchParams.get("unitTypes"));
  const unitTypes = JSON.parse(
    decodeURIComponent(searchParams.get("unitTypes") ?? "")
  );
  console.log("Unit Types: ", unitTypes);

  // Return the JSX for the listings page
  return (
    <div>
      {/* 
        This is an example of how we could display the listings
        We are mapping over the listings array and rendering a list item for each listing
        Each list item displays the name of the listing
      */}
      {/* <ul>
        {listings.map((listing: Listing) => (
          <li key={listing._id}>{listing.listingName}</li>
        ))}
      </ul> */}
      {/* 
        Instead of displaying the listings as a list, we are using the ListingCardCollection component
        This component takes in the listings and properties as props and renders a collection of cards
        Each card displays the information of a single listing
      */}
      <UnitTypeCardCollection
        // Pass the listings as a prop to the component

        // listings={listings}
        unitTypes={unitTypes}
        // Pass an empty array of properties as a prop to the component
        // This is because we are not displaying any properties on this page
        properties={[]}
        // Pass true as a prop to the component
        // This tells the component to display the filter panel
        showFilter={true}
      />
    </div>
  );
};

// Suspense component for loading fallback
const Listings = () => {
  return (
    <Suspense fallback={<div>Loading listings...</div>}>
      <ListingsContent />
    </Suspense>
  );
};

export default Listings;

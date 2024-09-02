"use client";

import { useSearchParams } from "next/navigation";

const FilterResultsPage: React.FC = () => {
  const searchParams = useSearchParams();

  // Retrieve query parameters
  const bedrooms = searchParams.get("bedrooms") || "";
  const minprice = searchParams.get("minprice") || "";
  const maxprice = searchParams.get("maxprice") || "";
  const location = searchParams.get("location") || "";
  const buyRent = searchParams.get("buyRent") || "";

  console.log("IN FILTER PAGE:");
  console.log("Bedrooms:", bedrooms);
  console.log("Min Price:", minprice);
  console.log("Max Price:", maxprice);
  console.log("Location:", location);
  console.log("Buy/Rent:", buyRent);

  return <div>FilterResultsPage</div>;
};

export default FilterResultsPage;

import { client } from "@/sanity/lib/client";
import { Listing } from "@/types";

export async function fetchAllListings(): Promise<Listing[]> {
  return await client.fetch(`*[_type == "listing"]`);
}

export const fetchListingById = async (id: string): Promise<Listing> => {
  return await client.fetch(`*[_type == "listing" && _id == $id][0]`, { id });
};

export async function fetchListingsByPropertyId(propertyId: string): Promise<Listing[]> {
  return await client.fetch(
    `*[_type == "listing" && property._ref == $propertyId]`,
    { propertyId }
  );
}
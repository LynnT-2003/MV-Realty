import { client } from "@/sanity/lib/client";
import { ListOfListings } from "@/types";

export async function fetchAllListOfListings(): Promise<ListOfListings[]> {
  return await client.fetch(`*[_type == "listOfListings"]`);
}

export const fetchListOfListingsById = async (id: string): Promise<ListOfListings | null> => {
  const query = `*[_type == "listOfListings" && _id == $id][0]{
    _id,
    listOfListingName,
    photos,
    listings
  }`;
  const params = { id };
  const listOfListings = await client.fetch(query, params);
  return listOfListings;
};
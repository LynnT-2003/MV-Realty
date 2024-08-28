import { client } from "@/sanity/lib/client";
import { Collections } from "@/types";
export async function fetchAllCollections(): Promise<Collections[]> {
  return await client.fetch(`*[_type == "collections"]`);
}

export const fetchCollectionsById = async (id: string): Promise<Collections | null> => {
  const query = `*[_type == "collections" && _id == $id][0]{
    _id,
    collectionName,
    thumbnail,
    properties
  }`;
  const params = { id };
  const Collections = await client.fetch(query, params);
  return Collections;
};
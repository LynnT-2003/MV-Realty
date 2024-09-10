import { client } from "@/sanity/lib/client";
import { Tag } from "@/types";

export async function fetchAllTags() {
  return await client.fetch(`*[_type == "tags"]`);
}

export const fetchTagById = async (id: string): Promise<Tag | null> => {
  const query = `*[_type == "tags" && _id == $id][0]{
    _id,
    tag
  }`;
  const params = { id };
  const tag = await client.fetch(query, params);
  return tag;
};

export const fetchTagsFromListing = async (
  listingId: string
): Promise<Tag[] | null> => {
  const query = `
  *[_type == "listing" && _id == $listingId][0]{
    property->{
      tags[]->{
        _id,
        tag
      }
    }
  }
  `;
  const params = { listingId };
  const result = await client.fetch(query, params);
  return result?.property?.tags || [];
};

export const fetchTagsFromProperty = async (
  propertyId: string
): Promise<Tag[]> => {
  const query = `
  *[_type == "property" && _id == $propertyId][0]{
        tags[]->{
          _id,
          tag
        }
      }
  `;
  const params = { propertyId };
  const result = await client.fetch(query, params);
  return result?.tags || [];
};

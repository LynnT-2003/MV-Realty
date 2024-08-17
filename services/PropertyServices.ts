import { client } from "@/sanity/lib/client";
import { Property } from "@/types";

export async function fetchAllProperties() {
  return await client.fetch(`*[_type == "property"]`);
}

export const fetchPropertyBySlug = async (slug: string): Promise<Property> => {
  return await client.fetch(
    `*[_type == "property" && slug.current == $slug][0]`,
    { slug }
  );
};

export const fetchPropertyById = async (id: string): Promise<Property> => {
  return await client.fetch(`*[_type == "property" && _id == $id][0]`, { id });
};

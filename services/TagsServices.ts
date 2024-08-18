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

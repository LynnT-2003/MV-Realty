import { client } from "@/sanity/lib/client";
import { Developer } from "@/types";

export const fetchAllDevelopers = async (): Promise<Developer[]> => {
  return await client.fetch(`*[_type == "developer"]`);
};

export const fetchDeveloperById = async (
  id: string
): Promise<Developer | null> => {
  const query = `*[_type == "developer" && _id == $id][0]{
    _id,
    name,
    profileIcon
  }`;
  const params = { id };
  const developer = await client.fetch(query, params);
  return developer;
};

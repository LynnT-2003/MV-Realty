import { client } from "@/sanity/lib/client";
import { Ameneties } from "@/types";

export async function fetchAllAmeneties(): Promise<Ameneties[]> {
  return await client.fetch(`*[_type == "ameneties"]`);
}
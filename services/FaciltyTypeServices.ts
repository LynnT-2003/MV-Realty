import { client } from "@/sanity/lib/client";
import { FacilityType } from "@/types";

export const fetchFacilityTypeById = async (
  id: string
): Promise<FacilityType | null> => {
  const query = `*[_type == "facilityType" && _id == $id][0]{
    _id,
    name
  }`;
  const params = { id };
  const facilityType = await client.fetch(query, params);
  return facilityType;
};

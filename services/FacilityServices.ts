import { client } from "@/sanity/lib/client";
import { FacilityType } from "@/types";

export const fetchAllFacilityTypes = async (): Promise<FacilityType[]> => {
  return await client.fetch(`*[_type == "facilityType"]`);
};

export const fetchFacilityTypeById = async (
  id: string
): Promise<FacilityType> => {
  return await client.fetch(`*[_type == "facilityType" && _id == $id][0]`, {
    id,
  });
};

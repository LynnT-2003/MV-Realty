import { client } from "@/sanity/lib/client";
import { UnitType } from "@/types";

export async function fetchAllUnitTypes(): Promise<UnitType[]> {
  return await client.fetch(`*[_type == "unitType"]`);
}

export const fetchUnitTypeById = async (id: string): Promise<UnitType> => {
  return await client.fetch(`*[_type == "unitType" && _id == $id][0]`, { id });
};

export async function fetchUnitTypesByPropertyId(
  propertyId: string
): Promise<UnitType[]> {
  return await client.fetch(
    `*[_type == "unitType" && property._ref == $propertyId]`,
    { propertyId }
  );
}

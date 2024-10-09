import { client } from "@/sanity/lib/client";
import { Listing, Property, Tag, UnitType } from "@/types";

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

export const fetchAllListingsAndUnitTypeFromTags = async (tagId: string): Promise<Property[]> => {
  const query = `
*[_type == "property" && $tagId in tags[]._ref]{
  _id,
  unitType[]-> {
    _id,
    unitTypeName,
    description,
    startingPrice,
    size,
    bedroom,
    bathroom,
    furniture,
    status,
    createdAt,
    unitHero,
    unitPhoto,
    floorPlan,
    activeStatus
    },
  listing[]-> {
    _id,
    listingName,
    description,
    price,
    minimumContractInMonth,
    floor,
    size,
    bedroom,
    bathroom,
    furniture,
    status,
    listingType,
    facingDirection,
    createdAt,
    listingHero,
    listingPhoto,
    floorPlan,
    statusActive
  }
}
  `;
  
  const params = { tagId };
  
  try {
    const properties: Property[] = await client.fetch(query, params);
    return properties;
  } catch (error) {
    console.error('Error fetching properties from tags:', error);
    throw new Error('Failed to fetch properties from tags');
  }
};

// export const fetchUnitTypesFromProperties = async (propertyIds: string[]): Promise<UnitType[]> => {
//   const query = `
//     *[_type == "property" && _id in $propertyIds] {
//       unitType[]-> {
//         _id,
//         unitTypeName,
//         description,
//         startingPrice,
//         size,
//         bedroom,
//         bathroom,
//         furniture,
//         status,
//         createdAt,
//         unitHero,
//         unitPhoto,
//         floorPlan,
//         activeStatus
//       }
//     }
//   `;

//   const params = { propertyIds };

//   try {
//     const properties = await client.fetch(query, params);
//     // Extract unitTypes from properties and flatten the array
//     const unitTypes = properties.flatMap((property: any) => property.unitType || []);
//     return unitTypes;
//   } catch (error) {
//     console.error('Error fetching unit types from properties:', error);
//     throw new Error('Failed to fetch unit types from properties');
//   }
// };


// export const fetchListingsFromProperties = async (propertyIds: string[]): Promise<Listing[]> => {
//   const query = `
//     *[_type == "property" && _id in $propertyIds] {
//       listing[]-> {
//   _id,
//     property,
//     listingName,
//     description,
//     price,
//     minimumContractInMonth,
//     floor,
//     size,
//     bedroom,
//     bathroom,
//     furniture,
//     status,
//     listingType,
//     facingDirection,
//     createdAt,
//     listingHero,
//     listingPhoto,
//     floorPlan,
//     statusActive
//       }
//     }
//   `;

//   const params = { propertyIds };

//   try {
//     const properties = await client.fetch(query, params);
//     // Extract unitTypes from properties and flatten the array
//     const listings = properties.flatMap((property: any) => property.listing || []);
//     return listings;
//   } catch (error) {
//     console.error('Error fetching listings from properties:', error);
//     throw new Error('Failed to fetch listings from properties');
//   }
// };
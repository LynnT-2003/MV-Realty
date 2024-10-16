import { client } from "@/sanity/lib/client";
import { Listing, Property, UnitType } from "@/types"; // Assuming you have a Listing type

export const fetchAllListingsFromFeaturedListings = async (): Promise<Listing[]> => {
  const query = `
    *[_type == "featuredListing"]{
      listing[]-> {
        _id,
        listingName,
        description,
        property {
          _ref,  // Keep the property as a reference
          _type
        },
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

  try {
    const featuredListings = await client.fetch(query);

    // Extract and flatten the listings from all featured listings
    const listings = featuredListings.reduce((acc: Listing[], featured: any) => {
      return acc.concat(featured.listing);
    }, []);

    return listings;
  } catch (error) {
    console.error("Error fetching full listings from featured listings:", error);
    throw new Error("Failed to fetch full listings from featured listings");
  }
};

export const fetchAllUnitTypeFromFeaturedUnitType = async (): Promise<UnitType[]> => {
    const query = `
      *[_type == "featuredUnitType"]{
        unitType[]-> {
            _id,
            unitTypeName,
            description,
            property {
            _ref,  // Keep the property as a reference
            _type
            },    
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
        }
      }
    `;
  
    try {
      const featuredUnitType = await client.fetch(query);
  
      // Extract and flatten the listings from all featured listings
      const unitTypes = featuredUnitType.reduce((acc: UnitType[], featured: any) => {
        return acc.concat(featured.unitType);
      }, []);
  
      return unitTypes;
    } catch (error) {
      console.error("Error fetching full unitypes from featured unitypes:", error);
      throw new Error("Failed to fetch full unitypes from featured unitypes");
    }
  };
  
export const fetchAllPropertiesFromFeaturedProperties = async (): Promise<Property[]> => {
  const query = `
    *[_type == "featuredProperty"]{
      property[]-> {
        _id,
        title,
        slug,
        listing[] {
          _ref,
          _type
        },
        unitType[] {
          _ref,
          _type
        },
        developer {
          _ref,
          _type
        },
        description,
        mapUrl,
        geoLocation,
        minPrice,
        maxPrice,
        facilities,
        tags[] {
          _ref,
          _type
        },
        propertyHero,
        photos,
        completedOn,
        propertyFaqs[] {
          question {
            _ref,
            _type
          },
          answer
        },
        brochure,
        createdAt
      }
    }
  `;

  try {
    const featuredProperties = await client.fetch(query);

    // Extract and flatten the properties from all featured properties
    const properties = featuredProperties.reduce((acc: Property[], featured: any) => {
      return acc.concat(featured.property);
    }, []);

    return properties;
  } catch (error) {
    console.error("Error fetching properties from featured properties:", error);
    throw new Error("Failed to fetch properties from featured properties");
  }
};

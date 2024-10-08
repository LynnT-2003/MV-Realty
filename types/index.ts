// types.ts
import exp from "constants";
import { Image as SanityImage } from "sanity";

export interface Property {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type: string;
  };
  listing: {
    _ref: string;
    _type: string;
  }[];
  unitType: {
    _ref: string;
    _type: string;
  }[];
  developer: { _ref: string; _type: string };
  description: string;
  mapUrl: string;
  geoLocation: GeoLocation;
  minPrice: number;
  maxPrice: number;
  facilities: Facility[];
  tags: { _ref: string; _type: string }[];  // Reference to tags
  propertyHero: SanityImageWithKey;
  photos: SanityImageWithKey[];
  completedOn: number;
  propertyFaqs: {
    question: { _ref: string; _type: string };  // Reference to PropertyFaqs
    answer: string;  // Text for the answer
  }[];
  brochure: FileAsset;  // New field for brochure
  createdAt: string;
}
export interface Listing {
  _id: string;
  property: {
    _ref: string;
    _type: string;
  };
  listingName: string;
  description: string;
  price: number;
  minimumContractInMonth: number;
  floor: number;
  size: number;
  bedroom: number;
  bathroom: number;
  furniture: "fully-fitted" | "fully-furnished";
  status: "ready-to-move-in" | "finishing-2026";
  listingType: "sale" | "rent";
  facingDirection: "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW";
  createdAt: string; // ISO date string
  listingHero: SanityImageWithKey;
  listingPhoto: SanityImageWithKey[];
  floorPlan: SanityImageWithKey;
  statusActive: "active" | "inactive";
}

export interface UnitType {
  _id: string;
  property: {
    _ref: string;
    _type: string;
  };
  unitTypeName: string;
  description: string;
  startingPrice: number;
  size: number;
  bedroom: number;
  bathroom: number;
  furniture: "fully-fitted" | "fully-furnished";
  status: "ready-to-move-in" | "finishing-2026";
  createdAt: string; // ISO date string
  unitHero: SanityImageWithKey;
  unitPhoto: SanityImageWithKey[];
  floorPlan: SanityImageWithKey;
  activeStatus: "active" | "inactive";
}

export interface Developer {
  _id: string;
  name: string;
  description: string;
  profileIcon: SanityImageWithKey;
}

export interface Facility {
  facilityType: {
    _ref: string;
    _type: string;
  };
  facilityName: string;
  description: string;
  photos: SanityImageWithKey[];
}

export interface Tag {
  _id: string;
  tag: string;
}

export interface Faqs {
  _id: string;
  question: string;
  answer: string;
}

export interface PropertyFaqs {
  _id: string;
  question: string;
}

export interface Collections {
  _id: string;
  collectionName: string;
  thumbnail: SanityImageWithKey;
  properties: {
    _ref: string;
    _type: string;
  }[];
}

export interface SanityImageWithKey extends SanityImage {
  _key: string;
}

export interface FacilityType {
  _id: string;
  _type: "facilityType";
  name: string;
}

export interface FileAsset {
  asset: {
    _ref: string;
    _type: string;
  };
}

export interface GeoLocation {
  _type: string;
  lat: number;
  lng: number;
}

export interface Ameneties {
  _id: string;
  name: string;
  geoLocation: GeoLocation;
  amenetiesPhoto: SanityImageWithKey;
}

export interface FeaturedListing {
  _id: string;
  listing: {
    _ref: string;
    _type: string;
  }[];
}

export interface FeaturedProperty {
  _id: string;
  property: {
    _ref: string;
    _type: string;
  }[];
}

export interface FeaturedUnitType {
  _id: string;
  unitType: {
    _ref: string;
    _type: string;
  }[];
}
// types.ts
import { Image as SanityImage } from "sanity";

export interface Developer {
  _id: string;
  name: string;
  profileIcon: SanityImageWithKey;
}

export interface Property {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type: string;
  };
  developer: { _ref: string; _type: string };
  description: string;
  mapUrl: string;
  geoLocation: GeoLocation;
  minPrice: number;
  maxPrice: number;
  facilities: Facility[];
  photos: SanityImageWithKey[];
  built: number;
  createdAt: string;
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
export interface SanityImageWithKey extends SanityImage {
  _key: string;
}

export interface GeoLocation {
  _type: string;
  lat: number;
  lng: number;
}

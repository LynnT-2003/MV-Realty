// types.ts
import { Image as SanityImage } from 'sanity';

export interface Property {
  _id: string;
  title: string;
  slug: {
    current: string;
    _type: string;
  };
  developer: string;
  description: string;
  mapUrl: string; // Changed from coordinates to mapUrl as per your schema
  minPrice: number;
  maxPrice: number;
  facilities: Facility[]; // Updated to match the schema for facilities
  photos: SanityImage[];
  built: number;
  createdAt: string;
}

export interface Facility {
  name: string;
  description: string;
  photos: SanityImage[];
}

// export interface Image {
//   _key: string;
//   asset: {
//     _ref: string;
//     _type: string;
//   };
// }

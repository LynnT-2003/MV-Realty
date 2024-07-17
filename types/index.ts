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
  mapUrl: string;
  minPrice: number;
  maxPrice: number;
  facilities: Facility[];
  photos: SanityImageWithKey[];
  built: number;
  createdAt: string;
}

export interface Facility {
  name: string;
  description: string;
  photos: SanityImageWithKey[];
}

export interface SanityImageWithKey extends SanityImage {
  _key: string;
}

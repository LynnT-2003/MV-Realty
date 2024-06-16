// types.ts
export interface Property {
    _id: string;
    title: string;
    developer: string;
    description: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    minPrice: number;
    maxPrice: number;
    facilities: string[];
    photos: {
      _key: string;
      asset: {
        _ref: string;
        _type: string;
      };
    }[];
    built: number;
    createdAt: string;
  }
  
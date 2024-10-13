import React, { useEffect, useState } from "react";
// Assuming getAllAmenities is the service you have that returns the amenities
import { fetchAllAmeneties } from "@/services/AmenetiesService";
import { Ameneties, GeoLocation, Property } from "@/types";
import { urlForImage } from "@/sanity/lib/image";

interface NearbyAmenities {
  property: Property;
}

const NearbyAmenities: React.FC<NearbyAmenities> = ({ property }) => {
  const [nearbyAmenities, setNearbyAmenities] = useState<Ameneties[]>([]);

  useEffect(() => {
    // Fetch amenities from the service
    fetchAllAmeneties().then((amenities) => {
      const filteredAmenities = amenities.filter((amenity) => {
        // Calculate Euclidean distance between property and amenity location
        const distance = haversine(property.geoLocation, amenity.geoLocation);
        // Filter amenities within 2km
        return distance <= 2;
      });
      setNearbyAmenities(filteredAmenities);
    });
  }, [property]);

  if (nearbyAmenities.length === 0) {
    return null;
  }

  return (
    <div className="w-full flex justify-center md:pb-0">
      <div className="md:max-w-[1150px] w-[85vw]">
        <p className="poppins-text-title-small md:property-details-title-text pb-8">
          Popular amenities nearby
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-between">
          {nearbyAmenities.map((amenity) => (
            <div
              key={amenity._id}
              className="relative inline-block w-full sm:w-auto mb-4 group"
            >
              <img
                src={urlForImage(amenity.amenetiesPhoto)}
                alt={amenity.name}
                className="w-full object-cover rounded-lg"
              />
              <div className="mt-4">
                <p className="poppins-text-avg-bold">
                {amenity.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const haversine = (location1: GeoLocation, location2: GeoLocation) => {
  // Convert degrees to radians
  const toRadians = (degree: any) => (degree * Math.PI) / 180;

  const lat1 = toRadians(location1.lat);
  const lon1 = toRadians(location1.lng);
  const lat2 = toRadians(location2.lat);
  const lon2 = toRadians(location2.lng);

  // Haversine formula
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const R = 6371; // Radius of Earth in kilometers
  const distance = R * c;

  return distance; // Distance in kilometers
};

export default NearbyAmenities;

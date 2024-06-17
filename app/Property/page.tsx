// app/property/page.tsx
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Property } from "../../types";

const fetchProperties = async (): Promise<Property[]> => {
  return await client.fetch(`*[_type == "property"]`);
};

const PropertyPage = async () => {
  const properties = await fetchProperties();

  return (
    <div>
      {properties.map((property) => (
        <div key={property._id}>
          <h1>{property.title}</h1>
          <p>Developer: {property.developer}</p>
          <p>{property.description}</p>
          <p>
            Coordinates: {property.coordinates.lat}, {property.coordinates.lng}
          </p>
          <p>Min Price: ${property.minPrice}</p>
          <p>Max Price: ${property.maxPrice}</p>
          <div>
            <h2>Facilities:</h2>
            <ul>
              {property.facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Photos:</h2>
            {property.photos.map((photo) => (
              <img
                key={photo._key}
                src={urlForImage(photo)}
                alt={property.title}
              />
            ))}
          </div>
          <p>Built: {property.built}</p>
          <p>Created at: {new Date(property.createdAt).toDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyPage;

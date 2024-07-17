// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { client } from "@/sanity/lib/client";
// import { urlForImage } from "@/sanity/lib/image";
// import { Property } from "../../types";
// import { fetchAllProperties } from "@/services/PropertyServices";

// const PropertyPage = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const getPropertiesFromLocalStorage = (): Property[] | null => {
//       const storedProperties = localStorage.getItem("properties");
//       if (storedProperties) {
//         return JSON.parse(storedProperties);
//       }
//       return null;
//     };

//     const storePropertiesInLocalStorage = (properties: Property[]) => {
//       localStorage.setItem("properties", JSON.stringify(properties));
//     };

//     const fetchProperties = async () => {
//       const localProperties = getPropertiesFromLocalStorage();
//       if (localProperties) {
//         setProperties(localProperties);
//       } else {
//         const fetchedProperties = await fetchAllProperties();
//         setProperties(fetchedProperties);
//         storePropertiesInLocalStorage(fetchedProperties);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const handlePropertyClick = (slug: string) => {
//     console.log("Clicked on property with slug:", slug);
//     router.push(`/Property/${slug}`);
//   };

//   return (
//     <div>
//       {properties.map((property) => (
//         <div
//           key={property._id}
//           onClick={() => handlePropertyClick(property.slug.current)}
//           style={{ cursor: "pointer" }}
//         >
//           <h1>{property.title}</h1>
//           <p>
//             <strong>Developer:</strong> {property.developer}
//           </p>
//           <p>
//             <strong>Description:</strong> {property.description}
//           </p>
//           <p>
//             <strong>Slug:</strong> {property.slug.current}
//           </p>
//           <p>
//             <strong>Map URL:</strong>{" "}
//             <a href={property.mapUrl} target="_blank" rel="noopener noreferrer">
//               {property.mapUrl}
//             </a>
//           </p>
//           <p>
//             <strong>Price Range:</strong> ${property.minPrice} - $
//             {property.maxPrice}
//           </p>
//           <p>
//             <strong>Built Year:</strong> {property.built}
//           </p>
//           <p>
//             <strong>Created At:</strong>{" "}
//             {new Date(property.createdAt).toLocaleDateString()}
//           </p>

//           <div>
//             <h2>Facilities</h2>
//             {property.facilities.length > 0 ? (
//               property.facilities.map((facility, index) => (
//                 <div key={index}>
//                   <h3>{facility.name}</h3>
//                   <p>{facility.description}</p>
//                   {facility.photos.length > 0 && (
//                     <div>
//                       {facility.photos.map((photo) => (
//                         <img
//                           // key={photo._key}
//                           src={urlForImage(photo)}
//                           alt={facility.name}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p>No facilities available</p>
//             )}
//           </div>

//           <div>
//             <h2>Photos</h2>
//             {property.photos.length > 0 ? (
//               property.photos.map((photo) => (
//                 <img
//                   // key={photo._key}
//                   src={urlForImage(photo)}
//                   alt={`Photo ${photo._key}`}
//                 />
//               ))
//             ) : (
//               <p>No photos available</p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PropertyPage;

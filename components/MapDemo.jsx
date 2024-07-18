"use client";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const containerStyle = {
  width: "400px",
  height: "400px",
};

export const MapDemo = ({ lat, lng }) => {
  const mapRef = React.useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places", "directions"], // Load the places and directions libraries
      });

      await loader.load();

      const google = window.google;
      const position = { lat, lng };

      // Custom map styles to hide other details
      const mapStyles = [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "off" }],
        },
      ];

      const mapOptions = {
        center: position,
        zoom: 16,
        styles: mapStyles, // Apply custom styles
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);

      new google.maps.Marker({
        map: map,
        position: position,
      });

      const service = new google.maps.places.PlacesService(map);

      const request = {
        location: position,
        radius: 1000, // Search within 1000 meters radius
        type: "transit_station", // Search for transit stations
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const directionsService = new google.maps.DirectionsService();

          results.forEach((place) => {
            if (place.name.includes("BTS")) {
              const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name,
              });

              // Calculate walking distance
              const calculateWalkingDistance = () => {
                const directionsRequest = {
                  origin: position,
                  destination: place.geometry.location,
                  travelMode: google.maps.TravelMode.WALKING,
                };

                directionsService.route(directionsRequest, (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    const distance = result.routes[0].legs[0].distance.text;
                    const duration = result.routes[0].legs[0].duration.text;

                    // Create a custom InfoWindow
                    const infoWindowContent = `
                    <div>
                      <strong>${place.name}</strong><br>
                      Distance: ${distance}<br>
                      Walking duration: ${duration}
                    </div>
                  `;

                    // Create a new InfoWindow instance
                    const infoWindow = new google.maps.InfoWindow({
                      content: infoWindowContent,
                      disableAutoPan: true,
                    });

                    marker.addListener("mouseover", () => {
                      infoWindow.open(map, marker);
                    });

                    marker.addListener("mouseout", () => {
                      infoWindow.close();
                    });
                  }
                });
              };

              calculateWalkingDistance();
            }
          });
        }
      });
    };

    initMap();
  }, [lat, lng]);

  return <div style={{ height: "600px" }} ref={mapRef}></div>;
};

export default MapDemo;

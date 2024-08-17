"use client";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";

export const MapDemo = ({ lat, lng }) => {
  const mapRef = React.useRef(null);
  const [nearestBTS, setNearestBTS] = useState([]);

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
          const btsList = []; // Temporary array to store BTS information

          results.forEach((place) => {
            if (place.name.includes("BTS") && !place.name.includes("Exit")) {
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

                    // Add BTS information to the list
                    btsList.push({
                      name: place.name,
                      distance,
                      duration,
                    });

                    // Update state with BTS list
                    setNearestBTS([...btsList]);
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "auto",
        minHeight: "500px",
        paddingBottom: "400px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1150px",
          height: "0",
          paddingBottom: "60%", // Maintain aspect ratio
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          ref={mapRef}
        ></div>
      </div>

      <div className="pl-4 pt-4">
        <p className="pl-4 poppins-text-title-small md:property-details-title-text">
          Nearest Transit
        </p>
        {nearestBTS.map((bts, index) => (
          // <div>
          //   {bts.name} {bts.distance} {bts.duration}
          // </div>
          <Grid
            container
            rowSpacing={{ xs: 4, md: 3 }}
            columnSpacing={{ xs: 1, md: 2 }}
            spacing={2}
            className="flex items-center"
          >
            <Grid item xs={6}>
              <div className="flex items-center justify-start h-32 p-4">
                <img src="/icons/compass.png" className="" alt="MRT Icon" />
                <p className="poppins-text-small-bts md:poppins-text-avg-bold ml-3.5">
                  {bts.name}
                </p>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="flex items-center justify-start h-32 p-4">
                <img src="/icons/floor.png" className="" alt="MRT Icon" />
                <p className="poppins-text-small-bts md:poppins-text-avg-bold ml-3.5">
                  {bts.duration}
                </p>
              </div>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
};

export default MapDemo;

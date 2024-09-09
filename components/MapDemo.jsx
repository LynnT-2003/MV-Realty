"use client";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";

export const MapDemo = ({ lat, lng }) => {
  const mapRef = React.useRef(null);
  const [nearestBTS, setNearestBTS] = useState([]);

  const btsStationsSukhumvitLine = [
    "Ratchathewi",
    "Asok",
    "Mo Chit",
    "Siam",
    "Phaya Thai",
    "Chit Lom",
    "Sala Daeng",
    "Phrom Phong",
    "Thong Lo",
    "Ekkamai",
    "Phra Khanong",
    "On Nut",
    "Bang Chak",
    "Punnawithi",
    "Udom Suk",
    "Bang Na",
    "Bearing",
    "Samrong",
    "Nana",
    "Asok",
    "Phloen Chit",
    "Chit Lom",
    "Siam",
    "Ratchadamri",
    "Sala Daeng",
    "National Stadium",
    "Ratchathewi",
    "Phaya Thai",
    "Victory Monument",
    "Sanam Pao",
    "Ari",
    "Saphan Khwai",
  ];

  const btsStationsSilomLine = [
    "National Stadium",
    "Siam",
    "Ratchadamri",
    "Sala Daeng",
    "Chong Nonsi",
    "Surasak",
    "Saphan Taksin",
    "Krung Thon Buri",
    "Wongwian Yai",
    "Pho Nimit",
    "Talat Phlu",
    "Wutthakat",
    "Bang Wa",
  ];

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
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ visibility: "on" }],
        },
      ];

      const mapOptions = {
        center: position,
        zoom: 16,
        styles: mapStyles, // Apply custom styles
        mapTypeControl: false, // Disable map type control (satellite, terrain, etc.)
        streetViewControl: false, // Disable street view control
        fullscreenControl: false, // Disable fullscreen control
        rotateControl: false, // Disable rotate control
        zoomControl: true, // Enable zoom control
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);

      const customMarkerIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(40, 40),
      };

      const marker = new google.maps.Marker({
        map: map,
        position: position,
        icon: customMarkerIcon,
      });

      // Create an InfoWindow with "You are here" text
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="text-align:center;text-sm;">You are here!</div>`,
      });

      // Automatically open the InfoWindow when the map is loaded
      infoWindow.open(map, marker);

      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: position,
        radius: 1000, // Search within 1000 meters radius
        type: "subway_station", // Search for transit stations
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const directionsService = new google.maps.DirectionsService();

          const btsList = []; // Temporary array to store BTS information

          results.forEach((place) => {
            const directionsRenderer = new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: true, // Prevent automatic markers, as we'll add custom ones
              preserveViewport: true,
            });
            if (
              (btsStationsSukhumvitLine.some((station) =>
                place.name.includes(station)
              ) ||
                btsStationsSilomLine.some((station) =>
                  place.name.includes(station)
                )) &&
              !place.name.includes("Exit")
            ) {
              const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name,
              });

              // Calculate walking distance and draw the route
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

                    // Draw the route on the map
                    directionsRenderer.setDirections(result);

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

                    // Flag to track whether the InfoWindow is open
                    let infoWindowOpen = false;

                    // Marker click event listener
                    marker.addListener("click", () => {
                      if (!infoWindowOpen) {
                        infoWindow.open(map, marker); // Open the InfoWindow
                        infoWindowOpen = true;
                      } else {
                        infoWindow.close(); // Close the InfoWindow
                        infoWindowOpen = false;
                      }
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
                      line: btsStationsSukhumvitLine.includes(place.name)
                        ? "Sukhumvit Line"
                        : "Silom Line", // Categorize by line
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

  const renderNearestStations = (lineName, stations) => {
    return (
      <div className="pl-4 pt-4">
        <p className="pl-4 poppins-text-title-small md:property-details-title-text">
          {lineName}
        </p>
        {stations.map((bts, index) => (
          <Grid
            container
            rowSpacing={{ xs: 4, md: 3 }}
            columnSpacing={{ xs: 1, md: 2 }}
            spacing={2}
            className="flex items-center"
            key={index}
          >
            <Grid item xs={6}>
              <div className="flex items-center justify-start h-32 p-4">
                <img
                  src="/icons/compass.png"
                  className="w-8 h-8"
                  alt="MRT Icon"
                />
                <p className="poppins-text-small-bts md:poppins-text-avg-bold ml-3.5">
                  {bts.name}
                </p>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="flex items-center justify-start h-32 p-4">
                <img
                  src="/icons/floor.png"
                  className="w-8 h-8"
                  alt="MRT Icon"
                />
                <p className="poppins-text-small-bts md:poppins-text-avg-bold ml-3.5">
                  {bts.duration}
                </p>
              </div>
            </Grid>
          </Grid>
        ))}
      </div>
    );
  };

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

      {nearestBTS.length == 0 && (
        <>
          <h1 className="text-red-300 pt-4 text-center">
            No nearby BTS station within 1000 metres.
          </h1>
        </>
      )}

      {/* Render nearest BTS stations by line */}
      {nearestBTS.length > 0 && (
        <>
          {nearestBTS.some((bts) => bts.line === "Sukhumvit Line") &&
            renderNearestStations(
              "Sukhumvit Line",
              nearestBTS.filter((bts) => bts.line === "Sukhumvit Line")
            )}

          {nearestBTS.some((bts) => bts.line === "Silom Line") &&
            renderNearestStations(
              "Silom Line",
              nearestBTS.filter((bts) => bts.line === "Silom Line")
            )}
        </>
      )}
    </div>
  );
};

export default MapDemo;

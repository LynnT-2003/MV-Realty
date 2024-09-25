"use client";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";
import {
  btsStationsGreenLine,
  btsStationsSilomLine,
  mrtStationsYellowLine,
  mrtStationsPinkLine,
  airportLink,
} from "./constants/btsStations";
import { set } from "sanity";

/**
 * A component that renders a map with the nearest BTS stations.
 *
 * Props:
 * - lat: The latitude of the starting point.
 * - lng: The longitude of the starting point.
 *
 * The component will render a map with the nearest BTS stations within 1000 meters.
 * If no BTS stations are found within 1000 meters, it will render a message indicating
 * that no stations were found.
 *
 * The map is rendered with custom styles to hide other details, and the nearest BTS
 * stations are marked with a custom icon. The InfoWindow for each station will show
 * the name of the station, the walking distance, and the walking duration.
 *
 * The component also renders a list of the nearest BTS stations by line.
 */

export const MapDemo = ({ lat, lng }) => {
  // Ref to the map element
  const mapRef = React.useRef(null);

  // State to store the nearest BTS stations
  const [nearestBTS, setNearestBTS] = useState([]);
  const [nearbybtsStationsGreenLineState, setnearbybtsStationsGreenLineState] =
    useState([]);
  const [nearbyBtsSilomLineStationsState, setnearbyBtsSilomLineStationsState] =
    useState([]);
  const [
    nearbyMrtYellowLineStationsState,
    setNearbyMrtYellowLineStationsState,
  ] = useState([]);
  const [nearbyMrtPinkLineStationsState, setNearbyMrtPinkLineStationsState] =
    useState([]);
  const [nearbyAirportLinkState, setNearbyAirportLinkState] = useState([]);

  useEffect(() => {
    const initMap = async () => {
      // Load the Google Maps API
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["places", "directions"], // Load the places and directions libraries
      });

      await loader.load();

      // Create the map
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

      // Custom marker icon
      const customMarkerIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(40, 40),
      };

      // Add a marker for the current location
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

      // Search for BTS stations within 1000 meters radius
      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: position,
        radius: 1000, // Search within 1000 meters radius
        type: "subway_station", // Search for transit stations
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const directionsService = new google.maps.DirectionsService();

          results.forEach((place) => {
            const directionsRenderer = new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: true, // Prevent automatic markers, as we'll add custom ones
              preserveViewport: true,
            });

            if (
              (btsStationsGreenLine.some((station) =>
                place.name.includes(station.name)
              ) ||
                btsStationsSilomLine.some((station) =>
                  place.name.includes(station.name)
                ) ||
                mrtStationsYellowLine.some((station) =>
                  place.name.includes(station.name)
                ) ||
                mrtStationsPinkLine.some((station) =>
                  place.name.includes(station.name)
                ) ||
                airportLink.some((station) =>
                  place.name.includes(station.name)
                )) &&
              !place.name.includes("Exit")
            ) {
              // const marker = new google.maps.Marker({
              //   map: map,
              //   position: place.geometry.location,
              //   title: place.name,
              // });

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

                    // Categorize and push station info to the appropriate array
                    const stationInfo = {
                      name: String,
                      id: String,
                      distance,
                      duration,
                    };

                    const matchedStationGreen = btsStationsGreenLine.find(
                      (station) => place.name.includes(station.name)
                    );

                    const matchedStationSilom = btsStationsSilomLine.find(
                      (station) => place.name.includes(station.name)
                    );

                    const matchedStationYellow = mrtStationsYellowLine.find(
                      (station) => place.name.includes(station.name)
                    );

                    const matchedStationPink = mrtStationsPinkLine.find(
                      (station) => place.name.includes(station.name)
                    );

                    const matchedAirportLink = airportLink.find((station) =>
                      place.name.includes(station.name)
                    );

                    if (matchedStationGreen) {
                      const newStation = {
                        name: matchedStationGreen.name,
                        id: matchedStationGreen.id,
                        distance: distance,
                        duration: duration,
                      };

                      setnearbybtsStationsGreenLineState((prevStations) => [
                        ...prevStations,
                        newStation,
                      ]);

                      console.log(
                        "nearbybtsStationsGreenLineHERE !",
                        newStation
                      );
                    }

                    if (matchedStationSilom) {
                      const newStation = {
                        name: matchedStationSilom.name,
                        id: matchedStationSilom.id,
                        distance: distance,
                        duration: duration,
                      };

                      setnearbyBtsSilomLineStationsState((prevStations) => [
                        ...prevStations,
                        newStation,
                      ]);

                      console.log(
                        "nearbyBtsSilomLineStationsHERE !",
                        newStation
                      );
                    }

                    if (matchedStationYellow) {
                      const newStation = {
                        name: matchedStationYellow.name,
                        id: matchedStationYellow.id,
                        distance: distance,
                        duration: duration,
                      };

                      setNearbyMrtYellowLineStationsState((prevStations) => [
                        ...prevStations,
                        newStation,
                      ]);
                      console.log(
                        "nearbyMrtYellowLineStationsHERE !",
                        newStation
                      );
                    }

                    if (matchedStationPink) {
                      const newStation = {
                        name: matchedStationPink.name,
                        id: matchedStationPink.id,
                        distance: distance,
                        duration: duration,
                      };

                      setNearbyMrtPinkLineStationsState((prevStations) => [
                        ...prevStations,
                        newStation,
                      ]);
                      console.log(
                        "nearbyMrtPinkLineStationsHERE !",
                        newStation
                      );
                    }

                    if (matchedAirportLink) {
                      const newStation = {
                        name: matchedAirportLink.name,
                        id: matchedAirportLink.id,
                        distance: distance,
                        duration: duration,
                      };

                      setNearbyAirportLinkState((prevStations) => [
                        ...prevStations,
                        newStation,
                      ]);
                      console.log("nearbyAirportLinksHERE !", newStation);
                    }
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

  // Render the map
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

      {nearbybtsStationsGreenLineState.length == 0 &&
      nearbyBtsSilomLineStationsState.length == 0 ? (
        <>
          <h1 className="text-red-300 pt-4 text-center">
            No nearby BTS station within 1000 metres.
          </h1>
        </>
      ) : (
        <>
          <div className="text-xl font-semibold pt-4 ">
            Nearby Transportation
          </div>
        </>
      )}

      <>
        {nearbybtsStationsGreenLineState.length > 0 && (
          <div className="py-0 bg-blue-500 h-full px-4 md:px-0">
            <div className="pl-4 pt-4">
              <p className="pl-4 poppins-text-title-small md:property-details-title-text"></p>
              {nearbybtsStationsGreenLineState &&
                nearbybtsStationsGreenLineState.length > 0 && (
                  <div className="flex flex-col">
                    {nearbybtsStationsGreenLineState.map((station, index) => (
                      <div key={index}>
                        <div className="flex flex-row items-center justify-between md:w-1/2 my-2">
                          <div className="flex flex-row items-center">
                            <img
                              src={"/bts-icons/green.png"}
                              className="w-10 h-10"
                              alt={"greenline_logo"}
                            />
                            <h1 className="ml-5">{station.id}</h1>
                            <h1 className="ml-5">{station.name}</h1>
                          </div>
                          <div className="flex flex-row items-center">
                            {" "}
                            <h1 className="px-2">{station.distance}</h1>
                            <h1 className="px-2">{station.duration}</h1>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {nearbyBtsSilomLineStationsState &&
          nearbyBtsSilomLineStationsState.length > 0 && (
            <div className="flex flex-col">
              {nearbyBtsSilomLineStationsState.map((station, index) => (
                <div key={index}>
                  <div className="flex flex-row items-center justify-between md:w-1/2 my-2">
                    <div className="flex flex-row items-center">
                      <img
                        src={"/bts-icons/green.png"}
                        className="w-10 h-10"
                        alt={"greenline_logo"}
                      />
                      <h1 className="ml-5">{station.id}</h1>
                      <h1 className="ml-5">{station.name}</h1>
                    </div>
                    <div className="flex flex-row items-center">
                      {" "}
                      <h1 className="px-2">{station.distance}</h1>
                      <h1 className="px-2">{station.duration}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {nearbyMrtYellowLineStationsState &&
          nearbyMrtYellowLineStationsState.length > 0 && (
            <div className="flex flex-col">
              {nearbyMrtYellowLineStationsState.map((station, index) => (
                <div key={index}>
                  <div className="flex flex-row items-center justify-between md:w-1/2 my-2">
                    <div className="flex flex-row items-center">
                      <img
                        src={"/bts-icons/green.png"}
                        className="w-10 h-10"
                        alt={"greenline_logo"}
                      />
                      <h1 className="ml-5">{station.id}</h1>
                      <h1 className="ml-5">{station.name}</h1>
                    </div>
                    <div className="flex flex-row items-center">
                      {" "}
                      <h1 className="px-2">{station.distance}</h1>
                      <h1 className="px-2">{station.duration}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {nearbyMrtPinkLineStationsState &&
          nearbyMrtPinkLineStationsState.length > 0 && (
            <div className="flex flex-col">
              {nearbyMrtPinkLineStationsState.map((station, index) => (
                <div key={index}>
                  <div className="flex flex-row items-center justify-between md:w-1/2 my-2">
                    <div className="flex flex-row items-center">
                      <img
                        src={"/bts-icons/green.png"}
                        className="w-10 h-10"
                        alt={"greenline_logo"}
                      />
                      <h1 className="ml-5">{station.id}</h1>
                      <h1 className="ml-5">{station.name}</h1>
                    </div>
                    <div className="flex flex-row items-center">
                      {" "}
                      <h1 className="px-2">{station.distance}</h1>
                      <h1 className="px-2">{station.duration}</h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {nearbyAirportLinkState && nearbyAirportLinkState.length > 0 && (
          <div className="flex flex-col">
            {nearbyAirportLinkState.map((station, index) => (
              <div key={index}>
                <div className="flex flex-row items-center justify-between md:w-1/2 my-2">
                  <div className="flex flex-row items-center">
                    <img
                      src={"/bts-icons/green.png"}
                      className="w-10 h-10"
                      alt={"greenline_logo"}
                    />
                    <h1 className="ml-5">{station.id}</h1>
                    <h1 className="ml-5">{station.name}</h1>
                  </div>
                  <div className="flex flex-row items-center">
                    {" "}
                    <h1 className="px-2">{station.distance}</h1>
                    <h1 className="px-2">{station.duration}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    </div>
  );
};

export default MapDemo;

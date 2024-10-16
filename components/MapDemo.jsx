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
  mrtStationsBlueLine,
} from "./constants/btsStations";
import { set } from "sanity";

const haversine = (lat1, lon1, lat2, lon2) => {
  // Convert degrees to radians
  const toRadians = (degree) => (degree * Math.PI) / 180;

  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

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

  // Combine all stations into a single array
  const allStations = [
    ...btsStationsGreenLine,
    ...btsStationsSilomLine,
    ...mrtStationsYellowLine,
    ...mrtStationsPinkLine,
    ...airportLink,
    ...mrtStationsBlueLine,
  ];

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
  const [nearbyMrtBlueLineState, setNearbyMrtBlueLineState] = useState([]);

  useEffect(() => {
    const initMap = async () => {
      // Load the Google Maps API
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: "weekly",
        libraries: ["directions"],
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

      // Calculate distances from the current position to all stations
      const nearbyStations = allStations.filter((station) => {
        const distance = haversine(lat, lng, station.lat, station.lng);
        console.log("Distance:", station.name, distance);
        return distance <= 1; // Only include stations within 1000 meters
      });

      const uniqueBtsStations = [
        ...new Set(allStations.map((station) => station.id)),
      ].map((id) => {
        return allStations.find((station) => station.id === id);
      });
      setNearestBTS(nearbyStations);
      console.log("Nearest BTS:", nearbyStations, nearestBTS);

      // Create an InfoWindow with "You are here" text
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="text-align:center;text-sm;">You are here!</div>`,
      });

      // Automatically open the InfoWindow when the map is loaded
      infoWindow.open(map, marker);

      nearbyStations.forEach((place) => {
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true, // Prevent automatic markers, as we'll add custom ones
          preserveViewport: true,
        });

        if (
          btsStationsGreenLine.some((station) =>
            place.id.includes(station.id)
          ) ||
          btsStationsSilomLine.some((station) =>
            place.id.includes(station.id)
          ) ||
          mrtStationsYellowLine.some((station) =>
            place.id.includes(station.id)
          ) ||
          mrtStationsPinkLine.some((station) =>
            place.id.includes(station.id)
          ) ||
          airportLink.some((station) => 
            place.id.includes(station.id)
          ) ||
          mrtStationsBlueLine.some((station) => 
            place.id.includes(station.id)
          )) {
          const directionsService = new google.maps.DirectionsService();
          const calculateWalkingDistance = () => {
            const directionsRequest = {
              origin: position,
              destination: { lat: place.lat, lng: place.lng },
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

                const matchedStationGreen = btsStationsGreenLine.find(
                  (station) => place.name.includes(station.name)
                );

                const matchedStationSilom = btsStationsSilomLine.find(
                  (station) => place.name.includes(station.name)
                );

                const matchedStationYellow = mrtStationsYellowLine.find(
                  (station) => place.name.includes(station.name)
                );

                const matchedStationPink = mrtStationsPinkLine.find((station) =>
                  place.name.includes(station.name)
                );

                const matchedAirportLink = airportLink.find((station) =>
                  place.name.includes(station.name)
                );
                
                const matchedMrtBlue = mrtStationsBlueLine.find((station) =>
                  place.name.includes(station.name)
                );

                if (matchedStationGreen) {
                  const newStation = {
                    name: matchedStationGreen.name,
                    id: matchedStationGreen.id,
                    distance: distance,
                    duration: duration,
                  };

                  setnearbybtsStationsGreenLineState((prevStations) => {
                    if (
                      !prevStations.find(
                        (station) => station.id === newStation.id
                      )
                    ) {
                      return [...prevStations, newStation];
                    }
                    return prevStations;
                  });
                  console.log("Nearby Green Line:", newStation);
                }

                if (matchedStationSilom) {
                  const newStation = {
                    name: matchedStationSilom.name,
                    id: matchedStationSilom.id,
                    distance: distance,
                    duration: duration,
                  };

                  setnearbyBtsSilomLineStationsState((prevStations) => {
                    if (
                      !prevStations.find(
                        (station) => station.id === newStation.id
                      )
                    ) {
                      return [...prevStations, newStation];
                    }
                    return prevStations;
                  });
                }

                if (matchedStationYellow) {
                  const newStation = {
                    name: matchedStationYellow.name,
                    id: matchedStationYellow.id,
                    distance: distance,
                    duration: duration,
                  };

                  setNearbyMrtYellowLineStationsState((prevStations) => {
                    if (
                      !prevStations.find(
                        (station) => station.id === newStation.id
                      )
                    ) {
                      return [...prevStations, newStation];
                    }
                    return prevStations;
                  });
                }

                if (matchedStationPink) {
                  const newStation = {
                    name: matchedStationPink.name,
                    id: matchedStationPink.id,
                    distance: distance,
                    duration: duration,
                  };

                  setNearbyMrtPinkLineStationsState((prevStations) => {
                    if (
                      !prevStations.find(
                        (station) => station.id === newStation.id
                      )
                    ) {
                      return [...prevStations, newStation];
                    }
                    return prevStations;
                  });
                }

                if (matchedAirportLink) {
                  const newStation = {
                    name: matchedAirportLink.name,
                    id: matchedAirportLink.id,
                    distance: distance,
                    duration: duration,
                  };

                  setNearbyAirportLinkState((prevStations) => {
                    if (
                      !prevStations.find(
                        (station) => station.id === newStation.id
                      )
                    ) {
                      return [...prevStations, newStation];
                    }
                    return prevStations;
                  });
                }

                if (matchedMrtBlue) {
                  const newStation = {
                    name: matchedMrtBlue.name,
                    id: matchedMrtBlue.id,
                    distance: distance,
                    duration: duration,
                  };

                  setNearbyMrtBlueLineState((prevStations) => {
                    if (
                      !prevStations.find(
                        (station) => station.id === newStation.id
                      )
                    ) {
                      return [...prevStations, newStation];
                    }
                    return prevStations;
                  });
                }
              }
            });
          };

          calculateWalkingDistance();
        }
      });
    };

    initMap();
  }, [lat, lng]);

  const StationList = ({ stations, iconSrc, altText }) => {
    return (
      <div className="flex flex-col">
        {stations.map((station, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between w-full my-2 px-2"
          >// fix ui
            <div className="flex flex-row items-center">
              <img src={iconSrc} className="w-10 h-10" alt={altText} />
              <h1 className="ml-5 font-semibold">{station.id}</h1>
              <h1 className="ml-5">{station.name}</h1>
            </div>
            <div className="flex flex-row items-center">
              {/* <img src="/bts-icons/distance.svg" className="w-8 h-8 ml-5" alt="Walking distance" />
            <h1 className="ml-5">{station.distance}</h1> */}
              <img
                src="/bts-icons/walk.svg"
                className="w-8 h-8 ml-5"
                alt="walking duration"
              />
              <h1 className="ml-4">{station.duration}</h1>
            </div>
          </div>
        ))}
      </div>
    );
  };
  // Render the map
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
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
          className="rounded-lg"
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
          <div className="text-xl font-semibold py-6 mt-5 lg:pt-4 ">
            Nearby Transit
          </div>
        </>
      )}

      <>
        {nearbybtsStationsGreenLineState &&
          nearbybtsStationsGreenLineState.length > 0 && (
            <StationList
              stations={nearbybtsStationsGreenLineState}
              iconSrc="/bts-icons/green.png"
              altText="greenline_logo"
            />
          )}

        {nearbyBtsSilomLineStationsState &&
          nearbyBtsSilomLineStationsState.length > 0 && (
            <StationList
              stations={nearbyBtsSilomLineStationsState}
              iconSrc="/bts-icons/silom.png"
              altText="silomLine_logo"
            />
          )}

        {nearbyMrtYellowLineStationsState &&
          nearbyMrtYellowLineStationsState.length > 0 && (
            <StationList
              stations={nearbyMrtYellowLineStationsState}
              iconSrc="/bts-icons/yellow.png"
              altText="yellowLine_logo"
            />
          )}

        {nearbyMrtPinkLineStationsState &&
          nearbyMrtPinkLineStationsState.length > 0 && (
            <StationList
              stations={nearbyMrtPinkLineStationsState}
              iconSrc="/bts-icons/pink.png"
              altText="pinkLogo"
            />
          )}
        {nearbyAirportLinkState && nearbyAirportLinkState.length > 0 && (
          <StationList
            stations={nearbyAirportLinkState}
            iconSrc="/bts-icons/ARLbangkok.png"
            altText="ARL"
          />
        )}
        {nearbyMrtBlueLineState && nearbyMrtBlueLineState.length > 0 && (
          <StationList
            stations={nearbyMrtBlueLineState}
            iconSrc="/bts-icons/blueMRT.png"
            altText="BlueLineMRT"
          />
        )}

      </>
    </div>
  );
};

export default MapDemo;

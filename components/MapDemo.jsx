"use client";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Loader } from "@googlemaps/js-api-loader";
import {
  btsGreenLineStations,
  btsStationsSilomLine,
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
  const [nearbyBtsGreenLineStationsState, setnearbyBtsGreenLineStationsState] =
    useState([]);
  const [nearbyBtsSilomLineStationsState, setnearbyBtsSilomLineStationsState] =
    useState([]);

  const btsGreenLineStations = [
    { id: "N24", name: "Khu Khot", lat: 13.932341, lng: 100.646626 },
    { id: "N23", name: "Yaek Kor Por Aor", lat: 13.924983, lng: 100.625876 },
    {
      id: "N22",
      name: "Royal Thai Air Force Museum",
      lat: 13.917945,
      lng: 100.621715,
    },
    {
      id: "N21",
      name: "Bhumibol Adulyadej Hospital",
      lat: 13.910722,
      lng: 100.617423,
    },
    { id: "N20", name: "Siphan Mai", lat: 13.896595, lng: 100.609132 },
    { id: "N19", name: "Sai Yud", lat: 13.888442, lng: 100.604292 },
    { id: "N18", name: "Phahon Yothin 59", lat: 13.882454, lng: 100.600766 },
    {
      id: "N17",
      name: "Wat Phra Sri Mahathat",
      lat: 13.875286,
      lng: 100.596811,
    },
    {
      id: "N16",
      name: "11th Infantry Regiment",
      lat: 13.867528,
      lng: 100.59194,
    },
    { id: "N15", name: "Bang Bua", lat: 13.855994, lng: 100.585171 },
    {
      id: "N14",
      name: "Royal Forest Department",
      lat: 13.850255,
      lng: 100.581794,
    },
    {
      id: "N13",
      name: "Kasetsart University",
      lat: 13.842065,
      lng: 100.577026,
    },
    { id: "N12", name: "Sena Nikhom", lat: 13.836608, lng: 100.573802 },
    { id: "N11", name: "Ratchayothin", lat: 13.829684, lng: 100.569737 },
    { id: "N10", name: "Phahon Yothin 24", lat: 13.823852, lng: 100.566356 },
    { id: "N9", name: "Ha Yaek Lat Phrao", lat: 13.817229, lng: 100.562343 },
    { id: "N8", name: "Mo Chit", lat: 13.802649, lng: 100.553763 },
    { id: "N7", name: "Saphan Khwai", lat: 13.793834, lng: 100.549696 },
    { id: "N5", name: "Ari", lat: 13.779788, lng: 100.544704 },
    { id: "N4", name: "Sanam Pao", lat: 13.772642, lng: 100.542103 },
    { id: "N3", name: "Victory Monument", lat: 13.762793, lng: 100.537085 },
    { id: "N2", name: "Phaya Thai", lat: 13.756822, lng: 100.533782 },
    { id: "N1", name: "Ratchathewi", lat: 13.751931, lng: 100.531535 },
    { id: "CEN", name: "Siam", lat: 13.745558, lng: 100.534603 },
    { id: "E1", name: "Chit Lom", lat: 13.74409, lng: 100.543028 },
    { id: "E2", name: "Phloen Chit", lat: 13.74306, lng: 100.548849 },
    { id: "E3", name: "Nana", lat: 13.740508, lng: 100.555412 },
    { id: "E4", name: "Asok", lat: 13.736996, lng: 100.560387 },
    { id: "E5", name: "Phromg Phong", lat: 13.730434, lng: 100.569688 },
    { id: "E6", name: "Thong Lo", lat: 13.724243, lng: 100.578502 },
    { id: "E7", name: "Ekkamai", lat: 13.719439, lng: 100.585274 },
    { id: "E8", name: "Phra Khanong", lat: 13.715178, lng: 100.591332 },
    { id: "E9", name: "On Nut", lat: 13.705545, lng: 100.601064 },
    { id: "E10", name: "Bang Chak", lat: 13.696551, lng: 100.605486 },
    { id: "E11", name: "Punnawithi", lat: 13.689303, lng: 100.609041 },
    { id: "E12", name: "Udom Suk", lat: 13.67993, lng: 100.609554 },
    { id: "E13", name: "Bang Na", lat: 13.668122, lng: 100.604649 },
    { id: "E14", name: "Bearing", lat: 13.66117, lng: 100.601862 },
    { id: "E15", name: "Sarong", lat: 13.646192, lng: 100.595653 },
    { id: "E16", name: "Pu Chao", lat: 13.637247, lng: 100.591993 },
    { id: "E17", name: "Chang Erawan", lat: 13.621447, lng: 100.590112 },
    {
      id: "E18",
      name: "Royal Thai Navy Academy",
      lat: 13.608552,
      lng: 100.594827,
    },
    { id: "E19", name: "Pak Nam", lat: 13.60207, lng: 100.597072 },
    { id: "E20", name: "Srinagarindra", lat: 13.592079, lng: 100.608906 },
    { id: "E21", name: "Peraek Sa", lat: 13.584324, lng: 100.608027 },
    { id: "E22", name: "Sai Luat", lat: 13.577784, lng: 100.605396 },
    { id: "E23", name: "Kheha", lat: 13.567647, lng: 100.60768 },
  ];

  const btsStationsSilomLine = [
    { id: "W1", name: "National Stadium", lat: 13.746491, lng: 100.529351 },
    { id: "CEN", name: "Siam", lat: 13.745515, lng: 100.534605 },
    { id: "S1", name: "Ratchadamri", lat: 13.739471, lng: 100.539453 },
    { id: "S2", name: "Sala Daeng", lat: 13.72855, lng: 100.534347 },
    { id: "S3", name: "Chong Nonsi", lat: 13.723727, lng: 100.52943 },
    {
      id: "S4",
      name: "Saint Louis",
      lat: 13.7210655982596,
      lng: 100.526995996725,
    },
    { id: "S5", name: "Surasak", lat: 13.719314, lng: 100.521602 },
    { id: "S6", name: "Saphan Taksin", lat: 13.718801, lng: 100.514086 },
    { id: "S7", name: "Krung Thon Buri", lat: 13.720877, lng: 100.502841 },
    { id: "S8", name: "Wongwian Yai", lat: 13.721149, lng: 100.495259 },
    { id: "S9", name: "Pho Nimit", lat: 13.719221, lng: 100.485945 },
    { id: "S1", name: "Talat Phlu", lat: 13.714215, lng: 100.476677 },
    { id: "S10", name: "Wutthakat", lat: 13.71297, lng: 100.468913 },
    { id: "S11", name: "Bang Wa", lat: 13.720699, lng: 100.457795 },
  ];

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

          const btsList = []; // Temporary array to store BTS information
          const nearbyBtsGreenLineStations = []; // List of BTS stations on the Green Line
          const nearbyBtsStationsSilomLine = []; // List of BTS stations on the Silom Line

          results.forEach((place) => {
            const directionsRenderer = new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: true, // Prevent automatic markers, as we'll add custom ones
              preserveViewport: true,
            });

            if (
              (btsGreenLineStations.some((station) =>
                place.name.includes(station.name)
              ) ||
                btsStationsSilomLine.some((station) =>
                  place.name.includes(station.name)
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

                    // Categorize and push station info to the appropriate array
                    const stationInfo = {
                      name: String,
                      id: String,
                      distance,
                      duration,
                    };

                    const matchedStationGreen = btsGreenLineStations.find(
                      (station) => place.name.includes(station.name)
                    );

                    const matchedStationSilom = btsStationsSilomLine.find(
                      (station) => place.name.includes(station.name)
                    );

                    if (matchedStationGreen) {
                      stationInfo.name = matchedStationGreen.name;
                      stationInfo.id = matchedStationGreen.id;
                      nearbyBtsGreenLineStations.push(stationInfo);
                      console.log(
                        "nearbyBtsGreenLineStationsHERE !",
                        nearbyBtsGreenLineStations
                      );
                      setnearbyBtsGreenLineStationsState(
                        nearbyBtsGreenLineStations
                      );
                    }

                    if (matchedStationSilom) {
                      stationInfo.name = matchedStationSilom.name;
                      stationInfo.id = matchedStationSilom.id;
                      nearbyBtsStationsSilomLine.push(stationInfo);
                      console.log(
                        "nearbyBtsSilomLineStationsHERE !",
                        nearbyBtsStationsSilomLine
                      );
                      setnearbyBtsSilomLineStationsState(
                        nearbyBtsStationsSilomLine
                      );
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

  // Function to render nearest BTS stations by line
  const renderNearestStations = (lineName, line, stations) => {
    const lineIcons = {
      green: "/bts-icons/green.png",
      silom: "/bts-icons/silom.png",
    };

    return (
      <div className="pl-4 pt-4">
        <p className="pl-4 poppins-text-title-small md:property-details-title-text"></p>
        {stations && stations.length > 0 && (
          <Grid
            container
            rowSpacing={{ xs: 4, md: 3 }}
            columnSpacing={{ xs: 1, md: 2 }}
            spacing={2}
            className="flex items-center"
          >
            {stations.map((bts, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <div className="flex items-center justify-start p-0">
                    <img
                      src={lineIcons[line]}
                      className="w-10 h-10"
                      alt={line}
                    />
                    <p className="ml-5">{bts.id}</p>
                    <p className="poppins-text-small-bts md:poppins-text-avg-bold ml-3.5">
                      {bts.name || "Unknown Station"}
                    </p>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="flex items-center justify-start p-0">
                    <img
                      src="/icons/floor.png"
                      className="w-6 h-6"
                      alt="MRT Icon"
                    />
                    <p className="poppins-text-small-bts md:poppins-text-avg-bold ml-3.5">
                      {bts.duration || "N/A"}
                    </p>
                  </div>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        )}
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

      {nearbyBtsGreenLineStationsState.length == 0 &&
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
        {nearbyBtsGreenLineStationsState.length > 0 && (
          <div className="py-0 h-full">
            {renderNearestStations(
              "Sukhumvit Green Line",
              "green",
              nearbyBtsGreenLineStationsState
            )}
          </div>
        )}

        {nearbyBtsSilomLineStationsState.length > 0 && (
          <div>
            {renderNearestStations(
              "Silom Line",
              "silom",
              nearbyBtsSilomLineStationsState
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default MapDemo;

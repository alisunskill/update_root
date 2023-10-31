import React from "react";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@mui/icons-material/Room";

const MapComponent = () => {
  const center = { lat: 34.052235, lng: -118.243683 };

  const locations = [
    {
      name: "Philz Coffee",
      lat: 34.046438,
      lng: -118.259653,
    },
    {
      name: "Philz Coffee",
      lat: 34.046438,
      lng: -117.259653,
    },
    // Add more locations here...
  ];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMapReact
        defaultCenter={center}
        defaultZoom={9}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            lat={location.lat}
            lng={location.lng}
            name={location.name}
            address={location.address}
            link={location.link}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

const Marker = ({ name, address, link }) => (
  <div>
    <RoomIcon style={{ color: "red" }} />
    <div>
      <strong>{name}</strong>
      <p>{address}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        Get Directions
      </a>
    </div>
  </div>
);

export default MapComponent;

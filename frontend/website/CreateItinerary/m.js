import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import RoomIcon from "@mui/icons-material/Room";

export default function SimpleMap() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [address, setAddress] = useState("");

  const defaultProps = {
    center: {
      lat: 33.572423,
      lng: 73.146750
    },
    zoom: 11
  };

  useEffect(() => {
    // Get the user's current location using the browser's geolocation API
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
    // Function to fetch the street address based on the current location
    const fetchAddress = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        setAddress("Error fetching address");
      }
    };

    if (currentLocation) {
      fetchAddress(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  const handleMapClick = ({ lat, lng }) => {
    setCurrentLocation({ lat, lng });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM" }} // Replace with your actual API key
        defaultCenter={currentLocation ? currentLocation : null}
        defaultZoom={defaultProps.zoom}
        center={currentLocation ? currentLocation : null}
        onClick={handleMapClick}
      >
        {currentLocation && (
          <RoomIcon
            lat={currentLocation.lat}
            lng={currentLocation.lng}
            style={{
              color:'#EA4335'
            }}
          />
        )}
      </GoogleMapReact>

      {currentLocation && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
          <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
          <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
          <p>Address: {address}</p>
        </div>
      )}
    </div>
  );
}

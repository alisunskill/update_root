import React, { useEffect, useState } from "react";
import styles from "../../styles/singular.module.css";
import burger from "../../public/images/burger.svg";
import painticon from "../../public/images/painticon.svg";
import travelicon from "../../public/images/travelicon.svg";
import mapimage from "../../public/images/mapimage.svg";
import Image from "next/image";
import Geocode from "react-geocode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import gallery from "../../public/images/gallery.svg";
import GoogleMapReact from "google-map-react";
import { Button, Collapse } from "react-bootstrap";
import { useRouter } from "next/router";
import PlaceCardFull from "../components/PlaceCardFull";

const collapseData = [
  { id: 1, title: "Item 1", content: "Content for Item 1" },
  { id: 2, title: "Item 2", content: "Content for Item 2" },
  { id: 3, title: "Item 3", content: "Content for Item 3" },
];

const eventData = [
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
    time: "9:00 am",
  },
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
    time: "9:00 am",
  },
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
    time: "10:00 am",
  },
];

function UpcomingtripsList() {
  const router = useRouter();

  const RedMarker = ({ regionName, latitude, longitude }) => (
    <div
      style={{
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        background: "red",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
        cursor: "pointer",
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
      lat={latitude}
      lng={longitude}
    >
      <p className="px-5  py-1 bg-danger rounded-5">{regionName}</p>
    </div>
  );

  const { tripid } = router.query;
  const [openCollapseId, setOpenCollapseId] = React.useState(1);
  const [tripCoordinates, setTripCoordinates] = useState([]);
  const [trips, setTrips] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const locationName = trips.map((item) => item.region);

  // const apiKey = "AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM";
  useEffect(() => {
    const apiKey = "AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM";
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/trips");
        const tripsWithCoordinates = await Promise.all(
          response.data.map(async (trip) => {
            const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              trip.region
            )}&key=${apiKey}`;
            const geocodingResponse = await axios.get(geocodingUrl);
            const { results } = geocodingResponse.data;
            if (results.length > 0) {
              const { lat, lng } = results[0].geometry.location;
              return { ...trip, coordinates: { lat, lng } };
            }
            return trip;
          })
        );
        setTrips(tripsWithCoordinates);
        setTripCoordinates(tripsWithCoordinates);

        const tripsWithValidCoordinates = tripsWithCoordinates.filter(
          (trip) => trip.coordinates
        );

        if (tripsWithValidCoordinates.length > 0) {
          const latSum = tripsWithValidCoordinates.reduce(
            (sum, trip) => sum + trip.coordinates.lat,
            0
          );
          const lngSum = tripsWithValidCoordinates.reduce(
            (sum, trip) => sum + trip.coordinates.lng,
            0
          );
          console.log(
            "Trips with coordinates:",
            tripsWithCoordinates.map((itm) => itm.coordinates)
          );
          const avgLat = latSum / tripsWithValidCoordinates.length;
          const avgLng = lngSum / tripsWithValidCoordinates.length;
          setCenter({ lat: avgLat, lng: avgLng });
        }
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
      }
    };

    fetchCoordinates();
  }, []);

  useEffect(() => {
    const tripsWithCoordinates = trips.filter((trip) => trip.coordinates);

    if (tripsWithCoordinates.length > 0) {
      const latSum = tripsWithCoordinates.reduce(
        (sum, trip) => sum + trip.coordinates.lat,
        0
      );
      const lngSum = tripsWithCoordinates.reduce(
        (sum, trip) => sum + trip.coordinates.lng,
        0
      );
      const avgLat = latSum / tripsWithCoordinates.length;
      const avgLng = lngSum / tripsWithCoordinates.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
    const selectedTrip = trips.find((trip) => trip._id === tripid);
    if (selectedTrip && selectedTrip.coordinates) {
      setCenter(selectedTrip.coordinates);
    }
  }, [trips, tripid]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/trips");
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };
  useEffect(() => {
    fetchTrips();
  }, []);
  console.log(tripid, "tripId ali");
  const goBack = () => {
    router.back();
  };
  const toggleCollapse = (id) => {
    setOpenCollapseId((prevId) => (prevId === id ? null : id));
  };

  return (
    <>
      {/* {tripid} */}
      <div className="container-fluid py-5">
        <div className="row">
          <h1 className="dark bold pb-3 text-center mb-4">Single Trip View</h1>
          <div
            className={`col-lg-5 col-12 col-md-12 mt-3 ${styles.scenerypara}`}
          >
            <div className="row justify-content-between align-items-center">
              <div className="col-2">
                <FontAwesomeIcon
                  onClick={goBack}
                  icon={faTimes}
                  className="p-2 cursor-pointer"
                  style={{
                    color: "black",
                    border: "1px solid black",
                    borderRadius: "50px",
                    width: "30px",
                    height: "30px",
                  }}
                  size="2x"
                />
              </div>
              <div className="col-2">
                <Image
                  className="cursor-pointer"
                  width={45}
                  height={45}
                  src={gallery}
                />
              </div>
            </div>
            {/* days */}
            <div className="row px-0 pt-5">
              <div
                className="col-12 mx-0 px-0 rounded-2"
                style={{ background: "#eeeeee" }}
              >
                {/* {collapseData.map((item) => (
                  <div key={item.id}>
                    <Button
                      onClick={() => toggleCollapse(item.id)}
                      aria-controls={`collapse-${item.id}`}
                      aria-expanded={openCollapseId === item.id}
                      className={`col-12 p-0 text-start text-dark ${styles.dayshero}`}
                    >
                      {item.title}
                    </Button>
                    <Collapse in={openCollapseId === item.id}>
                      <div id={`collapse-${item.id}`}>
                        <div className="row">
                          <div className="col-lg-12 col-md-12 pt-0 mt-0">
                            <div
                              className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                              style={{ background: "white" }}
                            >
                              {eventData.map((item, index) => {
                                return (
                                  <PlaceCardFull
                                    key={index}
                                    imageUrl={item.bgImg}
                                    itinerary={item.itinerary}
                                    title={item.title}
                                    place={item.place}
                                    time={item.time}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                ))} */}
                <div className="row">
                  <div className="col-lg-12 col-md-12 pt-0 mt-0">
                    <div
                      className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                      style={{ background: "white" }}
                    >
                      {trips
                        .filter((item) => item._id === tripid)
                        .map((item, index) => {
                          return (
                            <PlaceCardFull
                              key={index}
                              imageUrl={item.image}
                              itinerary={"ITINERARY"}
                              title={item.title}
                              place={item.region ? item.region : item.region}
                              time={item.sdate}
                              edate={item.edate}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-1">
            <div className="row">
              <div
                className={`col-12 col-md-12 col-lg-12 ${styles.eventmidicons}`}
              >
                <div className={styles.eventicons}>
                  <Image
                    className={`h-auto ${styles.foodIcons}`}
                    src={burger}
                    alt=""
                  />
                </div>
                <div className={` ${styles.eventicons}`}>
                  <Image
                    className={`h-auto ${styles.foodIcons}`}
                    src={painticon}
                    alt=""
                  />
                </div>
                <div className={` ${styles.eventicons}`}>
                  <Image
                    className={`h-auto ${styles.foodIcons}`}
                    src={travelicon}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-align-right p-0">
            {trips
              .filter((item) => item._id === tripid)
              .map((item, index) => {
                return (
                  <h3 className="dark bold pb-3 text-center fw-600">
                    Date: {item.sdate} to {item.edate}
                  </h3>
                );
              })}
            {/* <h3 className="dark bold pb-3 text-center fw-600">
              30th June to 30th July
            </h3> */}

            {/* <Image
              className={`h-auto ${styles.eventmapimage}`}
              src={mapimage}
              alt=""
              l
            /> */}
            {/* map key */}
            {/* AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM  */}

            <div style={{ height: "100vh", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM",
                }}
                center={
                  center.lat !== 0 && center.lng !== 0
                    ? {
                        lat: center.lat,
                        lng: center.lng,
                      }
                    : { lat: 0, lng: 0 }
                }
                zoom={7}
              >
                {/* Marker */}
                {/* Dynamic Markers */}
                {/* <RedMarker
                  regionName="Center"
                  latitude={center.lat}
                  longitude={center.lng}
                /> */}
                <div
                  lat={center.lat}
                  lng={center.lng}
                  style={{
                    color: "red",
                    fontSize: "24px",
                  }}
                >
                  📍
                </div>
                {tripCoordinates.map((trip) => {
                  console.log("Marker Coordinates:", trip.coordinates);
                  return (
                    trip.coordinates && (
                      <RedMarker
                        key={trip._id}
                        regionName={trip.region}
                        latitude={trip.coordinates.lat}
                        longitude={trip.coordinates.lng}
                      />
                    )
                  );
                })}
              </GoogleMapReact>
            </div>
          </div>
        </div>
        <div className="row px-4 mx-1 pt-5">
          <div className="col-12">
            <input
              type="text"
              placeholder="Enter Notes For Your Self"
              className={`position-relative ${styles.notestext}`}
            />
          </div>
        </div>
        <div className="row pt-5">
          <div className="col-lg-4  text-center"></div>
          <div className="col-lg-4 col-md-6 text-center">
            <button className="savebtn">Save</button>
          </div>
          <div className="col-lg-4 col-md-6  text-center">
            <h2>Total: &nbsp; &nbsp;$340.00</h2>
          </div>
        </div>
      </div>
    </>
  );
}
export default UpcomingtripsList;

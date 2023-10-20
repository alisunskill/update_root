import React, { useState, useEffect } from "react";
import { fetchSingleTrip } from "../../store/actions/singleTripAction";
import newsletterimg from "../../public/images/card-two.svg";
import {
  updateTripAction,
  removeTripAction,
} from "../../store/actions/updateTripAction";

import styles from "../../styles/viewsave.module.css";
import NewsLetter from "../components/NewsLetter";
// import Trip from "./components/Trip";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@mui/material";
import { Masonry } from "@mui/lab";
import axios from "axios";
import Link from "next/link";
import {
  fetchGetTrips,
  fetchSavedTrips,
} from "../../store/actions/tripsAction";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ItiniraryDetail() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [tripIds, setTripIds] = useState(new Set());
  const [singleTrips, setSingleTrips] = useState(null);
  const saveTripsData = useSelector((state) => state.tripIdSave.savetrips);
  const tripIdData = useSelector((state) => state?.tripIdSave.savedTripsId);
  const savedTripIds = tripIdData?.tripsPosts?.map((trip) => trip.tripId) || [];
  const savedTripsData = useSelector((state) => state.tripIdSave.savetrips);
  const singleTrip = useSelector((state) => state.singleTrip.singleTrip);
  const [editModalShow, setEditModalShow] = useState(false);

  const { id: singletripId } = router.query;

  useEffect(() => {
    if (singletripId) {
      dispatch(fetchSingleTrip(singletripId));
    }
  }, [dispatch, singletripId]);

  useEffect(() => {
    if (singleTrip) {
      setSingleTrips([singleTrip]);
    }
  }, [singleTrip]);

  useEffect(() => {
    dispatch(fetchGetTrips());
    dispatch(fetchSavedTrips());
  }, [dispatch]);

  useEffect(() => {
    fetchTripsIds();
  }, []);

  const fetchTripsIds = async () => {
    // Use the correct data to set the tripIds
    setTripIds(new Set(savedTripIds));
  };

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(saveTripsData);
  }, [saveTripsData]);

  const [updateTrip, setUpdateTrip] = useState({
    id: null,
    image: "",
    title: "",
    region: "",
    sdate: "",
    edate: "",
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setTrips(saveTripsData);
  };

  const handleRemoveTrips = async (tripId) => {
    try {
      await dispatch(removeTripAction(tripId));
      console.log("Trip removed successfully!");
      fetchTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const updateTripEditHandle = (trip) => {
    setUpdateTrip({
      id: trip._id,
      image: trip.image,
      title: trip.title,
      region: trip.region,
      sdate: trip.sdate,
      edate: trip.edate,
    });
    setEditModalShow(true);
  };

  const handleUpdateSubmit = async (editedTrip) => {
    try {
      await dispatch(updateTripAction(editedTrip));
      console.log("Trip updated successfully!");
      setUpdateTrip({
        id: null,
        image: "",
        title: "",
        region: "",
        sdate: "",
        edate: "",
      });
      fetchTrips();
      setEditModalShow(false);
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-4">
          <h1 className="dark bold fw-700 pt-4 text-center mb-4">
            Your Created Trips
          </h1>

          <div className="col-lg-12">
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={trips.length}
              loader={<h4>Loading...</h4>}
            >
              <Box>
                <Masonry columns={3} spacing={2}>
                  {trips.map((trip, index) => (
                    <div>
                      <div className="position-relative" key={trip._id}>
                        <button
                          className="bg-danger border-0 rounded-2 position-absolute z-3 px-3 fw-700"
                          style={{ right: "0px" }}
                          onClick={() => handleRemoveTrips(trip._id)}
                        >
                          x
                        </button>
                      </div>
                      <Link key={index} href={`/trip/${trip._id}`}>
                        <img
                          src={trip.image}
                          alt="tripImg"
                          className={styles.placeImg}
                          loading="lazy"
                          style={{
                            display: "block",
                            width: "100%",
                            borderRadius: "15px",
                            opacity: "0.99990000999",
                          }}
                        />
                      </Link>

                      <div className="d-flex justify-content-between mt-2">
                        <h5 className="w-700 mb-0 fw-600 mb-2 text-dark">
                          Title: {trip.title}
                        </h5>
                        <button
                          className="savebtn text-light border-0 rounded-2 px-2"
                          onClick={() => updateTripEditHandle(trip)}
                        >
                          Edit Trip
                        </button>
                      </div>
                      <h5 className="w-700 fw-600 mb-0 text-dark">
                        region: {trip.region}
                      </h5>
                      <div className="d-flex justify-content-between mt-2">
                        <h5 className="w-700 fw-600 mb-0 text-dark">
                          Start Date: {trip.sdate}
                        </h5>
                        <h5 className="w-700 fw-600 mb-0 text-dark">
                          End Date: {trip.edate}
                        </h5>
                      </div>

                      {/* {updateTrip.id === trip._id && (
                          <div>
                            <input
                              type="text"
                              value={updateTrip.title || ""}
                              onChange={(e) =>
                                setUpdateTrip({
                                  ...updateTrip,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Title"
                            />
                            <input
                              type="text"
                              value={updateTrip.region || ""}
                              onChange={(e) =>
                                setUpdateTrip({
                                  ...updateTrip,
                                  region: e.target.value,
                                })
                              }
                              placeholder="region"
                            />
                            <input
                              type="text"
                              value={updateTrip.sdate || ""}
                              onChange={(e) =>
                                setUpdateTrip({
                                  ...updateTrip,
                                  sdate: e.target.value,
                                })
                              }
                              placeholder="Start Date"
                            />
                            <input
                              type="text"
                              value={updateTrip.edate || ""}
                              onChange={(e) =>
                                setUpdateTrip({
                                  ...updateTrip,
                                  edate: e.target.value,
                                })
                              }
                              placeholder="End Date"
                            />
                            <button
                              // onClick={handleUpdateSubmit}
                              onClick={() => handleUpdateSubmit(trip)}
                              className="bg-success rounded-2 border-0"
                            >
                              Update
                            </button>
                          </div>
                        )} */}
                      {updateTrip.id && (
                        <EditTripModal
                          show={editModalShow}
                          onHide={() => setEditModalShow(false)}
                          updateTrip={updateTrip}
                          handleUpdateSubmit={handleUpdateSubmit}
                        />
                      )}
                    </div>
                  ))}
                </Masonry>
              </Box>
            </InfiniteScroll>
          </div>

          <div className="col-lg-12">
            <h1 className="dark bold fw-700 pt-4 text-center mb-4">
              Your Save Trips
            </h1>
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={trips.length}
              loader={<h4>Loading...</h4>}
            >
              <Box>
                <Masonry columns={3} spacing={2}>
                  {trips
                    .filter((trip) => savedTripIds.includes(trip._id))
                    .map((trip, index) => (
                      <div>
                        <div className="position-relative" key={trip._id}>
                          <button
                            className="bg-danger border-0 rounded-2 position-absolute z-3 px-3 fw-700"
                            style={{ right: "0px" }}
                            onClick={() => handleRemoveTrips(trip._id)}
                          >
                            x
                          </button>
                        </div>
                        <Link key={index} href={`/trip/${trip._id}`}>
                          <img
                            src={trip.image}
                            alt="tripImg"
                            className={styles.placeImg}
                            loading="lazy"
                            style={{
                              display: "block",
                              width: "100%",
                              borderRadius: "15px",
                              opacity: "0.99990000999",
                            }}
                          />
                        </Link>

                        <div className="d-flex justify-content-between mt-2">
                          <h5 className="w-700 mb-2 fw-600 text-dark">
                            Title: {trip.title}
                          </h5>
                          <button
                            className="text-light border-0 savebtn rounded-2 px-2 "
                            onClick={() => updateTripEditHandle(trip)}
                          >
                            Edit Trip
                          </button>
                        </div>
                        <h5 className="w-700 mb-2 fw-600 text-dark">
                          region: {trip.region}
                        </h5>
                        <div className="d-flex justify-content-between mt-2">
                          <h5 className="w-700 fw-600 mb-0 text-dark">
                            Start Date: {trip.sdate}
                          </h5>
                          <h5 className="w-700 mb-0 fw-600 text-dark">
                            End Date: {trip.edate}
                          </h5>
                        </div>

                        {updateTrip.id && (
                          <EditTripModal
                            show={editModalShow}
                            onHide={() => setEditModalShow(false)}
                            updateTrip={updateTrip}
                            handleUpdateSubmit={handleUpdateSubmit}
                          />
                        )}
                      </div>
                    ))}
                </Masonry>
              </Box>
            </InfiniteScroll>
          </div>

          {/* <div className="col-lg-4 first-card position-relative">
                <div
                  className={` d-flex flex-column justify-content-center align-items-center text-center  ${styles.yoursave_image1}`}
                >
                  <div className="col-lg-12 yoursave_text">
                    <FontAwesomeIcon
                      onClick={() => setModalShow(true)}
                      className={styles.plusicon}
                      icon={faPlus}
                    />
                    <div className="text-center w-100  d-flex justify-content-center align-items-center">
                      <Trip
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        setModalShow={setModalShow}
                      />
                    </div>{" "}
                    <p className="letterspac">ITINERARY</p>
                    <h3 className="landingeventheading"> Saved Activity 1 </h3>
                    <p className="mb-0 fw-500">Paris, France</p>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-lg-12 col-md-12 pt-0 mt-0">
                    <div
                      className={`row  d-flex justify-content-center align-items-center ${styles.landingendcard1}`}
                      style={{ background: "white" }}
                    >
                      <Trip
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        setModalShow={setModalShow}
                      />
                      {eventData1.map((item, index) => {
                        return (
                          <PlaceFullSubCard
                            key={index}
                            imageUrl={item.bgImg}
                            showIcon={showIcon}
                            itinerary={item.itinerary}
                            title={item.title}
                            place={item.place}
                            time={item.time}
                            setModalShow={setModalShow}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="row">
                  <div className="col-lg-12 col-md-12 pt-0 mt-0">
                    <div
                      className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                      style={{ background: "white" }}
                    >
                      <Trip show={modalShow} onHide={() => setModalShow(false)} />
                      {eventData.map((item, index) => {
                        return (
                          <PlaceFullSubCard
                            key={index}
                            imageUrl={item.bgImg}
                            showIcon={showIcon}
                            itinerary={item.itinerary}
                            title={item.title}
                            place={item.place}
                            time={item.time}
                            setModalShow={setModalShow}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 first-card">
                    <div className={styles.yoursave_image1}>
                      <div
                        className={`col-lg-12 position-relative d-flex flex-column justify-content-center align-items-center text-center  ${styles.yoursave_text}`}
                      >
                        <FontAwesomeIcon
                          onClick={() => setModalShow(true)}
                          className={styles.plusicon2}
                          icon={faPlus}
                        />
                        <Trip show={modalShow} onHide={() => setModalShow(false)} />
                        <p className="fw-500 ltr-shrt-spec">ITINERARY</p>
                        <h3 className="landingeventheading"> Saved Activity 1 </h3>
                        <p className="mb-0 fw-500">Paris, France</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div
                      className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                      style={{ background: "white" }}
                    >
                      {eventData2.map((item, index) => {
                        return (
                          <PlaceFullSubCard
                            key={index}
                            imageUrl={item.bgImg}
                            showIcon={showIcon}
                            itinerary={item.itinerary}
                            title={item.title}
                            place={item.place}
                            time={item.time}
                            setModalShow={setModalShow}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div> */}
        </div>
      </div>

      <div>
        <NewsLetter
          newsletterimg={newsletterimg}
          heading={"Subscribe to our Newsletter"}
          title={"Get Special Offers and more from Traveller"}
          para={
            "Subscribe to see secret deals prices drop the moment you sign up!"
          }
        />
      </div>
      <br />
    </>
  );
}

export default ItiniraryDetail;

function EditTripModal({ show, onHide, updateTrip, handleUpdateSubmit }) {
  const [editedTrip, setEditedTrip] = useState(updateTrip);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTrip({ ...editedTrip, [name]: value });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Trip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <input
            type="text"
            name="title"
            value={editedTrip.title || ""}
            onChange={handleInputChange}
            placeholder="Title"
          />
          <input
            type="text"
            name="region"
            value={editedTrip.region || ""}
            onChange={handleInputChange}
            placeholder="Region"
          />
          <input
            type="text"
            name="sdate"
            value={editedTrip.sdate || ""}
            onChange={handleInputChange}
            placeholder="Start Date"
          />
          <input
            type="text"
            name="edate"
            value={editedTrip.edate || ""}
            onChange={handleInputChange}
            placeholder="End Date"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="success"
          onClick={() => {
            handleUpdateSubmit(editedTrip);
            onHide();
          }}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

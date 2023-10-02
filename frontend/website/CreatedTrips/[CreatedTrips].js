import React, { useState, useEffect } from "react";
import { fetchSingleTrip } from "../../store/actions/singleTripAction";
import {
  updateTripAction,
  removeTripAction,
} from "../../store/actions/updateTripAction";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/viewsave.module.css";
// import InfiniteScroll from "react-infinite-scroll-component";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@mui/material";
import { Masonry } from "@mui/lab";
import { API_URL } from "../../apiConfig";
import Image from "next/image";
import listicon from "../../public/images/list.png";
import listbl from "../../public/images/listbl.png";
import gridgray from "../../public/images/gridgray.png";
import gridicon from "../../public/images/grid.png";
import Link from "next/link";
import axios from "axios";
import {
  fetchGetTrips,
  fetchSavedTrips,
} from "../../store/actions/tripsAction";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CreatedTrips() {
  const router = useRouter();
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;

  const recData = recommendations.Recommendations;
  const [tripIds, setTripIds] = useState(new Set());
  const [singleTrips, setSingleTrips] = useState(null);
  const saveTripsData = useSelector((state) => state.tripIdSave.savetrips);
  const tripIdData = useSelector((state) => state?.tripIdSave.savedTripsId);
  const savedTripIds = tripIdData?.tripsPosts?.map((trip) => trip.tripId) || [];
  const savedTripsData = useSelector((state) => state.tripIdSave.savetrips);
  const singleTrip = useSelector((state) => state.singleTrip.singleTrip);
  const [editModalShow, setEditModalShow] = useState(false);
  const [postid, setPostId] = useState("");
  const [note, setNote] = useState("");
  const [listTrip, setListTrip] = useState(1);

  const handleListView = () => {
    setListTrip(2);
  };
  const handleListViewGrid = () => {
    setListTrip(1);
  };
  useEffect(() => {
    const selectedIdsFromLocalStorage = localStorage.getItem("filterPostId");
    if (selectedIdsFromLocalStorage) {
      setPostId(selectedIdsFromLocalStorage);
    }
  }, []);

  // const filteredData = recData?.find((item) => item._id === postid);

  // console.log(filteredData, "image");

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
  const [tripsList, setTripsList] = useState([]);

  // trips
  const fetchTripsList = async () => {
    try {
      // const response = await axios.get("http://localhost:8000/api/trips");
      const response = await axios.get(`${API_URL}/api/trips`);
      setTripsList(response.data);
      // setFullList(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };
  const handleRemoveTrips = async (tripId) => {
    try {
      // const response = await axios.delete(
      //   `http://localhost:8000/api/trips/${tripId}`
      // );
      const response = await axios.delete(`${API_URL}/api/trips/${tripId}`);
      console.log(response.data);
      fetchTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const { id: id } = router.query;
  const matchingTrip = trips.find((trip) => trip?._id === id);

  // note message
  const saveHandle = async () => {
    // try {
    //   const response = await axios.post("http://localhost:8000/api/trips", {
    //     note,
    //   });
    try {
      const response = await axios.post(`${API_URL}/api/trips`, {
        note,
      });
      console.log("Note saved successfully:", response.data);
      setNote("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };
  // edit trip
  const handleEditTrip = (trip) => {
    setUpdateTrip({
      id: trip?._id,
      title: trip?.title,
      region: trip?.region,
      sdate: trip?.sdate,
      edate: trip?.edate,
    });
    setEditModalShow(true);
  };

  const handleLinkClick = (itemId, postTitle) => {
    router.push(
      `/eventdetail/${encodeURIComponent(
        postTitle.replace(/ /g, "-")
      )}?id=${itemId}`
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-4">
          <div className="col-12 mb-3">
            <div className="row align-items-center px-4">
              <div className="col-lg-4 d-flex justify-content-start">
                <div className="">
                  {listTrip === 1 ? (
                    <Image
                      width={30}
                      height={25}
                      src={listicon}
                      alt="list"
                      className="cursor-pointer"
                      onClick={handleListView}
                    />
                  ) : (
                    <Image
                      width={30}
                      height={25}
                      src={listbl}
                      alt="list"
                      className="cursor-pointer"
                      onClick={handleListView}
                    />
                  )}

                  {listTrip === 2 ? (
                    <Image
                      className="mx-3 cursor-pointer"
                      width={30}
                      height={25}
                      src={gridgray}
                      alt="list"
                      onClick={handleListViewGrid}
                    />
                  ) : (
                    <Image
                      className="mx-3 cursor-pointer"
                      width={30}
                      height={25}
                      src={gridicon}
                      alt="list"
                      onClick={handleListViewGrid}
                    />
                  )}
                </div>
                <button
                  onClick={() => handleEditTrip(matchingTrip)}
                  className="rounded-5 bg-gray border-0 px-3 py-1 fw-600 mx-5"
                >
                  Edit Trip
                </button>
              </div>
              <div className="col-lg-4">
                <h1 className="dark bold fw-700 pt-4 text-center mb-4">
                  {matchingTrip ? (
                    matchingTrip?.title
                  ) : (
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </h1>
              </div>
              <div className="col-lg-4 d-flex justify-content-end">
                {matchingTrip ? (
                  <div>
                    {matchingTrip?.sdate.slice(0, 7)} &nbsp;{" "}
                    <span className="fw-600">to</span> &nbsp;
                    {matchingTrip?.edate.slice(0, 7)}
                  </div>
                ) : (
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            {listTrip === 1 ? (
              <InfiniteScroll
                className="w-100 overflow-hidden"
                dataLength={trips.length}
                loader={<h4>Loading...</h4>}
              >
                <Box sx={{ minHeight: 829 }}>
                  <Masonry columns={3} spacing={2}>
                    {trips.length > 0 ? (
                      <>
                        {recData?.map((trip, index) => {
                          return (
                            <div key={trip?._id}>
                              <div
                                className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                                onClick={() =>
                                  handleLinkClick(trip?._id, trip.title)
                                }
                              >
                                <img
                                  className={styles.uploadimg}
                                  src={trip.images[0]}
                                  alt="Uploaded Image"
                                />

                                <div
                                  style={{ position: "absolute ", zIndex: 999 }}
                                >
                                  <div className="text-center">
                                    <p className={`mb-0 letterspac text-white`}>
                                      Event
                                    </p>
                                    <h3 className="w-700 text-white">
                                      {trip.title}
                                    </h3>
                                    <p className={`mb-0 m1 text-white`}>
                                      {/* {trip.region} */}
                                      Paris, France
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </Masonry>
                </Box>
              </InfiniteScroll>
            ) : (
              <div>
                <div className="row">
                  <div className={`col-lg-7 col-md-6 col-12`}>
                    <div className={styles.tripsscrolled}>
                      {trips?.map((item) => {
                        return (
                          <div
                            key={item._id}
                            // onChange={() => handleFavoriteTrips(item._id)}
                            // onClick={() =>
                            //   handleFavoriteTrips(item._id, item.title)
                            // }
                            className={`form-check d-flex align-items-center justify-content-between w-100  gap-3 ${styles.herosaves1}`}
                          >
                            {/* <input
                            className={`form-check-input ${styles.radiobtn}`}
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios1"
                            value="option1"
                          /> */}
                            <div className="">
                              <label
                                className={`form-check-label f-16 fw-600 h4 text-light ${styles.titleheader}`}
                                for="exampleRadios1"
                              >
                                {item.title}
                              </label>
                              {/* <label>{item.sdate.slice(0, 7)}</label> */}
                              <label className="mx-3 text-light">
                                {item && item.sdate
                                  ? item.sdate.slice(0, 7)
                                  : item
                                  ? item.sdate
                                  : "No item available"}
                              </label>
                            </div>
                            <button
                              onClick={() => handleRemoveTrips(item._id)}
                              className="bg-transparent border-0 text-light"
                              style={{ fontSize: "25px" }}
                            >
                              x
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 pb-lg-5">
                      {trips.length > 0 ? (
                        <>
                          {recData?.map((trip, index) => {
                            return (
                              <div
                                key={trip?._id}
                                className={styles.trillistpost}
                              >
                                <div
                                  className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                                  onClick={() =>
                                    handleLinkClick(trip?._id, trip.title)
                                  }
                                >
                                  <img
                                    className={styles.uploadimg}
                                    src={trip.images[0]}
                                    alt="Uploaded Image"
                                  />

                                  <div
                                    style={{
                                      position: "absolute ",
                                      zIndex: 999,
                                    }}
                                  >
                                    <div className="text-center">
                                      <p
                                        className={`mb-0 letterspac text-white`}
                                      >
                                        Event
                                      </p>
                                      <h3 className="w-700 text-white">
                                        {trip.title}
                                      </h3>
                                      <p className={`mb-0 m1 text-white`}>
                                        {/* {trip.region} */}
                                        Paris, France
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-1 col-12">
                    <div className="row">
                      <div
                        className={`col-12 col-md-12 col-lg-12 text-center ${styles.eventmidicons}`}
                      ></div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-12">
                    <div style={{ height: "100vh", width: "100%" }}>
                      <div className="responsive-map">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.7806761080233!2d-93.29138368446431!3d44.96844997909819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b32b6ee2c87c91%3A0xc20dff2748d2bd92!2sWalker+Art+Center!5e0!3m2!1sen!2sus!4v1514524647889"
                          width="600"
                          height="450"
                          frameborder="0"
                          style={{ border: "0" }}
                          allowfullscreen
                        ></iframe>
                      </div>

                      <div className="form-group col-lg-12 col-12 text-center pt-2 pt-lg-2">
                        {listTrip === 2 ? (
                          <div className="my-4">
                            <Form>
                              <Form.Group
                                className="mb-3"
                                controlId="exampleForm.ControlTextarea1"
                              >
                                <Form.Control
                                  as="textarea"
                                  rows={5}
                                  placeholder=" Enter Notes for Yourself..."
                                  value={note}
                                  onChange={(e) => setNote(e.target.value)}
                                />
                              </Form.Group>
                            </Form>
                            <div className="d-flex justify-content-end">
                              <button
                                className="savebtn1 text-light"
                                onClick={saveHandle}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {listTrip === 1 ? (
            <div className="my-4">
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder=" Enter Notes for Yourself..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <button className="savebtn1 text-light" onClick={saveHandle}>
                Save
              </button>
            </div>
          ) : (
            <div></div>
          )}
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
    </>
  );
}

export default CreatedTrips;

function EditTripModal({ show, onHide, updateTrip, handleUpdateSubmit }) {
  const [editedTrip, setEditedTrip] = useState(updateTrip);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTrip({ ...editedTrip, [name]: value });
  };

  return (
    <Modal size="md" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-600 d-flex justify-content-center">
          Edit Trip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.edittrips}>
        <Form>
          <Form.Group controlId="title">
            <Form.Label className="pt-3 fw-600 px-1">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={editedTrip.title || ""}
              onChange={handleInputChange}
              placeholder="Title"
            />
          </Form.Group>

          <Form.Group controlId="region">
            <Form.Label className="pt-3 fw-600 px-1">Region</Form.Label>
            <Form.Control
              type="text"
              name="region"
              value={editedTrip.region || ""}
              onChange={handleInputChange}
              placeholder="Region"
            />
          </Form.Group>

          <Form.Group controlId="sdate">
            <Form.Label className="pt-3 fw-600 px-1">Start Date</Form.Label>
            <Form.Control
              type="text"
              name="sdate"
              value={editedTrip.sdate || ""}
              onChange={handleInputChange}
              placeholder="Start Date"
            />
          </Form.Group>

          <Form.Group controlId="edate">
            <Form.Label className="pt-3 fw-600 px-1">End Date</Form.Label>
            <Form.Control
              type="text"
              name="edate"
              value={editedTrip.edate || ""}
              onChange={handleInputChange}
              placeholder="End Date"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center pb-3">
        <Button
          className="savebtn1 px-4 w-100 rounded-4 "
          onClick={() => {
            handleUpdateSubmit(editedTrip);
            onHide();
          }}
        >
          Finish
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

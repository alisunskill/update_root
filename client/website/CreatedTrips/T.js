import React, { useState, useEffect } from "react";
import { fetchSingleTrip } from "../../store/actions/singleTripAction"; ///
import {
  updateTripAction,

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
import { Files_URL } from "../../apiConfig";
import Swal from "sweetalert2";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import AddIcon from '@mui/icons-material/Add';


function CreatedTrips() {
  const router = useRouter();
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;



  const recData = recommendations.Recommendations;
  const [tripId, setTripId] = useState(router.query?.id);
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
  const [numbeOfPostsInTrip, setnumbeOfPostsInTrip] = useState(false);
  const [detailofEventDateToAddEvent, setDetailofEventDateToAddEvent] = useState({});
  const [showModalToAddEvent, setShowModalToAddEvent] = useState(false);
  const [numColumns, setNumColumns] = useState(4);
  const updateNumColumns = () => {
    if (window.innerWidth >= 1500) {
      setNumColumns(5);
    } else if (window.innerWidth >= 1200) {
      setNumColumns(4);
    } else if (window.innerWidth >= 768) {
      setNumColumns(3);
    } else if (window.innerWidth >= 500) {
      setNumColumns(2);
    } else {
      setNumColumns(1);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateNumColumns);
    updateNumColumns();
    return () => {
      window.removeEventListener("resize", updateNumColumns);
    };
  }, []);

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
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchTrips = async () => {
      const uid = await localStorage.getItem("userID");
      setUserId(uid);
    };
    fetchTrips();

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

  const handleRemoveTrips = async (tripId) => {
    try {
      // const response = await axios.delete(
      //   `http://localhost:8000/api/trips/${tripId}`
      // );
      const response = await axios.delete(`${API_URL}api/trips/${tripId}`);
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
    try {
      const response = await axios.post(`${API_URL}api/trips`, {
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

  const handleLinkClick = (itemId, postTitle, trip) => {
    if (trip.isItenrary == true) {
      router.push({
        pathname: "/Itenraries",
        query: {
          id: JSON.stringify(trip._id),
        },
      });
    }
    else {
      router.push(
        `/eventdetail/${encodeURIComponent(
          postTitle.replace(/ /g, "-")
        )}?id=${itemId}`
      );
    }
  };

  useEffect(() => {
    const checkHasPosttoID = async () => {
      if(recData?.length>0){
      for (const post of recData) {
        if (matchingTrip?.posts.includes(post?._id)) {
          setnumbeOfPostsInTrip(true);
          break; // Exit the loop after the first match
        }
      }
    }
    }
    checkHasPosttoID();
  }, [tripId, recData, matchingTrip]);

  const userIDPerson1 =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;




  return (
    <>
      <div className="container-fluid">
        <div className="row px-lg-4 px-2">
          <div className="col-12 mb-3">
            <div className="row align-items-center px-lg-4 px-0  pt-lg-0 pt-4">
              <div className="col-lg-4 col-12 d-flex justify-content-lg-start justify-content-between">
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
                  className="rounded-5 bg-gray border-0 px-3 py-1 fw-600 mx-3 mx-lg-5"
                >
                  Edit Trip
                </button>
              </div>
              <div className="col-lg-4 col-sm-6 col-12 d-flex justify-content-start justify-content-lg-center">
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
              <div className="col-lg-4 col-sm-6 col-12 d-flex justify-content-start pb-lg-0 pb-3 justify-content-lg-center ">
                {matchingTrip ? (
                  <div>
                    {new Date(matchingTrip?.sdate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}{" "}
                    &nbsp; <span className="fw-600">to</span> &nbsp;
                    {new Date(matchingTrip?.edate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
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
                {!numbeOfPostsInTrip && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>

                    <p style={{
                      textAlign: 'center',
                    }}>
                      There's no post added to the trip yet.
                    </p>

                  </div>
                )}
                <Box sx={{ minHeight: numbeOfPostsInTrip ? 829 : 50 }}>
                  <Masonry columns={numColumns} spacing={1}>

                    {trips.length > 0 ? (
                      <>
                        {recData?.map((trip, index) => {

                          if (matchingTrip?.posts.includes(trip?._id)) {
                            return (
                              <div key={trip?._id}>
                                <div
                                  className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                                  onClick={() =>
                                    handleLinkClick(trip?._id, trip.title, trip)
                                  }
                                >
                                  <img
                                    className={styles.uploadimg}
                                    src={`${Files_URL}${trip?.images[0]}`}
                                    alt="Uploaded Image"
                                  />

                                  <div
                                    style={{ position: "absolute ", zIndex: 999 }}
                                  >
                                    <div className="text-center">

                                      <h3 className="w-700 text-white">
                                        {trip?.title}
                                      </h3>
                                      <p className={`mb-0 m1 text-white`}>
                                        {/* {trip.region} */}
                                        {trip?.location}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );

                          }
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
                      {matchingTrip?.plans.map((item, index) => (
                        <div key={index} className={`form-check d-flex align-items-center justify-content-between w-100 gap-3 ${styles.herosaves1}`}>
                          <div>
                            <label className={`form-check-label f-16 fw-600 h4 mb-0 text-light ${styles.titleheader}`} htmlFor="exampleRadios1">
                              {new Date(item.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </label>
                          </div>
                          <div style={{
                            cursor: 'pointer'
                          }}
                            onClick={() => {
                              setDetailofEventDateToAddEvent(item),
                                setShowModalToAddEvent(true)
                            }}
                          >
                            <AddIcon />
                          </div>
                          <AssignToDate
                            show={showModalToAddEvent}
                            onHide={() => setShowModalToAddEvent(false)}
                            item={detailofEventDateToAddEvent}
                            matchingTrip={matchingTrip}
                            recData={recData}
                            id={id}
                          />
                        </div>

                      ))}


                    </div>

                    <div className="pt-4 pb-lg-5">
                      {!numbeOfPostsInTrip && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <p style={{
                            textAlign: 'center',
                          }}>
                            There's no post added to the trip yet.
                          </p>

                        </div>
                      )}
                      {trips.length > 0 ? (
                        <>
                          {recData?.map((trip, index) => {
                            if (matchingTrip?.posts.includes(trip?._id)) {
                              return (
                                <div
                                  key={trip?._id}
                                  className={styles.trillistpost}
                                >
                                  <div
                                    className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                                    onClick={() =>
                                      handleLinkClick(trip?._id, trip.title, trip)
                                    }
                                  >
                                    <img
                                      className={styles.uploadimg}
                                      src={`${Files_URL}${trip.images[0]}`}
                                      alt="Uploaded Image"
                                    />

                                    <div
                                      style={{
                                        position: "absolute ",
                                        zIndex: 999,
                                      }}
                                    >
                                      <div className="text-center">

                                        <h3 className="w-700 text-white">
                                          {trip.title}
                                        </h3>
                                        <p className={`mb-0 m1 text-white`}>
                                          {/* {trip.region} */}
                                          {trip?.location}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              );
                            }
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
                  <div className="col-lg-1 col-md-1 col-12">
                    <div className="row">
                      <div
                        className={`col-12 col-md-12 col-lg-12 text-center ${styles.eventmidicons}`}
                      ></div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-5 col-12  mt-lg-0 mt-4">
                    <div style={{ width: "100%" }}>
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
                            <div className="d-flex justify-content-end pb-lg-0 pb-4">
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
  const [isTripDeleted, setIsTripDeleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isTripDeleted) {
      router.push("/upcomingtrips");
    }
  }, [isTripDeleted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTrip({ ...editedTrip, [name]: value });
  };

  return (
    <Modal style={{ marginTop: 30 }} size="md" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-600 d-flex  justify-content-center">
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

          }}
        >
          Finish
        </Button>
        <Button
          className="savebtn1 px-4 w-100 rounded-4 "
          onClick={async () => {
            Swal.fire({
              title: `Delete Trip`,
              text: `Are you sure you want to delete the trip "${editedTrip.title}"?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Delete",
              cancelButtonText: "Cancel",
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  const response = await axios.delete(`${API_URL}api/trips/${editedTrip.id}`);

                  if (response.status === 200) {
                    setIsTripDeleted(true)
                    onHide();


                  } else {
                    Swal.fire({
                      title: "Deleting Trip",
                      text: "Something went wrong in server while deleting the trip",
                      icon: "error",
                    });
                  }
                } catch (error) {
                  console.error("Error deleting trip:", error);
                }
              }
              if (result.isDenied) {
                onHide();
              }
            });

          }}
        >
          Delete Trip
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function AssignToDate({ show, onHide, item, recData, matchingTrip, id }) {
  const router = useRouter();

  console.log("Events coming",item.events);

  const [eventIds, setEventIds] = useState([]);

  useEffect(() => {
    if(item?.events?.length > 0){
      setEventIds(item.events)
    }
    else {
      setEventIds([])
    }

  }, [item]);

  const handleEventClick = (eventId) => {
    // Toggle the selection of the event
    if (eventIds?.includes(eventId)) {
      // If event is already selected, remove it from the list
      setEventIds(eventIds?.filter((id) => id !== eventId));
    } else {
      // If event is not selected, add it to the list
      setEventIds([...eventIds, eventId]);
    }
  };
  return (
    <Modal style={{ marginTop: 30 }} size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-600 d-flex  justify-content-center">
          Assign To {matchingTrip?.title} for {new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body >

        {recData?.map((trip, index) => {
          if (matchingTrip?.posts.includes(trip?._id)) {
            return (
              <div
                key={trip?._id}
                className={styles.trillistpost}
              >
                <div
                  className={`text-decoration-none d-flex  justify-content-center flex-column ${styles.savelink}`}
                  style={{
                    opacity:eventIds?.includes(trip._id)?0.5:1,
                  }}
                  onClick={() => handleEventClick(trip._id)}

                >
                  <img
                    className={styles.uploadimg}
                    src={`${Files_URL}${trip.images[0]}`}
                    alt="Uploaded Image"
                  />

                  <div
                    style={{
                      position: "absolute ",
                      zIndex: 999,
                    }}
                  >
                    <div className="text-center">

                      <h3 className="w-700 text-white">
                        {trip.title}
                      </h3>
                      <p className={`mb-0 m1 text-white`}>
                        {/* {trip.region} */}
                        {trip?.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            );
          }
        })}

        <Button
          className="savebtn1 mt-4 px-4 w-100 rounded-4 "
          onClick={async () => {
            if(eventIds.length==0){
              Swal.fire({
              title: "Adding Event/Itenrary to Trip Date",
                text: "Please select atleast one Event or Itenrary",
                icon: "warning",
              });
              return;
            }
            try {
              //tripId, planDate, eventIds
              const url = `${API_URL}api/trips/addEventToSpecificDateInPlans`;
              const response = await fetch(url, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  tripId: id,
                  planDate:item.date,
                  eventIds:eventIds
                }),
              });
      
              if (response.ok) {
                const data = await response.json();
                if (data.status) {
                  router.reload();
                } else {
                  // Handle error if needed
                }
              } else {
                // Handle HTTP error if needed
              }
            } catch (error) {
              // Handle fetch or other errors
              console.error(error);
            }
          }}
        >
          Add
        </Button>
      </Modal.Body>
    </Modal>
  );
}
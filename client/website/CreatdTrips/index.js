import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Trip from "./components/Trip";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../styles/viewsave.module.css";
import { API_URL } from "../../apiConfig";
import axios from "axios";
import Profile from "./components/Profile";
// import { setTripId } from "../../../store/actions/tripsAction";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default () => {
  const router = useRouter();

  // const { setModalShow } = props;
  const dispatch = useDispatch();
  const [modalTrip, setModalTrip] = useState(false);
  const [trips, setTrips] = useState([]);
  const [saveTrips, setSaveTrips] = useState([]);

  const [selectedItems, setSelectedItems] = useState({});
  const [favList, setFavList] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const userIDPerson1 =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;

  useEffect(() => {
    fetchTrips();
    fetchSavedTrips();
  }, []);
  const handleClick = () => {
    setModalTrip(true);
    // setModalShow(false)
    // setModalShow(false);
  };
  const fetchTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}api/trips`);
      setTrips(response.data);
      setFullList(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };
  const fetchSavedTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}api/savetrip`);
      setSaveTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleRemoveTrips = async (tripId) => {
    try {
      const response = await axios.delete(`${API_URL}api/savetrip/${tripId}`);

      if (response.status === 200) {
        console.log("Trip deleted successfully.");

        setTrips((prevTrips) =>
          prevTrips.filter((trip) => trip._id !== tripId)
        );
      } else {
        console.error("Failed to delete trip. Server returned an error.");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  // trips
  const handleFavoriteTrips = (id, postTitle) => {
    router.push(
      `/createdtrips/${encodeURIComponent(
        postTitle.replace(/ /g, "-")
      )}?id=${id}`
    );
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [id]: !prevSelectedItems[id],
    }));

    const isAlreadyFav = favList.some((favItem) => favItem._id === id);
    if (isAlreadyFav) {
      const updatedFavList = favList.filter((item) => item._id !== id);
      setFavList(updatedFavList);

      setSelectedTrips((prevSelectedTrips) =>
        prevSelectedTrips.filter((trip) => trip !== id)
      );

      alert("This post is removed from your favorites.");
      return;
    }

    const clickedItem = fullList.find((item) => item._id === id);
    if (clickedItem) {
      const updatedFavList = [...favList, clickedItem];
      setFavList(updatedFavList);
      setSelectedTrips((prevSelectedTrips) => [...prevSelectedTrips, id]);
    }
  };
  const handleSaveBtn = () => {
    sendFavListToBackend(selectedTrips);
    router.push("/createdtrips");
  };
  const sendFavListToBackend = async (selectedIds) => {
    const userIDPerson = localStorage.getItem("userID");

    try {
      const response = await axios.post(`${API_URL}api/savetrip`, {
        tripId: selectedIds,
        userID: userIDPerson,
      });
      localStorage.setItem("selectedIds", selectedIds);
      console.log("Updated backend with new favList:", response.data);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };
  useEffect(() => {
    if (trips && Array.isArray(trips)) {
      setFullList(trips);
    }
  }, [trips]);

  useEffect(() => {
    const selectedIds = favList.map((item) => item._id);
    sendFavListToBackend(selectedIds);
  }, [favList]);

  console.log(saveTrips.tripsPosts, "favList");

  const addPlan = async (trip) => {
    console.log("addPlan called with trip:", trip);
    router.push({
      pathname: "/tripPlans",
      query: {
        id: JSON.stringify(trip._id),
      },
    });
  };

  return (
    <div className={`row ${styles.tripsherobox}`}>
      <div className="col-lg-4 col-12">
        <Profile trips={trips} />
      </div>

      <div className="col-lg-8 col-12">
        <div className={styles.tripbox}>
          <div centered>
            <div className="border-0">
              <h3
                id="contained-modal-title-vcenter"
                className={`text-center text-dark fw-600 w-100 ${styles.thumbnail}`}
              >
                Saved Trips
              </h3>
            </div>
            <div className="px-lg-5 px-1 py-4">
              {trips.length === 0 || trips === undefined ? (
                <div className="d-flex justify-content-center">
                  <div class="spinner-border text-primary " role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="cursor-pointer">
                  {trips
                    .filter((item) => {
                      // Assuming saveTrips.tripsPosts is an array of trip objects
                      return saveTrips.tripsPosts.some(
                        (post) => post.tripId === item._id
                      );
                    })
                    .map((item) => {
                      // Check if item.userID exists
                      if (item.userID) {
                        const isFav = favList.some(
                          (favItem) => favItem._id === item.id
                        );
                        const tripsLength = trips.length;
                        localStorage.setItem("tripsLength", tripsLength);

                        return (
                          <div>
                            {item.userID === userIDPerson1 && (
                              <div
                                key={item._id}
                                className={`form-check d-flex align-items-center justify-content-between w-100  gap-3 ${styles.herosaves}`}
                              >
                                <label
                                  onClick={() =>
                                    handleFavoriteTrips(item._id, item.title)
                                  }
                                  className={`form-check-label cursor-pointer f-16 fw-600 h4 text-dark thirty mb-0 ${styles.titleheader}`}
                                  for="exampleRadios1"
                                >
                                  {item.title}
                                </label>
                                <label
                                  className={`thirty ${styles.datedatabox}`}
                                >
                                  {new Date(item?.sdate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "2-digit",
                                    }
                                  )}{" "}
                                  to{" "}
                                  {new Date(item?.edate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "2-digit",
                                    }
                                  )}
                                </label>
                                <button
                                  onClick={() => handleRemoveTrips(item._id)}
                                  className="bg-transparent border-0 text-dark px-3 py-2 rounded-5"
                                  style={{ fontSize: "25px" }}
                                ></button>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        // Render nothing if userID doesn't exist
                        return null;
                      }
                    })}
                </div>
              )}

              {/* <div
            className={`form-check d-flex align-center gap-3 mt3 ${styles.herosaves}`}
          >
            <input
              className={`form-check-input ${styles.radiobtn}`}
              type="radio"
              name="exampleRadios"
              id="exampleRadios1"
              value="option1"
            />
            <label
              className="form-check-label fw-500 h4 text-dark"
              for="exampleRadios1"
            >
              Trip to “AFRICA”
            </label>
          </div>

          <div
            className={`form-check d-flex align-center gap-3 mt3 ${styles.herosaves}`}
          >
            <input
              className={`form-check-input ${styles.radiobtn}`}
              type="radio"
              name="exampleRadios"
              id="exampleRadios1"
              value="option1"
            />
            <label
              className="form-check-label fw-500 h4 text-dark"
              for="exampleRadios1"
            >
              Trip to “EUROPE”
            </label>
          </div> */}

              {/* <div className="d-flex justify-content-center">
                <button
                  className={`fw-500 savebtn mt-3 mt-lg-4`}
                  onClick={handleSaveBtn}
                >
                  Save Trips
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* <Trip /> */}
      </div>
    </div>
  );
};

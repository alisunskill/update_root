import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Trip from "./components/Trip";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../styles/viewsave.module.css";
import NewTrip from "./components/NewTrip";
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
  const [selectedItems, setSelectedItems] = useState({});
  const [favList, setFavList] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);

  useEffect(() => {
    fetchTrips();
  }, []);
  const handleClick = () => {
    setModalTrip(true);
    // setModalShow(false)
    // setModalShow(false);
  };
  const fetchTrips = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/trips");
      setTrips(response.data);
      setFullList(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleRemoveTrips = async (tripId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/trips/${tripId}`
      );
      console.log(response.data);
      fetchTrips();
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
      // sendFavListToBackend(updatedFavList.map((item) => item._id));
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
    const userIDPerson = localStorage.getItem("userID"); // Use "userID" key

    try {
      const response = await axios.post("http://localhost:8000/api/savetrip", {
        tripId: selectedIds,
        userID: userIDPerson,
      });
      // dispatch(setTripId(selectedIds));
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

  console.log(favList, "favList");

  return (
    <div className={`row ${styles.tripsherobox}`}>
      <div className="col-lg-4">
        <Profile trips={trips} />
      </div>

      {/* <div className="col-lg-6 h-full">
        <div className="w-100">
          <Dropdown className="w-100">
            <Dropdown.Toggle
              className="w-100 d-flex justify-content-between  align-center px-3 py-3"
              style={{
                background: "#F5F5F5",
                color: "#000",
                border: "none",
                borderRadius: "12px",
              }}
              id="dropdown-basic"
            >
              Asia
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="w-100 pt-4">
          <Dropdown className="w-100">
            <Dropdown.Toggle
              className="w-100 d-flex justify-content-between  align-center px-3 py-3"
              style={{
                background: "#F5F5F5",
                color: "#000",
                border: "none",
                borderRadius: "12px",
              }}
              id="dropdown-basic"
            >
              Asia
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="w-100 pt-4">
          <Dropdown className="w-100">
            <Dropdown.Toggle
              className="w-100 d-flex justify-content-between  align-center px-3 py-3"
              style={{
                background: "#F5F5F5",
                color: "#000",
                border: "none",
                borderRadius: "12px",
              }}
              id="dropdown-basic"
            >
              Asia
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div> */}
      <div className="col-lg-8">
        <div className={styles.tripbox}>
          <div centered>
            <div style={{ padding: "20px 40px", border: "none" }}>
              <h3
                id="contained-modal-title-vcenter"
                className={`text-center text-dark fw-600 w-100 ${styles.thumbnail}`}
              >
                Upcoming Trips
              </h3>
            </div>
            <div style={{ padding: "20px 40px 40px 40px" }} >
              {trips.length === 0 || trips === undefined ? (
                <div className="d-flex justify-content-center">
                  <div class="spinner-border text-primary " role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="cursor-pointer">
                  {trips?.map((item) => {
                    const isFav = favList.some(
                      (favItem) => favItem._id === item.id
                    );
                    const tripsLength = trips.length;
                    localStorage.setItem("tripsLength", tripsLength);
                    {
                      console.log(trips, "items");
                    }

                    return (
                      <div
                        key={item._id}
                        // onChange={() => handleFavoriteTrips(item._id)}
                        onClick={() =>
                          handleFavoriteTrips(item._id, item.title)
                        }
                        className={`form-check d-flex align-items-center justify-content-between w-100  gap-3 ${styles.herosaves}`}
                      >
                        {/* <input
                            className={`form-check-input ${styles.radiobtn}`}
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios1"
                            value="option1"
                          /> */}
                        <label
                          className={`form-check-label f-16 fw-600 h4 text-dark thirty mb-0 ${styles.titleheader}`}
                          for="exampleRadios1"
                        >
                          {item.title}
                        </label>
                        {/* <label>{item.sdate.slice(0, 7)}</label> */}
                        <label className="thirty">
                          {item && item.sdate
                            ? item.sdate.slice(0, 7)
                            : item
                            ? item.sdate
                            : "No item available"}
                        </label>
                        <button
                        onClick={() => handleRemoveTrips(item._id)}
                        className="bg-transparent border-0 text-dark px-3 py-2 rounded-5"
                        style={{ fontSize: "25px" }}
                      >
                        x
                      </button>
                      </div>
                    );
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

          {/* New Trip */}
          <div className="text-center w-100  d-flex justify-content-center align-items-center">
            <NewTrip
              // selectedImage={props.selectedImage}
              show={modalTrip}
              onHide={() => setModalTrip(false)}
            />
          </div>
        </div>
        <div className="mx-5 mt-3">
          <button
            className={`fw-500 rounded-5 ${styles.herobtn1}`}
            onClick={handleClick}
          >
            + New Trip
          </button>
        </div>
        {/* <Trip /> */}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../../styles/viewsave.module.css";
import { API_URL } from "../../../apiConfig";
import NewTrip from "./NewTrip";
import axios from "axios";
// import { setTripId } from "../../../store/actions/tripsAction";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function Trip(props) {
  const router = useRouter();
  const { setModalShow } = props;
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
    setModalShow(false);
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

  // trips
  const handleFavoriteTrips = (id) => {
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
  // const handleSaveBtn = () => {
  //   sendFavListToBackend(selectedTrips);
  //   router.push("/createdtrips");
  // };
  const sendFavListToBackend = async (selectedIds) => {
    const userIDPerson = localStorage.getItem("userID"); // Use "userID" key

    try {
      // const response = await axios.post("http://localhost:8000/api/savetrip", {
      //   tripId: selectedIds,
      //   userID: userIDPerson,
      // });
      const response = await axios.post(`${API_URL}api/savetrip`, {
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
    <div className="">
      <div
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div style={{ padding: "20px 40px", border: "none" }}>
          <h3
            id="contained-modal-title-vcenter"
            className={`text-center w-100 ${styles.thumbnail}`}
          >
            Upcoming Trips
          </h3>
        </div>
        <div style={{ padding: "20px 40px 40px 40px" }}>
          {trips.length === 0 || trips === undefined ? (
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            <div>
              {trips.map((item) => {
                const isFav = favList.some(
                  (favItem) => favItem._id === item.id
                );
                const tripsLength = trips.length;
                localStorage.setItem("tripsLength", tripsLength);

                return (
                  <div
                    key={item._id}
                    // onClick={() => handleFavoriteTrips(item._id)}
                    onChange={() => handleFavoriteTrips(item._id)}
                    className={`form-check d-flex align-items-center justify-content-between  gap-3 ${styles.herosaves}`}
                  >
                    <div>
                      <input
                        className={`form-check-input ${styles.radiobtn}`}
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        value="option1"
                      />
                      <p>{item.userID}</p>
                      <label
                        className={`form-check-label fw-500 h4 text-dark ${styles.titleheader}`}
                        for="exampleRadios1"
                      >
                        {item.title}
                      </label>
                    </div>
                    <div></div>
                  </div>
                );
              })}
            </div>
          )}

          <button className={`fw-500 ${styles.herobtn1}`} onClick={handleClick}>
            + Create New
          </button>
        </div>
      </div>
      {/* New Trip */}
      <div className="text-center w-100  d-flex justify-content-center align-items-center">
        <NewTrip
          selectedImage={props.selectedImage}
          show={modalTrip}
          onHide={() => setModalTrip(false)}
        />
      </div>
    </div>
  );
}

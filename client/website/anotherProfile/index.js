import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Trip from "./components/Trip";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../styles/viewsave.module.css";
import FilterPosts from "../../pages/HomePage/component/FilterPosts";
import { API_URL } from "../../apiConfig";
import axios from "axios";
import Profile from "./components/Profile";
import UserRecommendations from "./components/UserRecommendations";
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

  const { id } = router.query;//userID
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const getUserInfo = async (userID) => {
      try {
        const url = `${API_URL}api/users/userInfo`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON?.stringify({
            userID: JSON?.parse(id),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setUserInfo(data.data);

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
    
  };
   
     
      getUserInfo()
   
  }, [id]);


  return (
    <div className={`row ${styles.tripsherobox}`}>
       <div className="col-12">
            <div className="row align-items-center justify-content-start flex-wrap  pt-lg-0 pt-3">
              <div
                className={`col-lg-4 col-md-4 col-6 d-flex justify-content-start mb-lg-0 mb-3 px-lg-2 px-1 ${styles.filterbox}`}
              >
                <FilterPosts />
              </div>
              <div className="col-lg-4 col-md-4 col-6 pb-lg-3 pb-0">
                <h1 className="dark bold fw-700 pt-lg-0 text-center  mb-lg-3 mb-3 experience-saves-header">
                {userInfo?.firstName}`s Experiences
                </h1>
              </div>
             
            </div>
          </div>
      <div className="col-lg-4 col-12">
        <Profile trips={trips} />
      </div>

      <div className="col-lg-8 col-12">
        <UserRecommendations/>
      </div>
    </div>
  );
};
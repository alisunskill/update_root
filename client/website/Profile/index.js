import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileicon from "../../public/images/men.svg";
import { fetchRecommendations } from "../../store/actions/recommendationActions";
import { fetchUserData } from "../../store/actions/userAction";
import styles from "../../styles/profile.module.css";
import { API_URL ,Files_URL} from "../../apiConfig";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1663583784667-4a2a386fec62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1622397815608-359540676c67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1550850839-8dc894ed385a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=875&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1587162146766-e06b1189b907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=956&q=80",
  },
];

function Profile() {
  // const userIds = localStorage.getItem("userID");
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  // fetch recommendation
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userId);

  // login Data id, email
  // const { userID, email } = useSelector((state) => state.recommendation);
  // console.log(userID, email, "userData");

  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  const [user, setUser] = useState(null);
  const recData = recommendations.Recommendations;
  const [isEditing, setIsEditing] = useState(false);
  const [userTotalExperience, setUserTotalExperience] = useState(0);

  const [totalCountries, setTotalCountries] = useState(0);
  const [totalCities, setTotalCities] = useState(0);
  const [profileData, setProfileData] = useState({
    username: "",
    region: "",
    email: "",
    password: "",
  });

  const { username, region, email, password } = profileData;

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    const userIds = localStorage.getItem("userID");

    if (userIds) {
      dispatch(fetchUserData(userIds));
      setUser(userData);
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchTotalExp = async () => {
      const userIDPerson = localStorage.getItem("userID"); // Use "userID" key
      if (userIDPerson) {
        try {
          const url = `${API_URL}api/recommendations/UserTotalRecommendations`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userID: userIDPerson,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.status) {
              setUserTotalExperience(data.totalRecommendations);
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
      }
    };
    fetchTotalExp();
  }, []);

  useEffect(() => {
    const getUserInfo = async (userID) => {
      const uid = await localStorage.getItem("userID");
      try {
        const url = `${API_URL}api/users/userInfo`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: uid,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setUser(data.data);
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
    const fetchTotalCountryCitiesVisited = async () => {
      const uid = await localStorage.getItem("userID");
      try {
        const url = `${API_URL}api/trips/userVisitedCountriesRegions`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: uid,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTotalCities(data.totalSimilarCities);
          setTotalCountries(data.totalSimilarCountries);
        }
      } catch (error) {
        // Handle fetch or other errors
        console.error(error);
      }
    };
    getUserInfo()
    fetchTotalCountryCitiesVisited();
  }, []);

  return (
    <>
      <div className="row px-lg-5 px-4 pt-lg-5 pt-4">
        <div className=" col-lg-4 align-items-center gap-2 ">
          <div className="d-flex align-items-center gap-3">
          {user?.dp && (
            <img
              width={100}
              height={100}
              style={{
                borderRadius: '50%',

              }}
              className={`${styles.menicon} mt-2`}
              src={`${Files_URL}${user?.dp}`}
              alt="profile"
            />
          )}
            <p>
            {user?.about}
            </p>
          </div>
          <h6 className="fw-600 mb-0 mt-4">{user?.username}</h6>
          <p className="pt-3">
            Where you've been:
            {totalCities === 0 && totalCountries === 0 && " Nowhere yet"}
            {totalCities === 1 &&
              totalCountries === 1 &&
              ` ${totalCities} city and ${totalCountries} country`}
            {totalCities === 1 &&
              totalCountries > 1 &&
              ` ${totalCities} city and ${totalCountries} countries`}
            {totalCities > 1 &&
              totalCountries === 1 &&
              ` ${totalCities} cities and ${totalCountries} country`}
            {totalCities > 1 &&
              totalCountries > 1 &&
              ` ${totalCities} cities and ${totalCountries} countries`}
          </p>
          <h6 className="fw-600 mb-3 mb-lg-4">
            Total shared experiences: {userTotalExperience}{" "}
          </h6>
          <Link
            href="/editprofile"
            className={` fw-600 cursor-pointer text-decoration-none fw-600 ${styles.editbtn}`}
          >
            Edit Profile
          </Link>
        </div>
        <div className="col-lg-8"></div>
      </div>

      <div className="container-fluid pb-4">
        <div className="row py-5 mt-4 flex-wrap align-items-center justify-content-center justify-content-md-start gap-lg-0 gap-3 px-4 px-lg-0 justify-content-lg-center">
          <div className="col-6 col-md-4 col-sm-6 col-lg-4 text-center justify-content-center d-flex">
            <Link
              href="/upcomingtrips"
              className="text-decoration-none text-light"
            >
              <button
                href="#"
                className={`d-flex align-items-center justify-content-start px-4 d-flex  ${styles.profilebutton}`}
              >
                <h6 className="mb-0 fw-600">Trips</h6>
              </button>
            </Link>
          </div>
          <div className="col-6 col-md-4 col-sm-6 col-lg-4 text-center justify-content-center d-flex">
            <Link
              href="/infinitescroll"
              className="text-decoration-none text-light"
            >
              <button
                href="#"
                className={`text-center d-flex align-items-center justify-content-between fw-600 px-4 d-flex ${styles.profilebutton} ${styles.reccommendbtn}`}
              >
                Your Experiences
              </button>
            </Link>
          </div>
          <div className="col-6 col-md-4 col-sm-6 col-lg-4 text-center justify-content-center d-flex">
            <Link href="/viewsave" className="text-decoration-none text-light">
              <button
                href="#"
                className={`text-center d-flex align-items-center justify-content-between px-4 d-flex ${styles.profilebutton} ${styles.heartbtn}`}
              >
                <h6 className="mb-0 fw-600">Saves</h6>
                <FontAwesomeIcon
                  className={styles.profileheart}
                  icon={faHeart}
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
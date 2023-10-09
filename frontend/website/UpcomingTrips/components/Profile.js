import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileicon from "../../../public/images/men.svg";
import styles from "../../../styles/profile.module.css";
import { API_URL } from "../../../apiConfig";
// import Globe from "./Globe";

export default function Profile({ trips }) {
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
  console.log(recommendations.Recommendations, "recommendationsData");
  const [user, setUser] = useState(null);
  const recData = recommendations?.Recommendations;
  const [isEditing, setIsEditing] = useState(false);
  const [count, setCount] = useState(0);

  const [totalCountries, setTotalCountries] = useState(0);
  const [totalCities, setTotalCities] = useState(0);
  const [profileData, setProfileData] = useState({
    username: "",
    region: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchTrips = async () => {
      const uid = await localStorage.getItem("userID")
      const filteredTrips = trips.filter(trip => trip.userID == uid);
      setCount(filteredTrips.length)

    }
    fetchTrips();
  }, [trips]);
  useEffect(() => {
    const fetchTotalCountryCitiesVisited = async () => {
      const uid = await localStorage.getItem("userID")
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
          setTotalCities(data.totalSimilarCities)
          setTotalCountries(data.totalSimilarCountries)
        }
      } catch (error) {
        // Handle fetch or other errors
        console.error(error);
      }

    }
    fetchTotalCountryCitiesVisited();
  }, []);

  return (
    <div className=" align-items-center gap-2 ">
      <div className="d-flex align-items-center gap-3">
        <Image
          width={100}
          height={100}
          className={`${styles.menicon} mt-2`}
          src={profileicon}
          alt="profile"
        />
        <p>
          Fell in love with traveling and want to share my experiences with the
          world!
        </p>
      </div>
      <h6 className="fw-600 mb-0 mt-4">{user?.userId?.username}</h6>
      <p className="pt-3">
        Where you've been:
        {totalCities === 0 && totalCountries === 0 && " Nowhere yet"}
        {totalCities === 1 && totalCountries === 1 && ` ${totalCities} city and ${totalCountries} country`}
        {totalCities === 1 && totalCountries > 1 && ` ${totalCities} city and ${totalCountries} countries`}
        {totalCities > 1 && totalCountries === 1 && ` ${totalCities} cities and ${totalCountries} country`}
        {totalCities > 1 && totalCountries > 1 && ` ${totalCities} cities and ${totalCountries} countries`}
      </p>

      <h6 className="fw-600 mb-3 mb-lg-4">
        Total Trips:
        {count === 0 && " No trips taken yet."}
        {count === 1 && " 1"}
        {count > 1 && ` ${count}`}
      </h6>
      <Link
        href="/editprofile"
        className={` fw-600 cursor-pointer text-decoration-none fw-600 ${styles.editbtn}`}
      >
        Edit Profile
      </Link>
    </div>
  );
}

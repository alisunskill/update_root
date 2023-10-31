import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileicon from "../../../public/images/men.svg";
import styles from "../../../styles/profile.module.css";
import { API_URL ,Files_URL} from "../../../apiConfig";

// import Globe from "./Globe";

export default function Profile({  }) {
  
  const router = useRouter();
  const { id } = router.query;//userID

  const dispatch = useDispatch();



  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  console.log(recommendations.Recommendations, "recommendationsData");
  const [user, setUser] = useState(null);
  const recData = recommendations?.Recommendations;
  const [isEditing, setIsEditing] = useState(false);
  const [count, setCount] = useState(0);
  const [userTotalExperience, setUserTotalExperience] = useState(0);
  const [userInfo, setUserInfo] = useState({});



  const [totalCountries, setTotalCountries] = useState(0);
  const [totalCities, setTotalCities] = useState(0);
  
  
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
          body: JSON?.stringify({
            userID: JSON?.parse(id),
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
      const fetchTotalExp = async () => {
          try {
            const url = `${API_URL}api/recommendations/UserTotalRecommendations`;
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
        
      };
      getUserInfo()
    fetchTotalCountryCitiesVisited();
    fetchTotalExp();
  }, [id]);

  return (
    <div className=" align-items-center gap-2 ">
      <div className="d-flex align-items-center gap-3">
        {userInfo?.dp && (
        <img
          width={100}
          height={100}
          className={`${styles.menicon} mt-2`}
          src={`${Files_URL}${userInfo?.dp}`}
          alt="profile"
          style={{
            borderRadius:'50%'
          }}
        />
        
        )}
        <p>
          Fell in love with traveling and want to share my experiences with the
          world!
        </p>
      </div>
      <h6 className="fw-600 mb-0 mt-4">{userInfo?.firstName} {userInfo?.lastName}</h6>
      <p className="pt-3">
      Where's he been:
        {totalCities === 0 && totalCountries === 0 && " Nowhere yet"}
        {totalCities === 1 && totalCountries === 1 && ` ${totalCities} city and ${totalCountries} country`}
        {totalCities === 1 && totalCountries > 1 && ` ${totalCities} city and ${totalCountries} countries`}
        {totalCities > 1 && totalCountries === 1 && ` ${totalCities} cities and ${totalCountries} country`}
        {totalCities > 1 && totalCountries > 1 && ` ${totalCities} cities and ${totalCountries} countries`}
      </p>

      <h6 className="fw-600 mb-3 mb-lg-4">
      Total shared experiences:
        {userTotalExperience === 0 && " No experience yet."}
        {userTotalExperience === 1 && " 1"}
        {userTotalExperience > 1 && ` ${userTotalExperience}`}
      </h6>
      
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";
import { API_URL, Files_URL } from "../apiConfig";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { CalendarMonthRounded, AddCircleOutline } from "@mui/icons-material";
import ItenraryRecommendations from "../components/ItenraryRecommendations";
import styles from "../styles/home.module.css";
export default function TripPlans() {
  const router = useRouter();
  const [itenraryDetail, setItenraryDetail] = useState([]);
  const [likes, setlikes] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itTitle, setItTitle] = useState("");
  const [userID, setUserID] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = router.query;
  const [itenraryID, setItenraryID] = useState(id);
  // State for trip plans
  useEffect(() => {
    // Check if router.query.id has a value
    fetchTripDetail();
    

  }, [id]);
  const fetchTripDetail = async () => {
    console.log("IDDDDDDDDDDDDDDDDDDDD", id);
    const url = `${API_URL}api/itineraryposts/itneraryDetail`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON?.stringify({
        id: JSON?.parse(id),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log(data);
          setItenraryID(data.data._id)
          setItTitle(data.data.itTitle);
          setUserID(data.data.userID);
          setlikes(data.data.likes)
          setItenraryDetail(data.data.posts);
          setLoading(false);
        } else {
          setErrorMessage(data.message);
          setShowError(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setErrorMessage(
          "Failed To Fetch Detail Due TO Internet Connection or Server Down"
        );
        setShowError(true);
        setLoading(false);
      });
  };
  return (
    <div>
      {/* {showError && (
        <Alert fullWidth severity="error">
          {errorMessage}
        </Alert>
      )} */}
      {loading ? (
        <Backdrop sx={{ color: "#fff" }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div
          className={`row  ${styles.globalhero}`}
          style={{ marginBottom: "20px;" }}
        >
          {/* Events Zone */}
          <div className={`col-lg-12 p-0`}>
            <ItenraryRecommendations setlikes={setlikes} likes={likes}itenraryID={itenraryID} itTitle={itTitle} data={itenraryDetail} userID={userID} />
          </div>
        </div>
      )}
    </div>
  );
}
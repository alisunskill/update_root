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
  const [itenraryID, setItenraryID] = useState(null);
  const [itenraryDetail, setItenraryDetail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  

  // State for trip plans

  useEffect(() => {
    // Check if router.query.id has a value
    if (router.query.id) {
      try {
        // Parse the JSON string to get the actual trip._id value
        const parsedId = JSON.parse(router.query.id);
        setItenraryID(parsedId);
        fetchTripDetail(parsedId);
      } catch (error) {
        // Handle parsing error
        console.error("Error parsing trip._id:", error);
        setErrorMessage("Invalid trip ID format");
        setShowError(true);
        setLoading(false);
      }
    }
  }, [router.query.id]);

  const fetchTripDetail = async (id) => {
    console.log("IDDDDDDDDDDDDDDDDDDDD",id)
    const url = `${API_URL}api/itineraryposts/itneraryDetail`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log(data);
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
      {showError && (
        <Alert fullWidth severity="error">
          {errorMessage}
        </Alert>
      )}
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
          <ItenraryRecommendations data={itenraryDetail} />
        </div>

        <div className="row pt-lg-5 pt-4 pb-3">
          <div className="col-12  pt-lg-3 pt-0 text-center">
            <h5 className="fw-500">
              Oops, looks like there’s no more to show.
            </h5>
            <br />
            <h5 className="fw-500">
              Try searching for another destination or make a post of your
              own!
            </h5>
          </div>
        </div>
      </div>
      )}
    </div>
  );
  
  
}

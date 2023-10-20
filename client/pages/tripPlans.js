import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";
import { API_URL } from "../apiConfig";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { CalendarMonthRounded, AddCircleOutline } from "@mui/icons-material";

export default function TripPlans() {
  const router = useRouter();
  const [tripId, setTripId] = useState(null);
  const [tripDetail, setTripDetail] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // State for trip plans
  const [tripPlans, setTripPlans] = useState([]);
  const [plansAdded, setPlansAdded] = useState(false);

  useEffect(() => {
    // Check if router.query.id has a value
    if (router.query.id) {
      try {
        // Parse the JSON string to get the actual trip._id value
        const parsedId = JSON.parse(router.query.id);
        setTripId(parsedId);
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
    const url = `${API_URL}api/tripPlans/getATripPlan`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripId: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          console.log(data);
          setTripDetail(data.trip);
          setLoading(false);
          if (data.hasPlans) {
            console.log("Hai Plans"); // Log a message when tripPlans exist
            setTripPlans(data.tripPlans[0].plans); // Set tripPlans only if it's not empty
          } else {
            console.log("Nhi Hain Plans"); // Log a message when tripPlans is empty
            generateInitialTripPlans(data.trip.sdate, data.trip.edate); // Generate initial trip plans when tripPlans is empty
          }
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

  const generateInitialTripPlans = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const plans = [];

    while (start <= end) {
      plans.push({
        date: start.toISOString(),
        note: "",
        places: "",
      });

      start.setDate(start.getDate() + 1);
    }

    setTripPlans(plans);
  };

  // Function to Submit Plans
  const submitPlans = () => {
    const userID = localStorage.getItem("userID");
    setPlansAdded(false);

    const url = `${API_URL}api/tripPlans/addTripPlan`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userID,
        tripId: tripId,
        plans: tripPlans,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setPlansAdded(true);
        } else {
          setErrorMessage(data.message);
          setShowError(true);
        }
      })
      .catch((error) => {
        setErrorMessage(
          "Failed To Submit Plans Due TO Internet Connection or Server Down"
        );
        setShowError(true);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        border: "0.5px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
        width: "60%",
        margin: "10px auto",
        minHeight: "60vh",
      }}
    >
      {plansAdded && (
        <Alert fullWidth severity="success">
          Plans added successfully.
        </Alert>
      )}
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
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <h2
            style={{
              alignSelf: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            {tripDetail?.title}
          </h2>
          <h6
            style={{
              alignSelf: "center",
              width: "100%",
              textAlign: "center",
            }}
          >
            Region: {tripDetail?.region}
          </h6>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div>
              <span>
                <CalendarMonthRounded />
              </span>
              {new Date(tripDetail?.sdate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </div>
            <div>
              <hr class="hr-19"></hr>
            </div>
            <div>
              <span>
                <CalendarMonthRounded />
              </span>
              {new Date(tripDetail?.edate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
              })}
            </div>
          </div>

          {/* Render other trip details */}
          {/* Trip Plans Section */}
          <div style={{ marginTop: "20px", width: "100%" }}>
            <h3>Add Trip Plans</h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {tripPlans.map((plan, index) => (
                <div key={index} style={{ width: "48%", marginBottom: "20px" }}>
                  <h4>
                    {new Date(plan.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </h4>
                  <div style={{ alignItems: "center", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Add a reminder/note"
                      value={plan.note}
                      onChange={(e) => {
                        const updatedPlans = [...tripPlans];
                        updatedPlans[index].note = e.target.value;
                        setTripPlans(updatedPlans);
                      }}
                      style={{ marginRight: "10px" }}
                    />
                    <input
                      type="text"
                      placeholder="Places to visit"
                      value={plan.places}
                      onChange={(e) => {
                        const updatedPlans = [...tripPlans];
                        updatedPlans[index].places = e.target.value;
                        setTripPlans(updatedPlans);
                      }}
                      style={{ marginRight: "10px", marginTop: "5px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={submitPlans}
              style={{
                padding: "10px 20px",
                backgroundColor: "lightblue",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                transition: "background-color 0.3s ease",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

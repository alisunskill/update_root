import React, { useState, useEffect } from "react";
import styles from "../../styles/singular.module.css";
import plusicon2 from "../../public/images/plusicon2.svg";
import profile from "../../public/images/men.svg";
import Swal from "sweetalert2";
import burger from "../../public/images/burger.svg";
import money from "../../public/images/moneyicon.svg";
import clock from "../../public/images/clockicon.svg";
import painticon from "../../public/images/painticon.svg";
import { useRouter } from "next/router";
import travelicon from "../../public/images/travelicon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import SliderApps from "./SliderApps";
import { useDispatch, useSelector } from "react-redux";
import GoogleMapReact from "google-map-react";
import { fetchUserData } from "../../store/actions/userAction";
import axios from "axios";
import Trip from "../../website/ViewSaves/components/Trip";
import NearSlider from "./component/NearSlider";

export default function EventDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const userData = useSelector((state) => state?.userId);
  const [postCounts, setPostCounts] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [user, setUser] = useState(null);
  const [tripCount, setTripCount] = useState("");
  const [loadings, setLoadings] = useState(true);
  const [totalLikesData, setTotalLikesData] = useState(0);
  const [postid, setPostId] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [favList, setFavList] = useState([]);
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;

  const recData = recommendations.Recommendations;

  const handleIconClick = () => {
    router.back();
  };

  useEffect(() => {
    if (userData) {
      const userDataJSON = JSON.stringify(userData);
      localStorage.setItem("userData", userDataJSON);
    } else {
      console.error("userData is null or undefined");
    }
  }, [userData]);

  useEffect(() => {
    const userDataJSON = localStorage.getItem("userData");
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      setUser(userData);
    } else {
      console.error("userData not found in local storage");
    }
  }, []);

  const filteredData =
    recData?.find((item) => item._id === postid) ||
    recData?.find((item) => item._id === id);

  const filteredd = recData?.find((item) => item._id === id);
  useEffect(() => {
    const selectedIdFromFilteredData = filteredd?._id || id;
    if (selectedIdFromFilteredData) {
      localStorage.setItem("filterPostId", selectedIdFromFilteredData);
    }
  }, [filteredData, id]);

  const filterLoc = filteredData?.location;
  const [staticMarkerPosition, setStaticMarkerPosition] = useState({
    lat: 0,
    lng: 0,
  });

  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const userIds = localStorage.getItem("userID");

    if (userIds) {
      dispatch(fetchUserData(userIds));
      setLoadings(false);
      setUser(userData);
    }
  }, [dispatch]);

  useEffect(() => {
    const totalTrips = localStorage.getItem("tripsLength");
    setTripCount(totalTrips);
  }, []);

  useEffect(() => {
    const selectedIds = favList.map((item) => item._id);
    sendFavListToBackend(selectedIds);
  }, [favList]);

  useEffect(() => {
    const itemData = JSON.parse(localStorage.getItem("itemId"));
    setPostId(itemData);
  }, []);

  const { postId } = router.query;

  const RedMarker = ({ text, latitude, longitude }) => (
    <div
      style={{
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        background: "red",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
        cursor: "pointer",
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
      lat={latitude}
      lng={longitude}
    >
      <p className="px-5  py-1 bg-danger rounded-5">{text}</p>
    </div>
  );

  const handleFavoriteClick = (id) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [id]: !prevSelectedItems[id],
    }));

    const isAlreadyFav = favList.some((favItem) => favItem._id === id);
    if (isAlreadyFav) {
      const updatedFavList = favList.filter((item) => item._id !== id);
      setFavList(updatedFavList);
      setPostCounts((prevCounts) => ({
        ...prevCounts,
        [id]: (prevCounts[id] || 0) - 1,
      }));
      Swal.fire({
        text: "This post is removed from your favorites.",
        icon: "info",
      });
      return;
    }

    const clickedItem = filteredData;
    if (clickedItem) {
      const updatedFavList = [clickedItem];
      setFavList(updatedFavList);
      setPostCounts((prevCounts) => ({
        ...prevCounts,
        [id]: (prevCounts[id] || 0) + 1,
      }));
      localStorage.setItem(
        "selectedIds",
        JSON.stringify(updatedFavList.map((item) => item._id))
      );
    }
  };

  const sendFavListToBackend = async (selectedIds) => {
    const userID = localStorage.getItem("userID");

    try {
      const response = await axios.post("http://localhost:8000/api/savepost", {
        postId: selectedIds,
        userID: userID,
      });
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };

  // const [mapCenter, setMapCenter] = useState({
  //   lat: 31.5204,
  //   lng: 74.3587,
  // });

  const totalLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/recommendations/${filteredData._id}`
      );
      const totalLikes = response.data.totalLikes;
      setTotalLikesData(totalLikes);
    } catch (error) {
      console.error("Error fetching total likes:", error);
    }
  };
  console.log(totalLikesData, "totalLikesData");
  useEffect(() => {
    totalLikes();
  }, [filteredData]);

  const [mapCenter, setMapCenter] = useState({
    lat: filterLoc?.coordinates?.[1] || 31.5204,
    lng: filterLoc?.coordinates?.[0] || 74.3587,
  });
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    if (filterLoc?.coordinates) {
      setStaticMarkerPosition({
        lat: filterLoc.coordinates[1],
        lng: filterLoc.coordinates[0],
      });
      setMapCenter({
        lat: filterLoc.coordinates[1],
        lng: filterLoc.coordinates[0],
      });
    }
  }, [filterLoc?.coordinates]);

  useEffect(() => {
    const selectedIdsFromLocalStorage = localStorage.getItem("postId");
    if (selectedIdsFromLocalStorage) {
      setPostId(selectedIdsFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    const storedPostCounts = localStorage.getItem("postCounts");
    if (storedPostCounts) {
      const parsedPostCounts = JSON.parse(storedPostCounts);
      setPostCounts(parsedPostCounts);
    }
  }, []);

  useEffect(() => {
    if (filterLoc?.coordinates) {
      setStaticMarkerPosition({
        // latitude: filterLoc?.coordinates[1],
        // longitude: filterLoc?.coordinates[0],
        lat: filterLoc?.coordinates[1],
        lng: filterLoc?.coordinates[0],
      });
    }
  }, [filterLoc?.coordinates]);

  const handleApiLoaded = (map, maps) => {
    if (loading || !filteredData) {
      return;
    }

    filteredData?.arrayProperty?.forEach((form) => {
      const formMarker = new maps.Marker({
        position: {
          lat: form.location.coordinates[1],
          lng: form.location.coordinates[0],
        },
        map,
        title: form.title,
      });

      formMarker.addListener("click", () => {
        alert(`Title: ${form.title}\nCost: ${form.cost}\nHours: ${form.hours}`);
      });
    });

    filteredData?.arrayProperty?.forEach((form) => {
      const formMarker = new maps.Marker({
        position: {
          lat: form.location.coordinates[1],
          lng: form.location.coordinates[0],
        },
        map,
        title: form.title,
      });

      formMarker.addListener("click", () => {
        alert(`Title: ${form.title}\nCost: ${form.cost}\nHours: ${form.hours}`);
      });
    });
  };

  const calculateCenter = (locations) => {
    if (!locations || locations.length === 0) {
      return { lat: 31.5204, lng: 74.3587 };
    }

    const sumLat = locations.reduce(
      (sum, location) => sum + location.location.coordinates[1],
      0
    );
    const sumLng = locations.reduce(
      (sum, location) => sum + location.location.coordinates[0],
      0
    );

    const avgLat = sumLat / locations.length;
    const avgLng = sumLng / locations.length;

    return { lat: avgLat, lng: avgLng };
  };

  const saveCount = postCounts && postCounts[postid] ? postCounts[postid] : 0;

  if (loadings) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const handleLikeCount = (recommendationId) => {
    console.log("Clicked Like for recommendationId:", recommendationId);

    // Perform the API request and update the state here...

    axios
      .post(
        `http://localhost:8000/api/recommendations/${recommendationId}/like`
      )
      .then((response) => {
        if (response) {
          const updatedLikeCount = response.data.likes;
          console.log("Updated Like Count:", updatedLikeCount);
          setLikeCount(updatedLikeCount);
        }
      })
      .catch((error) => {
        console.error("Error updating like count:", error);
      });
  };

  return (
    <>
      <div className={`container-fluid pb-5 ${styles.singleventhero}`}>
        <div className={`row `}>
          <div
            className={`col-lg-7 col-12 col-md-12 mt-3 ${styles.scenerypara}`}
          >
            <div className={`row align-items-center ${styles.eventtopsection}`}>
              <div className=" col-9 col-md-6 col-lg-12 mt-2">
                <h4 className="fw-600">{filteredData?.title}</h4>
              </div>
              {/* profile men */}
              <div className="d-flex align-items-center justify-content-start gap-3 mt-3">
                <Image
                  className={`${styles.menicon} `}
                  src={profile}
                  alt="profile"
                />
                <div>
                  <h6 className="fw-600 mb-0">{user?.userId?.username}</h6>
                  <p className="fw-600 mb-0 f-14">{user?.userId?.location} </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-4">
                <SliderApps images1={filteredData?.images} />
              </div>
            </div>
          </div>
          <div className="col-lg-1 col-12">
            <div className="row">
              <div
                className={`col-12 col-md-12 col-lg-12 text-center ${styles.eventmidicons}`}
              >
                {filteredData && filteredData.descriptors && (
                  <>
                    {filteredData.descriptors.includes("food") && (
                      <div className={styles.eventicons}>
                        <Image
                          className={`h-auto ${styles.foodIcons}`}
                          src={burger}
                          alt=""
                          style={{
                            border: "2px solid green",
                            borderRadius: "50px",
                          }}
                        />
                      </div>
                    )}

                    {filteredData.descriptors.includes("Art") && (
                      <div className={` ${styles.eventicons}`}>
                        <Image
                          className={`h-auto ${styles.foodIcons}`}
                          src={painticon}
                          alt=""
                          style={{
                            border: "2px solid green",
                            borderRadius: "50px",
                          }}
                        />
                      </div>
                    )}

                    {filteredData.descriptors.includes("Hiking") && (
                      <div className={` ${styles.eventicons}`}>
                        <Image
                          className={`h-auto ${styles.foodIcons}`}
                          src={travelicon}
                          alt=""
                          style={{
                            border: "2px solid green",
                            borderRadius: "50px",
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-12 text-align-right p-0">
            <div
              className={styles.mapbox}
              style={{ height: "100vh", width: "100%" }}
            >
              <div className="d-flex justify-content-end w-100 pb-5 px-1">
                <FontAwesomeIcon
                  className="cursor-pointer"
                  icon={faX}
                  onClick={handleIconClick}
                />
              </div>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM",
                  libraries: ["places"],
                }}
                defaultCenter={{ lat: 31.5204, lng: 74.3587 }}
                defaultZoom={7}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) =>
                  handleApiLoaded(map, maps)
                }
                // center={{
                //   lat: filterLoc,
                //   lng: filterLoc,
                // }}
                center={{
                  lat: 31.5204,
                  lng: 74.3587,
                }}
                // center={mapCenter}
              >
                {filteredData?.arrayProperty?.map((form, index) => (
                  <RedMarker
                    key={index}
                    lat={form.location.coordinates[1]}
                    lng={form.location.coordinates[0]}
                  />
                ))}

                {filterLoc?.coordinates && (
                  <RedMarker
                    lat={staticMarkerPosition.lat}
                    lng={staticMarkerPosition.lng}
                    text={filteredData?.region}
                  />
                )}
              </GoogleMapReact>
              {/* <div className={styles.mapbox}>
             <div className="mapouter">
                <div className="gmap_canvas">
                  <iframe
                    width="770"
                    height="590"
                    id="gmap_canvas"
                    src="https://maps.google.com/maps?q=california&t=&z=10&ie=UTF8&iwloc=&output=embed"
                    frameborder="0"
                    scrolling="no"
                    marginheight="0"
                    marginwidth="0"
                  ></iframe>
                  <a href="https://2yu.co"></a>
                  <br />
                  <a href="https://embedgooglemap.2yu.co"></a>
                </div>
              </div>
             </div> */}
              {/* hours and cost */}
              <div></div>
            </div>
          </div>
        </div>
        {/* General info */}
        <div className="row mt-3 py-3">
          <div className="col-12 col-md-7 col-lg-7 ">
            {/* General Information / Highlights */}
            <h5 className="fw-600 mt-4">General Information / Highlights</h5>
            <p className={styles.eventtitlepara}>
              General Information / Highlights
            </p>

            {/* My Experience */}
            <h5 className="fw-600 mt-4">My Experience</h5>
            <p className={styles.eventtitlepara}>{filteredData?.experience}</p>

            {/* Tips */}
            <h5 className="fw-600 mt-4">Tips</h5>
            <ul>
              <li className={styles.eventtitlepara}>
                {filteredData?.description}
              </li>
            </ul>

            {/* Useful Links */}
            <h5 className="fw-600 mt-4">Useful Links</h5>
            <p className={styles.eventtitlepara}>
              {filteredData?.links
                ? filteredData?.links
                : "This Post have no Links"}
            </p>
          </div>
          <div className="col-12 col-md-5 col-lg-5 d-flex flex-column pt-lg-5 pt-4 align-items-center text-center">
            <div className="mt-3">
              <Image width={50} height={50} src={clock} />
              <h5 className="fw-600 mt-3">Hours of Operation</h5>
              <p className={styles.eventtitlepara}>{filteredData?.hours}</p>
            </div>
            <div className="mt-5">
              <Image width={50} height={50} src={money} />

              <h5 className="fw-600 mt-3">Cost to Attend</h5>
              <p className={styles.eventtitlepara}>{filteredData?.cost} </p>
            </div>
          </div>
        </div>

        {/* extra */}
        <div className="row d-flex justify-content-end mt-lg-5 mt-3 pt-lg-4 pt-3 px-lg-5  px-2 pb-2">
          <div
            className={` col-6 col-md-2 col-lg-1 align-items-center d-flex justify-content-center gap-3 ${styles.eventicon}`}
          >
            <div
              className={`d-flex align-items-center justify-content-center ${styles.eventicondiv}`}
            >
              <Image
                onClick={() => setModalShow(true)}
                className={`${styles.eventtopicons} animated1`}
                src={plusicon2}
                alt=""
              />
            </div>
            <div className="text-center w-100  d-flex justify-content-center align-items-center">
              <Trip
                show={modalShow}
                onHide={() => setModalShow(false)}
                setModalShow={setModalShow}
                images1={filteredData?.images}
              />
            </div>
            <div
              className={`d-flex align-items-center justify-content-center bold1 ${styles.eventicondiv}`}
            >
              <div className="animated">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="heartbeat"
                  onClick={() => handleFavoriteClick(filteredData?._id)}
                  style={{
                    color: selectedItems[filteredData?._id] ? "red" : "black",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            {/* LIKE LOGIC  */}
            <div
              className={`d-flex align-items-center justify-content-center bold1 ${styles.eventiconbox}`}
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="heartbeat text-danger"
                onClick={() => handleLikeCount(filteredData._id)}
                // style={{
                //   color: selectedItems[filteredData?._id] ? "red" : "black",
                //   cursor: "pointer",
                // }}
              />
              {totalLikesData} Likes
            </div>
          </div>
        </div>
        <hr />
        <div>
          <h6 className="fw-600 pt-2">Places of Interest Nearby</h6>
          <div className="pt-3">
            <NearSlider />
          </div>
        </div>
      </div>
    </>
  );
}

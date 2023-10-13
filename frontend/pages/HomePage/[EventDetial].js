import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/singular.module.css";
import plusicon2 from "../../public/images/plusicon2.svg";
import profile from "../../public/images/men.svg";
import Swal from "sweetalert2";
import burger from "../../public/images/burger.svg";
import money from "../../public/images/moneyicon.svg";
import clock from "../../public/images/clockicon.svg";
import calender from "../../public/images/calender.svg";
import moneyicon from "../../public/images/moneyicon.svg";
import painticon from "../../public/images/painticon.svg";
import { useRouter } from "next/router";
import travelicon from "../../public/images/travelicon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { API_URL } from "../../apiConfig";
import SliderApps from "./SliderApps";
import { useDispatch, useSelector } from "react-redux";
import GoogleMapReact from "google-map-react";
import { fetchUserData } from "../../store/actions/userAction";
import axios from "axios";
import Trip from "../../website/ViewSaves/components/Trip";
import NearSlider from "./component/NearSlider";
import RoomIcon from "@mui/icons-material/Room";
import { GoogleMapApiKey } from "../../apiConfig";

export default function EventDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { id } = router.query;
  const [eventDetail, setEvenDetail] = useState({});
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

  const [userInfo, setUserInfo] = useState({});
  const [userTotalExp, setuserTotalExp] = useState(0);
  const [editPost, setEditPost] = useState(null);

  const recData = recommendations.Recommendations;

  const handleIconClick = () => {
    router.back();
  };

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const url = `${API_URL}api/recommendations/recommendationDetail`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setEvenDetail(data.data);
            getUserInfo(data.data.userID);
            getTotalExperiencesOfUser(data.data.userID);
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
    const getUserInfo = async (userID) => {
      try {
        const url = `${API_URL}api/users/userInfo`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userID,
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
    const getTotalExperiencesOfUser = async (userID) => {
      try {
        const url = `${API_URL}api/recommendations/UserTotalRecommendations`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userID,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setuserTotalExp(data.totalRecommendations);
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
    const totalLikes = async () => {
      try {
        const response = await axios.get(`${API_URL}api/recommendations/${id}`);
        const totalLikes = response.data.totalLikes;
        setTotalLikesData(totalLikes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };
    fetchEventDetail();
    totalLikes();
  }, [id]);

  useEffect(() => {
    if (userData) {
      const userDataJSON = JSON.stringify(userData);
      localStorage.setItem("userData", userDataJSON);
    } else {
      //console.error("userData is null or undefined");
    }
  }, [userData]);

  useEffect(() => {
    const userDataJSON = localStorage.getItem("userData");
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      setUser(userData);
    } else {
      // console.error("userData not found in local storage");
    }
  }, []);

  // useEffect(() => {

  //   getUserInfo();
  // }, [filteredData]);

  const filteredData =
    recData?.find((item) => item._id === postid) ||
    recData?.find((item) => item._id === id);

  // edit post

  const [title, setTitle] = useState(filteredData?.title || "");
  const [cost, setCost] = useState(filteredData?.cost || "");
  const [hours, setHours] = useState(filteredData?.hours || "");
  const [experience, setExperience] = useState(filteredData?.experience || "");
  const [location, setLocation] = useState(filteredData?.location || "");
  const [region, setRegion] = useState(filteredData?.region || "");
  const [description, setDescription] = useState(
    filteredData?.description || ""
  );
  const [descriptors, setDescriptors] = useState(
    filteredData?.descriptors || []
  );
  //console.log(descriptors, "descriptorsdescriptorsdescriptors");
  const [links, setLinks] = useState(filteredData?.links || "");
  const [images, setImages] = useState(filteredData?.images || []);

  const filteredd = recData?.find((item) => item._id === id);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState("");

  const defaultProps = {
    center: {
      lat: 33.572423,
      lng: 73.14675,
    },
    zoom: 11,
  };

  const handleMapClick = ({ lat, lng }) => {
    setCurrentLocation({ lat, lng });
  };
  useEffect(() => {
    // Function to fetch the street address based on the current location
    const fetchAddress = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GoogleMapApiKey}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        setAddress("Error fetching address");
      }
    };

    if (currentLocation) {
      fetchAddress(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation]);

  const [isFormFilled, setIsFormFilled] = useState(false);

  //itineraries
  const [itineraries, SetItineraries] = useState([]);
  //console.log("ITS", itineraries);

  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({
    title: "",
    cost: "",
    hours: "",
    experience: "",
    location: "",
    region: "",
    description: "",
    descriptors: [],
    links: "",
  });
  //console.log(filteredd, "filteredd");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedFields({
      title: filteredd.title,
      cost: filteredd.cost,
      hours: filteredd.hours,
      experience: filteredd.experience,
      location: filteredd.location,
      region: filteredd.region,
      description: filteredd.description,
      descriptors: filteredd.descriptors,
      links: filteredd.links,
    });
  };

  const handleSaveClick = (recommendationId) => {
    const editedPost = {
      title: editedFields.title,
      cost: editedFields.cost,
      hours: editedFields.hours,
      experience: editedFields.experience,
      location: editedFields.location,
      region: editedFields.region,
      description: editedFields.description,
      descriptors: editedFields.descriptors,
      links: editedFields.links,
      // images: images,
    };
    // console.log(setEditedFields, "editedFields");

    axios
      .put(`${API_URL}api/recommendations/${recommendationId}`, editedPost)
      .then((response) => {
        console.log("Post edited successfully:", response.data);
        setDescriptors(response.data.descriptors); // Update descriptors state with data from API response

        // router.push("/");
        setDescriptors(response.data.descriptors); // Update descriptors state with data from API response
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error editing post:", error);
      });
  };

  // end edit post

  useEffect(() => {
    const selectedIdFromFilteredData = filteredd?._id || id;
    if (selectedIdFromFilteredData) {
      localStorage.setItem("filterPostId", selectedIdFromFilteredData);
    }

    // getUserInfo();
    // getTotalExperiencesOfUser();
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
    console.log("Selected IDDDDDSSSSSS", selectedIds);
    try {
      const response = await axios.post(`${API_URL}api/savepost`, {
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

  //console.log(totalLikesData, "totalLikesData");
  // useEffect(() => {
  //   totalLikes();
  // }, [filteredData]);

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

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setCost(editPost.cost);
      setHours(editPost.hours);
      setExperience(editPost.experience);
      setLocation(editPost.location);
      setRegion(editPost.region);
      setDescription(editPost.description);
      setDescriptors(editPost.descriptors);
      setLinks(editPost.links);
    }
  }, [editPost]);

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

    setTotalLikesData(totalLikesData + 1);

    axios
      // .post(
      //   `http://localhost:8000/api/recommendations/${recommendationId}/like`
      // )
      .post(`${API_URL}api/recommendations/${recommendationId}/like`)
      .then((response) => {
        if (response) {
          const updatedLikeCount = response.data.likes;
          console.log("Updated Like Count:", updatedLikeCount);
          //setLikeCount(updatedLikeCount);
        }
      })
      .catch((error) => {
        console.error("Error updating like count:", error);
      });
  };

  // edit post
  const editHandlePost = (recommendationId) => {
    const editedPost = {
      title,
      hours,
      cost,
      experience,
      description,
      location,
      descriptors,
      region,
      links,
    };

    axios
      .put(`${API_URL}api/recommendations/${recommendationId}`, editedPost)
      .then((response) => {
        console.log("Post edited successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error editing post:", error);
      });
  };

  return (
    <div className="px-lg-3 px-2">
      {isEditing ? (
        <div className={`row ${styles.createdhero}`}>
          <div className={`col-12 ${styles.scenerypara}`}>
            <form>
              <div className="row d-flex justify-content-end px-lg-5  px-2 pb-2">
                {isEditing ? (
                  <>
                    {/* Input fields for editing */}
                    <div className="form-group pt-4">
                      <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        className="form-control py-2"
                        value={editedFields.title}
                        onChange={(e) =>
                          setEditedFields({
                            ...editedFields,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <div className="row">
                        <div className="col-lg-7 col-md-6 col-12">
                          <div className="form-group pt-5">
                            <input
                              type="text"
                              name="location"
                              className="form-control py-2"
                              value={editedFields.location}
                              onChange={(e) =>
                                setEditedFields({
                                  ...editedFields,
                                  location: e.target.value,
                                })
                              }
                              required
                              placeholder="Provide a Location"
                            />
                          </div>
                          <div className="form-group pt-5">
                            <textarea
                              type="text"
                              name="region"
                              className="form-control "
                              id="exampleFormControlTextarea5"
                              value={editedFields.region}
                              onChange={(e) =>
                                setEditedFields({
                                  ...editedFields,
                                  region: e.target.value,
                                })
                              }
                              required
                              rows="5"
                              placeholder="General information you’d like to share..."
                            />
                          </div>
                          <div className="form-group pt-5">
                            <textarea
                              placeholder="Personal anecdote of experience..."
                              className="form-control"
                              id="exampleFormControlTextarea1"
                              name="experience"
                              value={editedFields.experience}
                              onChange={(e) =>
                                setEditedFields({
                                  ...editedFields,
                                  experience: e.target.value,
                                })
                              }
                              required
                              rows="5"
                            ></textarea>
                          </div>
                          <div className="form-group pt-5">
                            <textarea
                              placeholder="List some important tips..."
                              className="form-control p-3"
                              id="exampleFormControlTextarea2"
                              rows="4"
                              name="description"
                              value={editedFields.description}
                              onChange={(e) =>
                                setEditedFields({
                                  ...editedFields,
                                  description: e.target.value,
                                })
                              }
                              required
                            ></textarea>
                          </div>
                          <div className="form-group pt-5">
                            <textarea
                              placeholder="Additional Links..."
                              className="form-control p-3"
                              id="exampleFormControlTextarea3"
                              rows="4"
                              value={editedFields.links}
                              name="links"
                              onChange={(e) =>
                                setEditedFields({
                                  ...editedFields,
                                  links: e.target.value,
                                })
                              }
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-12 col-lg-1">
                          <div className="row">
                            <div
                              className={`col-12 col-md-12 col-lg-12 text-center ${styles.eventmidicons}`}
                            >
                              <DescriptorRadio
                                descriptor="food"
                                descriptors={descriptors}
                                setDescriptors={setDescriptors}
                                iconSrc={burger}
                              />

                              <DescriptorRadio
                                descriptor="Art"
                                descriptors={descriptors}
                                setDescriptors={setDescriptors}
                                iconSrc={painticon}
                              />

                              <DescriptorRadio
                                descriptor="Hiking"
                                descriptors={descriptors}
                                setDescriptors={setDescriptors}
                                iconSrc={travelicon}
                              />

                              {/* Add more DescriptorRadio components for other descriptors */}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">
                          <div>
                            <div class="responsive-map">
                              <GoogleMapReact
                                bootstrapURLKeys={{ key: `${GoogleMapApiKey}` }} // Replace with your actual API key
                                defaultCenter={
                                  currentLocation ? currentLocation : null
                                }
                                defaultZoom={defaultProps.zoom}
                                center={
                                  currentLocation ? currentLocation : null
                                }
                                onClick={handleMapClick}
                                style={{
                                  width: "12%",
                                  height: "100%",
                                }}
                              >
                                {currentLocation && (
                                  <RoomIcon
                                    lat={currentLocation.lat}
                                    lng={currentLocation.lng}
                                    style={{
                                      color: "#EA4335",
                                    }}
                                  />
                                )}
                              </GoogleMapReact>
                            </div>

                            <div className="col-lg-12 col-12 w-100 pt-2 pt-lg-2 d-flex flex-column align-items-center justify-content-center">
                              <Image
                                width="40"
                                height="30"
                                src={calender}
                                className="mt-3 mb-3 object-fit-cover"
                                alt="calender"
                              />
                              <h5 className="fw-600">Hours of Operation</h5>

                              <div className="w-100">
                                <input
                                  type="text"
                                  name="hours"
                                  className="form-control py-2 w-100"
                                  value={editedFields.hours}
                                  onChange={(e) =>
                                    setEditedFields({
                                      ...editedFields,
                                      hours: e.target.value,
                                    })
                                  }
                                  required
                                  placeholder="Hours of Operation"
                                />
                              </div>
                            </div>
                            <div className="col-lg-12 col-12  pt-2 pt-lg-2 d-flex flex-column align-items-center justify-content-center">
                              <Image
                                width="45"
                                height="30"
                                src={moneyicon}
                                className="mt-3 mb-3"
                                alt="calender"
                              />
                              <h5 className="fw-600">Cost to Attend</h5>
                              <input
                                type="number"
                                name="cost"
                                className="form-control py-2 w-100"
                                value={editedFields.cost}
                                onChange={(e) =>
                                  setEditedFields({
                                    ...editedFields,
                                    cost: e.target.value,
                                  })
                                }
                                required
                                placeholder="Cost to Attend"
                              />
                            </div>
                            <div className="d-flex justify-content-end align-items-end mt-5">
                              <button
                                className="savebtn1 text-light"
                                onClick={() =>
                                  handleSaveClick(filteredData._id)
                                }
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={` col-6 col-md-2 col-lg-1 align-items-center d-flex justify-content-center gap-3 ${styles.eventicon}`}
                    >
                      {/* ... (existing JSX for edit, favorite, like buttons) */}
                      <button
                        onClick={handleEditClick}
                        className="bgdark border-0 py-1 px-3 rounded-5 fw-600"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className={`container-fluid pb-5 ${styles.singleventhero}`}>
          <div className={`row `}>
            <div
              className={`col-lg-7 col-12 col-md-12 mt-3 ${styles.scenerypara}`}
            >
              <div
                className={`row align-items-center ${styles.eventtopsection}`}
              >
                <div className=" col-12 col-md-6  col-lg-12 mt-2 d-flex justify-content-between w-100">
                  <h4 className="fw-600 w-100">{eventDetail?.title}</h4>

                  <div
                    className={`d-flex justify-content-end align-items-center gap-5 w-100 pb-5 px-1 ${styles.faxicon1}`}
                  >
                    <FontAwesomeIcon
                      className="cursor-pointer"
                      icon={faX}
                      onClick={handleIconClick}
                      style={{
                        color: "#818A91",
                      }}
                    />
                  </div>
                </div>
                {/* profile men */}
                <div className="d-flex align-items-center justify-content-start gap-3 mt-3">
                  <Image
                    className={`${styles.menicon} `}
                    src={profile}
                    alt="profile"
                  />
                  <div>
                    <h6 className="fw-600 mb-0">{userInfo?.username}</h6>
                    <p className="mb-0" style={{ fontSize: "14px" }}>
                      {userTotalExp > 0
                        ? `${userTotalExp} ${
                            userTotalExp === 1
                              ? "experience"
                              : "shared experiences"
                          }`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 mt-4">
                  <SliderApps images1={eventDetail?.images} />
                </div>
              </div>
            </div>
            <div className="col-lg-1 col-12 mt-lg-5 mt-2">
              <div className="row ">
                <div
                  className={`col-12 col-md-12 col-lg-12 text-center ${styles.eventmidicons}`}
                >
                  {eventDetail && eventDetail.descriptors && (
                    <>
                      {eventDetail.descriptors.includes("food") && (
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

                      {eventDetail.descriptors.includes("Art") && (
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

                      {eventDetail.descriptors.includes("Hiking") && (
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
            <div className="col-lg-4 col-12 text-align-right p-0 ]">
              <div className={styles.mapbox} style={{ width: "100%" }}>
                <div
                  className={`d-flex justify-content-end align-items-center gap-5 w-100 pb-5 px-1 ${styles.faxicon}`}
                >
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faX}
                    onClick={handleIconClick}
                    style={{
                      color: "#818A91",
                    }}
                  />
                </div>

                <iframe
                  title="Current Location Map"
                  width="100%"
                  height="470"
                  frameBorder="0"
                  style={{ border: "10px", marginTop: "30px" }}
                  src={`https://www.google.com/maps/embed/v1/place?q=${eventDetail?.latitude},${eventDetail?.longitude}&key=${GoogleMapApiKey}`}
                  allowFullScreen
                ></iframe>

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
              <p className={styles.eventtitlepara}>{eventDetail?.region}</p>

              {/* My Experience */}
              <h5 className="fw-600 mt-4">My Experience</h5>
              <p className={styles.eventtitlepara}>{eventDetail?.experience}</p>

              {/* Tips */}
              <h5 className="fw-600 mt-4">Tips</h5>
              <ul>
                <li className={styles.eventtitlepara}>
                  {eventDetail?.description}
                </li>
              </ul>

              {/* Useful Links */}
              <h5 className="fw-600 mt-4">Useful Links</h5>
              <p className={styles.eventtitlepara}>
                {eventDetail?.links
                  ? eventDetail?.links.split("\n").map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                        <br />
                      </a>
                    ))
                  : "This Post has no Links"}
              </p>
            </div>
            <div className="col-12 col-md-5 col-lg-5 d-flex flex-column pt-lg-5 pt-4 align-items-center text-center">
              <div className="mt-3">
                <Image width={50} height={50} src={clock} />
                <h5 className="fw-600 mt-3">Hours of Operation</h5>
                <p className={styles.eventtitlepara}>{eventDetail?.hours}</p>
              </div>
              <div className="mt-5">
                <Image width={50} height={50} src={money} />

                <h5 className="fw-600 mt-3">Cost to Attend</h5>
                <p className={styles.eventtitlepara}>{eventDetail?.cost}$ </p>
              </div>
            </div>
          </div>

          {/* extra */}
          <div className="row d-flex justify-content-end mt-lg-5 mt-3 pt-lg-4 pt-3 px-lg-5  px-2 pb-2">
            <div
              className={`col-md-3 col-lg-3 col-12 align-items-center d-flex justify-content-center gap-3 ${styles.eventicon}`}
            >
              <div className="row gap-3 justify-content-around align-align-items-center ">
                <div
                  className={`d-flex align-items-center justify-content-center col-3 ${styles.eventicondiv}`}
                >
                  <Image
                    onClick={() => setModalShow(true)}
                    className={`${styles.eventtopicons} animated1`}
                    src={plusicon2}
                    alt=""
                  />

                  <div className="text-center w-100  d-flex justify-content-center align-items-center">
                    <Trip
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      setModalShow={setModalShow}
                      images1={eventDetail?.images}
                    />
                  </div>
                </div>

                <div
                  className={`d-flex align-items-center justify-content-center bold1 col-3 ${styles.eventicondiv}`}
                >
                  <div className="animated">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="heartbeat"
                      onClick={() => handleFavoriteClick(eventDetail?._id)}
                      style={{
                        color: selectedItems[eventDetail?._id]
                          ? "red"
                          : "black",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
                {/* LIKE LOGIC  */}
                <div
                  className={`d-flex align-items-center justify-content-center bold1 col-3 ${styles.eventiconbox}`}
                >
                  <div className=" d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="heartbeat text-danger"
                      onClick={() => handleLikeCount(eventDetail._id)}
                    />
                    <h5 className="mx-1 mb-0 fw-600" style={{ width: "80px" }}>
                      {totalLikesData === 1
                        ? `${totalLikesData} Like`
                        : totalLikesData === 0
                        ? ""
                        : `${totalLikesData} Likes`}
                    </h5>
                  </div>
                </div>
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
      )}
    </div>
  );
}

const DescriptorRadio = ({
  descriptor,
  descriptors,
  setDescriptors,
  iconSrc,
}) => {
  return (
    <div className={styles.eventicons}>
      <label>
        <input
          type="checkbox"
          value={descriptor}
          checked={descriptors.includes(descriptor)}
          onChange={() => {
            setDescriptors((prevDescriptors) => {
              const updatedDescriptors = prevDescriptors.includes(descriptor)
                ? prevDescriptors.filter((d) => d !== descriptor)
                : [...prevDescriptors, descriptor];

              console.log("Selected Descriptors:", updatedDescriptors); // Log selected descriptors

              return updatedDescriptors;
            });
          }}
          style={{ display: "none" }}
        />
        <Image
          className={`h-auto cursor-pointer ${styles.foodIcons}`}
          src={iconSrc}
          alt=""
          style={
            descriptors.includes(descriptor)
              ? {
                  border: "2px solid green",
                  borderRadius: "50px",
                }
              : { border: "none" }
          }
        />
      </label>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/singular.module.css";
import calender from "../../public/images/calender.svg";
import moneyicon from "../../public/images/moneyicon.svg";
import burger from "../../public/images/burger.svg";
import painticon from "../../public/images/painticon.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import travelicon from "../../public/images/travelicon.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import GoogleMapReact from "google-map-react";
import {
  fetchRecommendations,
  fetchCreateRecommendations,
} from "../../store/actions/recommendationActions";
import { useDispatch, useSelector } from "react-redux";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close"; // Icon for removing images
import RoomIcon from "@mui/icons-material/Room";
import { GoogleMapApiKey, API_URL } from "../../apiConfig";

const apiKey = process.env.SECRET_KEY;

export default function EditPost() {
  const router = useRouter();
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("");
  const [hours, setHours] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [descriptors, setDescriptors] = useState([]);
  const [links, setLinks] = useState("");
  const [images, setImages] = useState([]);

  const [posts, setPosts] = useState([]);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState("");

  const defaultProps = {
    center: {
      lat: 33.572423,
      lng: 73.14675,
    },
    zoom: 11,
  };

  useEffect(() => {
    // Get the user's current location using the browser's geolocation API
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
    });
  }, []);
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
  console.log("ITS", itineraries);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormDataValid()) {
      alert("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }
    const postId = editPost.id;

    await updatePost(postId, {
      title,
      images,
      cost,
      hours,
      experience,
      location,
      region,
      descriptors,
      description,
      links,
      longitude: currentLocation.lng,
      latitude: currentLocation.lat,
    });

    const newPost = {
      title,
      images,
      cost,
      hours,
      experience,
      location,
      region,
      descriptors,
      description,
      links,
      longitude: currentLocation.lng,
      latitude: currentLocation.lat,
    };

    if (isEditing) {
      // Update existing post in local state
      const updatedPosts = posts.map((post) =>
        post.id === editPost.id ? { ...post, ...newPost } : post
      );
      setPosts(updatedPosts);
    } else {
      // Add new post to local state
      setPosts([...posts, newPost]);
    }

    // Reset form fields and states
    setIsEditing(false);
    setEditPost(null);
    setTitle("");
    setCost("");
    setHours("");
    setExperience("");
    setLocation("");
    setRegion("");
    setDescription("");
    setDescriptors([]);
    setLinks("");
    setImages([]);
  };
  const [editPost, setEditPost] = useState(null);

  // edit post
  const editHandlePost = (post) => {
    setIsEditing(true);
    setEditPost(post);
    if (post) {
      setTitle(post.title || "");
      setCost(post.cost || "");
      setHours(post.hours || "");
      setExperience(post.experience || "");
      setLocation(post.location || "");
      setRegion(post.region || "");
      setDescription(post.description || "");
      setDescriptors(post.descriptors || []);
      setLinks(post.links || "");
      setImages(post.images || []); // Assuming images is an array of file objects
    }
  };

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
      setImages(editPost.images); // Assuming images is an array of file objects
    }
  }, [editPost]);

  const updatePost = async (postId, updatedPostData) => {
    try {
      const response = await axios.put(
        `/api/recommendation/${postId}`,
        updatedPostData
      );

      // Assuming your API returns a success message upon successful update
      console.log(response.data.message); // Log the success message from the server

      // Handle success, redirect user or perform other actions
    } catch (error) {
      // Handle errors, show error message to the user
      console.error("Error updating post:", error);
    }
  };

  const isFormDataValid = () => {
    if (
      !title.trim() || // Title must not be empty
      images.length === 0 || // At least one file must be selected
      !cost.trim() || // Cost must not be empty
      !hours.trim() || // Hours must not be empty
      !experience.trim() || // Experience must not be empty
      !location.trim() || // Location must not be empty
      !region.trim() || // Region must not be empty
      descriptors.length === 0 || // At least one descriptor must be selected
      !description.trim() || // Description must not be empty
      !links.trim() // Links must not be empty
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const isFormFilled = async () => {
      if (
        !title.trim() || // Title must not be empty
        images.length === 0 || // At least one file must be selected
        !cost.trim() || // Cost must not be empty
        !hours.trim() || // Hours must not be empty
        !experience.trim() || // Experience must not be empty
        !location.trim() || // Location must not be empty
        !region.trim() || // Region must not be empty
        descriptors.length === 0 || // At least one descriptor must be selected
        !description.trim() || // Description must not be empty
        !links.trim() // Links must not be empty
      ) {
        setIsFormFilled(false);
      } else {
        setIsFormFilled(true);
      }
    };
    isFormFilled();
  }, [
    title,
    images,
    cost,
    hours,
    experience,
    location,
    region,
    descriptors,
    description,
    links,
  ]);

  const addItinerary = async () => {
    if (!isFormDataValid()) {
      alert("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }
    let newItinerary = {
      title,
      images,
      cost,
      hours,
      experience,
      location,
      region,
      descriptors,
      description,
      links,
      longitude: currentLocation.lng,
      latitude: currentLocation.lat,
    };
    const updatedItineraries = [...itineraries, newItinerary];
    SetItineraries(updatedItineraries);

    //SUbmitiing now

    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    console.log(token, userID, "alihuyar");
    if (!token || !userID) {
      alert("User not authenticated. Please log in.");
      return;
    }

    // Create a new FormData object
    const formData = new FormData();

    // Append fields to the FormData object
    formData.append("userID", userID);
    formData.append("title", title);
    formData.append("cost", cost);
    formData.append("hours", hours);
    formData.append("experience", experience);
    formData.append("location", location);
    formData.append("longitude", currentLocation.lng);
    formData.append("latitude", currentLocation.lat);
    formData.append("region", region);
    formData.append("description", description);
    formData.append("links", links);

    // Append descriptors as an array
    descriptors.forEach((descriptor, index) => {
      formData.append(`descriptors[${index}]`, descriptor);
    });

    // Append images
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
      console.log(images[i]);
    }

    console.log(formData);

    // Dispatch the fetchCreateRecommendations action with formData
    const data = await dispatch(fetchCreateRecommendations(formData, token));
    console.log(data);
    setPosts((prevPosts) => [...prevPosts, data]);

    //making the states empty
    setTitle("");
    setCost("");
    setHours("");
    setExperience("");
    setLocation("");
    setRegion("");
    setDescription("");
    setDescriptors([]);
    setLinks("");
    setImages([]);
  };

  const addItineraryinBackend = async (postsss) => {
    const userID = localStorage.getItem("userID");
    const url = `${API_URL}api/itineraryposts/createItineraryPost`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
        posts: postsss,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilesSelected = (e) => {
    const files = e.target.files;
    const updatedFiles = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        updatedFiles.push(file);
      }
    }
    setImages(updatedFiles);
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedFiles);
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          Please fill in all required fields...
        </div>
      )}
      <div className="container-fluid pb-5">
        {itineraries.length > 0 && (
          <div className={`row ${styles.createdhero}`}>
            <div className="col-12">
              <h3>{itineraries.length > 1 ? "Itinerary" : "Post"}</h3>
              <div className="itinerary-cards" style={{ display: "flex" }}>
                {itineraries.map((itinerary, index) => (
                  <div
                    key={index}
                    style={{
                      marginRight: "10px",
                      borderRadius: "5px",
                      border: "2px solid #7CC5E5", // Specify border style and color here
                      padding: "4px",
                    }}
                  >
                    {itinerary.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={`row ${styles.createdhero}`}>
          <div className={`col-12 ${styles.scenerypara}`}>
            <form
              id="recommendationForm"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="form-group mb-3 d-flex justify-content-between align-items-center gap-3">
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter a title..."
                  style={{ width: "90%" }}
                />
                <div>
                  <button
                    className="bgdark border-0 py-1 px-3 rounded-5 fw-600"
                  >
                    Edit
                  </button>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={` bg-light border-0 rounded-5 position-absolute z-3 p-2 fw-700  cursor-pointer  ${styles.crossbtn}`}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-7 col-md-6 col-12">
                  <div>
                    <div className="row justify-content-between mt-3 ">
                      <div>
                        <div>
                          <label htmlFor="fileInput">
                            <IconButton component="span">
                              <PhotoCameraIcon />
                            </IconButton>
                            Media Assets
                          </label>
                          <input
                            type="file"
                            id="fileInput"
                            //accept="image/*, video/*"
                            accept="image/*"
                            multiple
                            onChange={handleFilesSelected}
                            style={{ display: "none" }}
                            ref={fileInputRef}
                          />
                        </div>

                        <div>
                          <ImageList variant="masonry" cols={3} gap={8}>
                            {images.map((item, index) => (
                              <ImageListItem key={index}>
                                <IconButton
                                  style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                    backgroundColor: "#7CC5E5",
                                    borderRadius: "50%",
                                    padding: "2px",
                                  }}
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <CloseIcon style={{ color: "white" }} />
                                </IconButton>
                                {item.type.startsWith("image/") ? (
                                  <img
                                    src={URL.createObjectURL(item)}
                                    alt={`Image ${index}`}
                                    loading="lazy"
                                  />
                                ) : (
                                  <video controls width="100%">
                                    <source
                                      src={URL.createObjectURL(item)}
                                      type={item.type}
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </ImageListItem>
                            ))}
                          </ImageList>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-5 align-items-center"></div>
                  <div className="form-group pt-5">
                    <input
                      type="text"
                      name="location"
                      className="form-control py-2"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      placeholder="Provide a Location"
                    />
                  </div>
                  <div className="form-group pt-5">
                    <h5 className="fw-600">General Information / Highlights</h5>
                    <textarea
                      type="text"
                      name="region"
                      className="form-control "
                      id="exampleFormControlTextarea5"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      required
                      rows="5"
                      placeholder="General information you’d like to share..."
                    />
                  </div>

                  <div className="form-group mt-5">
                    <h5 className="fw-600"> My Experience</h5>
                    <textarea
                      placeholder="Personal anecdote of experience..."
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      name="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      rows="5"
                    ></textarea>
                  </div>

                  <div className="form-group mt-4">
                    <h5 className="fw-600"> Tips </h5>
                    <textarea
                      placeholder="List some important tips..."
                      className="form-control p-3"
                      id="exampleFormControlTextarea2"
                      rows="4"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group mt-4">
                    <h5 className="fw-600">Useful Links</h5>
                    <textarea
                      placeholder="Additional Links..."
                      className="form-control p-3"
                      id="exampleFormControlTextarea3"
                      rows="4"
                      value={links}
                      name="links"
                      onChange={(e) => setLinks(e.target.value)}
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
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  <div style={{ height: "100vh", width: "100%" }}>
                    <div class="responsive-map">
                      <GoogleMapReact
                        bootstrapURLKeys={{ key: `${GoogleMapApiKey}` }} // Replace with your actual API key
                        defaultCenter={currentLocation ? currentLocation : null}
                        defaultZoom={defaultProps.zoom}
                        center={currentLocation ? currentLocation : null}
                        onClick={handleMapClick}
                        style={{
                          width: "12%",
                          height: "15%",
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
                      {/* {currentLocation && (
                        <div style={{ position: 'absolute', left: 20, backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
                          <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
                          <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
                          <p>Address: {address}</p>
                        </div>
                      )} */}
                    </div>

                    <div className="form-group col-lg-12 col-12 text-center pt-2 pt-lg-2">
                      <Image
                        width="40"
                        height="30"
                        src={calender}
                        className="mt-3 mb-3 object-fit-cover"
                        alt="calender"
                      />
                      <h5 className="fw-600">Hours of Operation</h5>

                      <div className="d-flex justify-content-center align-items-center">
                        <input
                          type="text"
                          name="hours"
                          className="form-control py-2 w-50"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          required
                          placeholder="Hours of Operation"
                        />
                      </div>
                    </div>
                    <div className="form-group col-lg-12 col-12 text-center align-items-center pt-3 pt-lg-5 justify-content-center flex-column d-flex">
                      <Image
                        width="45"
                        height="30"
                        src={moneyicon}
                        className="mt-3 mb-3"
                        alt="calender"
                      />
                      <h5 className="fw-600">Cost to Attend</h5>
                      <div className="d-flex justify-content-center align-items-center">
                        <input
                          type="number"
                          name="cost"
                          className="form-control py-2"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                          required
                          placeholder="Cost to Attend"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {isFormFilled && (
              <div className="d-flex justify-content-end mt-lg-5 mt-4">
                <button
                  className="savebtn1"
                  style={{ marginRight: "50px", color: "white" }}
                  onClick={addItinerary}
                >
                  Add Itinerary
                </button>
              </div>
            )}
            <div className="d-flex justify-content-end mt-lg-5 mt-4">
              <button
                form="recommendationForm"
                type="submit"
                className="savebtn1"
                style={{ marginRight: "50px", color: "white" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
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
          type="radio"
          value={descriptor}
          checked={descriptors.includes(descriptor)}
          onChange={() => {
            setDescriptors((prevDescriptors) => {
              if (prevDescriptors.includes(descriptor)) {
                return prevDescriptors.filter((d) => d !== descriptor);
              } else {
                return [...prevDescriptors, descriptor];
              }
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
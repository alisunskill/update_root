import React, { useEffect, useState } from "react";
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
import FileBase64 from "react-file-base64";

const apiKey = process.env.SECRET_KEY;

const RedMarker = ({ text }) => (
  <div
    style={{
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "red",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {text}
  </div>
);
const CircleMarker = ({ text }) => (
  <div
    style={{
      width: "100px",
      height: "20px",
      borderRadius: "50%",
      background: "blue",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {text}
  </div>
);

export default () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const createRecommendationsData = useSelector(
    (state) => state.recommendation.createRecommendation
  );

  console.log(createRecommendationsData, "createRecommendationsData");

  const userID = useSelector((state) => state.recommendation);
  const { region } = router.query;
  const [storedUserID, setStoredUserID] = useState(null);
  const [storedEmail, setStoredEmail] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [recommendation, setRecommendation] = useState([]);
  const userExists = userID;
  const { recommendations, loading, error } = recommendationsData;
  // console.log(recommendations, "recommendations");
  const goBack = () => {
    router.back();
  };
  // const loading = true;
  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  // api
  const [regionData, setRegion] = useState([]);
  const { descriptor } = router.query;
  const [filteredData, setFilteredData] = useState([]);
  const [showAlert, setShowAlert] = useState(false); // Step 2

  const recommendationData =
    (recommendations && recommendations.Recommendations) || [];
  useEffect(() => {
    setRegion(recommendationData);
  }, [regionData]);

  const regionp = regionData.map((item) => {
    return item.region;
  });

  const regionDescriptor = regionData.map((item) => {
    return item.descriptor;
  });

  // discripttors urls
  useEffect(() => {
    if (descriptor) {
      const filteredDescriptorData = regionData.filter(
        (item) => item.descriptor === descriptor
      );
      setFilteredData(filteredDescriptorData);
    }
  }, [descriptor, regionData]);

  // check warning
  useEffect(() => {
    const userID = localStorage.getItem("userID");
    const email = localStorage.getItem("email");
    setStoredUserID(userID);
    setStoredEmail(email);
  }, []);

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  // console.log(regionDescriptor, "regionDescriptor");
  useEffect(() => {
    if (region) {
      const filteredRegionData = regionData.filter(
        (item) => item.region === region
      );
      setFilteredData(filteredRegionData);
    }
  }, [region, regionData]);
  useEffect(() => {
    if (regionData && descriptor) {
      const filteredDescriptorData = regionData.filter(
        (item) => item.descriptor === descriptor
      );
      setFilteredData(filteredDescriptorData);
    }
  }, [descriptor, regionData]);

  const allLocations = recommendations?.Recommendations?.map((item) => {
    return {
      lat: item.location.coordinates[1],
      lng: item.location.coordinates[0],
      title: item.title,
    };
  });
  // console.log(allLocations, "allregions");
  const [locationInput, setLocationInput] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 31.5204,
    lng: 74.3587,
  });

  const [formData, setFormData] = useState({
    title: "",
    images: [],
    cost: "",
    hours: "",
    experience: "",
    location: { type: "Point", coordinates: [0, 0] },
    region: "",
    descriptors: [],
    description: "",
    links: "",
  });

  console.log(formData, "formData formDataformDataformData");
  const isFormDataValid = () => {
    if (
      !formData.title ||
      formData.images.length === 0 ||
      !formData.cost ||
      !formData.hours ||
      !formData.experience ||
      !formData.location ||
      !formData.region ||
      formData.descriptors.length === 0 ||
      !formData.description ||
      !formData.links
    ) {
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormDataValid()) {
      alert("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("userID");
      console.log(token, userID, "alihuyar");
      if (!token || !userID) {
        alert("User not authenticated. Please log in.");
        return;
      }

      formData.creator = userID;

      dispatch(fetchCreateRecommendations(formData, token));

      alert("Recommendation creation requested. Please wait...");
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setRecommendation((prevRecommendation) => [
        ...prevRecommendation,
        formData,
      ]);

      setFormData({
        title: "",
        images: [],
        cost: "",
        hours: "",
        experience: "",
        descriptors: [],
        location: { type: "Point", coordinates: [0, 0] },
        region: "",
        description: "",
        links: "",
      });

      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create recommendation. Please try again.");
      return;
    }
  };

  const handleMapDoubleClick = (event) => {
    if (typeof window !== "undefined") {
      const latitude = event.lat;
      const longitude = event.lng;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: latitude, lng: longitude } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const locationName = results[0].formatted_address;

            setLocationInput(locationName);
            setFormData({
              ...formData,
              location: { type: "Point", coordinates: [longitude, latitude] },
            });
          }
        }
      );
    }
  };
  const handleApiLoaded = (map, maps) => {
    if (
      typeof window !== "undefined" &&
      loading &&
      recommendations?.Recommendations
    ) {
      recommendations.Recommendations.forEach((location) => {
        const marker = new maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          title: location.title,
        });

        marker.addListener("click", () => {
          alert(`Title: ${location.title}`);
        });
      });
      recommendation.forEach((form) => {
        const formMarker = new maps.Marker({
          position: {
            lat: form.location.coordinates[1],
            lng: form.location.coordinates[0],
          },
          map,
          title: form.title,
        });

        formMarker.addListener("click", () => {
          alert(
            `Title: ${form.title}\nCost: ${form.cost}\nHours: ${form.hours}`
          );
        });
      });
    }
  };

  const handleLocationInputBlur = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: locationInput }, (results, status) => {
      if (status === "OK" && results[0]) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        setFormData({
          ...formData,
          location: { type: "Point", coordinates: [longitude, latitude] },
        });
        setMapCenter({ lat: latitude, lng: longitude });
      }
    });
  };

  const [imageFields, setImageFields] = useState([
    { id: "component1", images: [] },
  ]);
  const onSelectImages = (files, fieldId) => {
    const imageUrlsArray = files.map((file) => file.base64.toString());

    const updatedImageFields = imageFields.map((field) => {
      if (field.id === fieldId) {
        return { ...field, images: imageUrlsArray };
      } else {
        return field;
      }
    });

    setImageFields(updatedImageFields);

    const allImages = updatedImageFields.reduce(
      (accumulator, field) => [...accumulator, ...field.images],
      []
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      images: allImages,
    }));
  };

  const addOneMore = () => {
    if (imageFields.length < 7) {
      const newField = { id: `component${imageFields.length + 1}`, images: [] };
      setImageFields([...imageFields, newField]);
    }
  };

  const handleDescriptorChange = (descriptor) => {
    const updatedDescriptors = [...formData.descriptors];
    if (updatedDescriptors.includes(descriptor)) {
      updatedDescriptors.splice(updatedDescriptors.indexOf(descriptor), 1);
    } else {
      updatedDescriptors.push(descriptor);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      descriptors: updatedDescriptors,
    }));
  };

  return (
    <>
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          Please fill in all required fields.
        </div>
      )}
      <div className="container-fluid pb-5">
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
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Enter a title..."
                  style={{ width: "90%" }}
                />
                <div>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={` bg-light border-0 rounded-5 position-absolute z-3 p-2 fw-700  cursor-pointer  ${styles.crossbtn}`}
                    onClick={goBack}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-7 col-md-6 col-12">
                  <div className="row justify-content-between gap-3 mx-1">
                    <button className="savebtn" onClick={addOneMore}>
                      Add Image
                    </button>
                    <div className="row">
                      {/* image */}
                      <div className="col-lg-6 col-12">
                        {imageFields.map((field) => (
                          <div
                            key={field.id}
                            className={`col-lg-3 form-control-file p-0 custom-file-input parentcontainer`}
                          >
                            <FileBase64
                              multiple
                              onDone={(files) =>
                                onSelectImages(files, field.id)
                              }
                              style={{ width: "100%", height: "500px" }}
                            />
                            <h6 className={styles.addimg}>Add images</h6>
                          </div>
                        ))}
                      </div>
                      {/* video */}
                      <div className="col-lg-6 col-12">
                        {imageFields.map((field) => (
                          <div
                            key={field.id}
                            className={`col-lg-3 form-control-file p-0 custom-file-input parentcontainer`}
                          >
                            <FileBase64
                              multiple
                              onDone={(files) =>
                                onSelectImages(files, field.id)
                              }
                              style={{ width: "100%", height: "500px" }}
                            />
                            <h6 className={styles.addimg}>Add videos</h6>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-5 align-items-center">
                    {/* <div className="form-group col-lg-6 col-12 text-center">
                      <Image
                        width="45"
                        height="30"
                        src={moneyicon}
                        className="mt-3 mb-3"
                        alt="calender"
                      />
                      <input
                        type="number"
                        name="cost"
                        className="form-control py-2"
                        value={formData.cost}
                        onChange={(e) =>
                          setFormData({ ...formData, cost: e.target.value })
                        }
                        required
                        placeholder="Cost to Attend"
                      />
                    </div>
                    <div className="form-group col-lg-6 col-12 text-center">
                      <Image
                        width="40"
                        height="30"
                        src={calender}
                        className="mt-3 mb-3 object-fit-cover"
                        alt="calender"
                      />
                      <input
                        type="text"
                        name="hours"
                        className="form-control py-2"
                        value={formData.hours}
                        onChange={(e) =>
                          setFormData({ ...formData, hours: e.target.value })
                        }
                        required
                        placeholder="Hours of Operation"
                      />
                    </div> */}
                  </div>
                  <div className="form-group pt-5">
                    <input
                      type="text"
                      name="location"
                      className="form-control py-2"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onBlur={handleLocationInputBlur}
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
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
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
                      name="links"
                      onChange={(e) =>
                        setFormData({ ...formData, links: e.target.value })
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
                      <div className={styles.eventicons}>
                        <label>
                          <input
                            type="radio"
                            value="food"
                            checked={formData.descriptors.includes("food")}
                            onChange={(e) =>
                              handleDescriptorChange(e.target.value)
                            }
                            style={{ display: "none" }}
                          />
                          <Image
                            className={`h-auto cursor-pointer ${styles.foodIcons}`}
                            src={burger}
                            alt=""
                            style={
                              formData.descriptors.includes("food")
                                ? {
                                    border: "2px solid green",
                                    borderRadius: "50px",
                                  }
                                : { border: "none" }
                            }
                          />
                        </label>
                      </div>
                      <div className={` ${styles.eventicons}`}>
                        <label>
                          <input
                            type="radio"
                            value="Art"
                            checked={formData.descriptors.includes("Art")}
                            onChange={(e) =>
                              handleDescriptorChange(e.target.value)
                            }
                            style={{ display: "none" }}
                          />
                          <Image
                            className={`h-auto cursor-pointer ${styles.foodIcons}`}
                            src={painticon}
                            alt=""
                            style={
                              formData.descriptors.includes("Art")
                                ? {
                                    border: "2px solid green",
                                    borderRadius: "50px",
                                  }
                                : { border: "none" }
                            }
                          />
                        </label>
                      </div>
                      <div className={` ${styles.eventicons}`}>
                        <label>
                          <input
                            type="radio"
                            value="Hiking"
                            checked={formData.descriptors.includes("Hiking")}
                            onChange={(e) =>
                              handleDescriptorChange(e.target.value)
                            }
                            style={{ display: "none" }}
                          />
                          <Image
                            className={`h-auto cursor-pointer ${styles.foodIcons}`}
                            src={travelicon}
                            alt=""
                            style={
                              formData.descriptors.includes("Hiking")
                                ? {
                                    border: "2px solid green",
                                    borderRadius: "50px",
                                  }
                                : { border: "none" }
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  <div style={{ height: "100vh", width: "100%" }}>
                    {/* <GoogleMapReact
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
                      onDblClick={handleMapDoubleClick}
                      center={mapCenter}
                    >
                      {recommendation?.map((form, index) => (
                        <RedMarker
                          key={index}
                          lat={form.location.coordinates[1]}
                          lng={form.location.coordinates[0]}
                          text={form.title}
                        />
                      ))}
                    </GoogleMapReact> */}
                    <div class="responsive-map">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.7806761080233!2d-93.29138368446431!3d44.96844997909819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b32b6ee2c87c91%3A0xc20dff2748d2bd92!2sWalker+Art+Center!5e0!3m2!1sen!2sus!4v1514524647889"
                        width="600"
                        height="450"
                        frameborder="0"
                        style={{ border: "0" }}
                        allowfullscreen
                      ></iframe>
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
                          value={formData.hours}
                          onChange={(e) =>
                            setFormData({ ...formData, hours: e.target.value })
                          }
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
                          value={formData.cost}
                          onChange={(e) =>
                            setFormData({ ...formData, cost: e.target.value })
                          }
                          required
                          placeholder="Cost to Attend"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="d-flex justify-content-end mt-lg-5 mt-4">
              <button
                form="recommendationForm"
                type="submit"
                className="savebtn1"
                style={{ marginRight: "50px" }}
              >
                Finish
              </button>
            </div>
          </div>

          {/* <div className="col-12 col-lg-1">
            <div className="row">
              <div
                className={`col-12 col-md-12 col-lg-12 text-center ${styles.eventmidicons}`}
              >
                <div className={styles.eventicons}>
                  <label>
                    <input
                      type="radio"
                      value="food"
                      // checked={formData.descriptor === "food"}
                      checked={formData.descriptors.includes("food")}
                      // onChange={(e) =>
                      //   setFormData({ ...formData, descriptor: e.target.value })
                      // }
                      onChange={(e) => handleDescriptorChange(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <Image
                      className={`h-auto cursor-pointer ${styles.foodIcons}`}
                      src={burger}
                      alt=""
                      // style={
                      //   formData.descriptor === "food"
                      //     ? { border: "2px solid green", borderRadius: "50px" }
                      //     : formData.descriptor === {}
                      //     ? { border: "none" }
                      //     : {}
                      // }
                      style={
                        formData.descriptors.includes("food")
                          ? { border: "2px solid green", borderRadius: "50px" }
                          : { border: "none" }
                      }
                    />
                  </label>
                </div>
                <div className={` ${styles.eventicons}`}>
                  <label>
                    <input
                      type="radio"
                      value="Art"
                      // checked={formData.descriptor === "Art"}
                      checked={formData.descriptors.includes("Art")}
                      // onChange={(e) =>
                      //   setFormData({ ...formData, descriptor: e.target.value })
                      // }
                      onChange={(e) => handleDescriptorChange(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <Image
                      className={`h-auto cursor-pointer ${styles.foodIcons}`}
                      src={painticon}
                      alt=""
                      // style={
                      //   formData.descriptor === "Art"
                      //     ? { border: "2px solid green", borderRadius: "50px" }
                      //     : formData.descriptor === {}
                      //     ? { border: "none" }
                      //     : {}
                      // }
                      style={
                        formData.descriptors.includes("Art")
                          ? { border: "2px solid green", borderRadius: "50px" }
                          : { border: "none" }
                      }
                    />
                  </label>
                </div>
                <div className={` ${styles.eventicons}`}>
                  <label>
                    <input
                      type="radio"
                      value="Hiking"
                      // checked={formData.descriptor === "Hiking"}
                      checked={formData.descriptors.includes("Hiking")}
                      // onChange={(e) =>
                      //   setFormData({ ...formData, descriptor: e.target.value })
                      // }
                      onChange={(e) => handleDescriptorChange(e.target.value)}
                      style={{ display: "none" }}
                    />
                    <Image
                      className={`h-auto cursor-pointer ${styles.foodIcons}`}
                      src={travelicon}
                      alt=""
                      // style={
                      //   formData.descriptor === "Hiking"
                      //     ? { border: "2px solid green", borderRadius: "50px" }
                      //     : formData.descriptor === {}
                      //     ? { border: "none" }
                      //     : {}
                      // }
                      style={
                        formData.descriptors.includes("Hiking")
                          ? { border: "2px solid green", borderRadius: "50px" }
                          : { border: "none" }
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="col-lg-6 text-align-right p-0">
            <div style={{ height: "100vh", width: "100%" }}>
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
                onDblClick={handleMapDoubleClick}
                center={mapCenter}
              >
                {recommendation?.map((form, index) => (
                  <RedMarker
                    key={index}
                    lat={form.location.coordinates[1]}
                    lng={form.location.coordinates[0]}
                    text={form.title}
                  />
                ))}
              </GoogleMapReact>
            </div>
          </div> */}
        </div>

        {/* <div className="text-center mt-lg-5 mt-4">
          <button
            form="recommendationForm"
            type="submit"
            className="savebtn"
            style={{ marginRight: "50px" }}
          >
            Save
          </button>
        </div> */}
      </div>
    </>
  );
};

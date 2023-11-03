import { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import plusicon2 from "../public/images/plusicon2.svg";
import profile from "../public/images/men.svg";
import styles from "../styles/home.module.css";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import burger from "../public/images/burger.svg";
import money from "../public/images/moneyicon.svg";
import clock from "../public/images/clockicon.svg";
import saveicon from "../public/images/saveicon.png";
import moneyicon from "../public/images/moneyicon.svg";
import painticon from "../public/images/painticon.svg";
import travelicon from "../public/images/travelicon.svg";
import axios from "axios";
import { deleteSavePost } from "../store/actions/savePostAction";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";


import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import NearSlider from "../pages/HomePage/component/NearSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sculture from "../public/images/descriptors/sculture.svg";
import sthrills from "../public/images/descriptors/sthrills.svg";
import sfood from "../public/images/descriptors/sfood.svg";

import sfgroup from "../public/images/descriptors/sfgroup.svg";
import sfamily from "../public/images/descriptors/sfamily.svg";
import shanged from "../public/images/descriptors/shanged.svg";

import sguitar from "../public/images/descriptors/sguitar.svg";
import snature from "../public/images/descriptors/snature.svg";
import srelaxation from "../public/images/descriptors/srelaxation.svg";

import SliderApps from "../pages/HomePage/SliderApps";
import Trip from "../website/ViewSaves/components/Trip";
import Image from "next/image";
import SliderApps2 from "../pages/HomePage/SliderApps2";
import { GoogleMapApiKey, Files_URL, API_URL } from "../apiConfig";
const ItenraryRecommendationGrid = ({
  setlikes,
  likes,
  itenraryID,
  data,
  userID,
  itTitle,
  loading,
  error,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [numColumns, setNumColumns] = useState(4);
  const [postDetailId, setPostDetailId] = useState(data[0]._id);
  const [userId, setUserid] = useState(userID);
  const [eventDetail, setEventDetail] = useState(data[0]);
  const [userInfo, setUserInfo] = useState({});
  const [userTotalExp, setuserTotalExp] = useState(0);
  const [itenraryData, setItenraryData] = useState(data);
  const [modalShow, setModalShow] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);

  const [isOwnPost, setIsOwnPost] = useState(false);
  //alert(itenraryID)

  const handleIconClick = () => {
    router.back();
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const url = `${API_URL}api/users/userInfo`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setUserInfo(data.data);
            // isPostAlreadySaved(data.data._id)
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
    const getTotalExperiencesOfUser = async () => {
      try {
        const url = `${API_URL}api/recommendations/UserTotalRecommendations`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userId,
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
    const checkUserOwnership = async () => {
      const useridd = localStorage.getItem("userID");
      if (userID == useridd) {
        setIsOwnPost(true);
      }
    };

    getUserInfo();
    getTotalExperiencesOfUser();

    checkUserOwnership();
  }, [userId]);

  useEffect(() => {
    const isPostAlreadySaved = async () => {
      try {
        const url = `${API_URL}api/savepost/isAlreadySave`;
        const userIDss = localStorage.getItem("userID");

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: itenraryID,
            userID: userIDss,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setIsPostSaved(true);
          } else {
            setIsPostSaved(false);
          }
        } else {
          // Handle HTTP error if needed
        }
      } catch (error) {
        // Handle fetch or other errors
        console.error(error);
      }
    };
    isPostAlreadySaved();
  }, [postDetailId]);
  useEffect(() => {
    const isItenraryAlreayLiked = async () => {
      try {
        const url = `${API_URL}api/itineraryposts/userLikedItinerary`;
        const userIDss = localStorage.getItem("userID");

        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itineraryID: itenraryID,
            userID: userIDss,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setIsPostLiked(true);
          } else {
            setIsPostLiked(false);
          }
        } else {
          // Handle HTTP error if needed
        }
      } catch (error) {
        // Handle fetch or other errors
        console.error(error);
      }
    };
    isItenraryAlreayLiked();
  }, [itenraryID]);

  useEffect(() => {
    window.addEventListener("resize", updateNumColumns);
    updateNumColumns();
    return () => {
      window.removeEventListener("resize", updateNumColumns);
    };
  }, []);
  const updateNumColumns = () => {
    if (window.innerWidth >= 1500) {
      setNumColumns(5);
    } else if (window.innerWidth >= 1200) {
      setNumColumns(4);
    } else if (window.innerWidth >= 768) {
      setNumColumns(3);
    } else if (window.innerWidth >= 500) {
      setNumColumns(2);
    } else {
      setNumColumns(1);
    }
  };
  const sendFavListToBackend = async () => {
    const useridd = localStorage.getItem("userID");
    
    try {
      const response = await axios.post(`${API_URL}api/savepost`, {
        postId: [itenraryID],
        userID: useridd,
      });
      setIsPostSaved(true);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };
  const handleLikeCount = async () => {
    try {
      const url = `${API_URL}api/itineraryposts/addItneraryLike`;
      const userIDs = localStorage.getItem("userID");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itineraryID: itenraryID,
          userID: userIDs,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          setItenraryData(data.data.posts);
          setIsPostLiked(true);
          setlikes(data.data.likes);
        } else {
          setItenraryData(data.data.posts);
          setlikes(data.data.likes);
          setIsPostLiked(false);
        }
      } else {
        // Handle HTTP error if needed
      }
    } catch (error) {
      // Handle fetch or other errors
      console.error(error);
    }
  };

  const handleRemove = async () => {
    dispatch(deleteSavePost(itenraryID));

    setIsPostSaved(false);
  };

  return (
    <>
      <div className="px-lg-3 px-2">
        <div
          className={`container-fluid pb-5 mb-lg-3 px-lg-5 px-3 ${styles.singleventhero}`}
        >
          <div className="d-flex mt-2">
            <h4 className="fw-600 w-100 text-center d-flex justify-content-center align-items-center">
              {itTitle}
            </h4>

            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faX}
              onClick={handleIconClick}
              style={{
                color: "#818A91",
              }}
            />
          </div>
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
                      className="cursor-pointer d-none"
                      icon={faX}
                      // onClick={handleIconClick}
                      style={{
                        color: "#818A91",
                      }}
                    />
                  </div>
                </div>
                {/* profile men */}
                <div className="d-flex align-items-center justify-content-start gap-3 mt-3">
                  {userInfo?.dp && (
                    <img
                      className={`${styles.menicon} `}
                      src={`${Files_URL}${userInfo?.dp}`}
                      alt="profile"
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                  <div>
                    <h6
                      className="fw-600 mb-0"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (isOwnPost) {
                          router.push("/profile");
                        } else {
                          router.push({
                            pathname: "/anotherProfile",
                            query: {
                              id: JSON.stringify(userID),
                            },
                          });
                          // router.push(
                          //   `/anotherProfile/${encodeURIComponent(userInfo?.username.replace(/ /g, "-"))}?id=${postUserID}`
                          // );
                        }
                      }}
                    >
                      {userInfo?.username}
                    </h6>

                    <p className="mb-0" style={{ fontSize: "14px" }}>
                      {userTotalExp > 0
                        ? `${userTotalExp} ${
                            userTotalExp === 1
                              ? "experience"
                              : "shared experiences"
                          }`
                        : "No Experience"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 mt-4">
                  {/* {data.map((item) => { */}
                  <div className="container-fluid">
                    <div className="row p-0">
                      <div className="col-12 p-0 pt-3">
                        {itenraryData &&
                          itenraryData?.map((item, index) => {
                            return (
                              <div key={index} className={styles.boxslider}>
                                <div
                                  className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                                  onClick={() => {
                                    setPostDetailId(item._id);
                                    setEventDetail(item);
                                  }}
                                >
                                  {/* <Link
                            href={`/eventdetail/${encodeURIComponent(
                              item.title.replace(/ /g, "-")
                            )}?id=${item._id}`}
                            className="w-100"
                          > */}
                                  <img
                                    className={styles.uploadimg}
                                    src={`${Files_URL}${item.images[0]}`}
                                    alt="Uploaded Image"
                                  />
                                  {/* </Link> */}

                                  <div
                                    style={{
                                      position: "absolute ",
                                      zIndex: 999,
                                    }}
                                  >
                                    <div className="text-center">
                                      {/* <p className={`mb-0 letterspac text-white`}>
                                Event
                              </p> */}
                                      <h3 className="w-700 text-white">
                                        {item.title.length <= 40
                                          ? item.title
                                          : `${item.title.slice(0, 40)}...`}
                                      </h3>
                                      <p className={`mb-0 m1 text-white`}>
                                        {item.location}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <SliderApps2 images1={eventDetail?.images} />
                </div>
              </div>
            </div>
            {/* <div className="col-lg-1 col-12 mt-lg-5 mt-2">
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
            </div> */}
            <div className="col-lg-5 col-md-12 col-12 text-align-right p-0">
              <div className={styles.mapbox} style={{ width: "100%" }}>
                <div
                  className={`d-flex justify-content-end align-items-center gap-5 w-100 pb-5 px-1 ${styles.faxicon}`}
                >
                  <FontAwesomeIcon
                    className="cursor-pointer d-none"
                    icon={faX}
                    // onClick={handleIconClick}
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
              </div>

              <div className="d-flex justify-content-center flex-column align-items-center gap-3  px-4">
                <div className="col-12 col-md-12 col-lg-12 d-flex flex-column pt-lg-5 pt-4 align-items-center text-center">
                  <div className="mt-3">
                    <Image width={50} height={50} src={clock} />
                    <h5 className="fw-600 mt-3">Hours of Operation</h5>
                    <p className={styles.eventtitlepara}>
                      {eventDetail?.hours}
                    </p>
                  </div>
                  <div className="mt-5">
                    <Image width={50} height={50} src={money} />

                    <h5 className="fw-600 mt-3">Cost to Attend</h5>
                    <p className={styles.eventtitlepara}>
                      {eventDetail?.cost && eventDetail?.currency
                        ? `${eventDetail?.cost} ${eventDetail?.currency}`
                        : "Cost information not available"}
                    </p>
                  </div>
                </div>
                {/* descriptor */}
                <div className="row justify-content-lg-start justify-content-center pt-lg-3 pt-5 mb-3 w-100">
                  <div
                    className={`col-12 col-md-12 px-lg-0 px-3 col-lg-12 d-flex flex-wrap   ${styles.eventmidicons}`}
                  >
                    <div className="d-flex flex-wrap justify-content-lg-around gap-lg-5 gap-4 justify-content-between text-center">
                      {eventDetail && eventDetail.descriptors && (
                        <>
                          {eventDetail.descriptors.includes("food") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={sculture}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Arts & Culture
                              </label>
                            </div>
                          )}

                          {eventDetail.descriptors.includes("Art") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={sthrills}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Adventure
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("Hiking") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={sfood}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Food & Drinks
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("family") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={sfamily}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Family Friendly{" "}
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("fgroup") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={sfgroup}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Group Friendly{" "}
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("hanged") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={shanged}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Local Hangout
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("guitar") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={sguitar}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />

                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Music & Dance
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("nature") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={snature}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Nature
                              </label>
                            </div>
                          )}
                          {eventDetail.descriptors.includes("relaxation") && (
                            <div className="flex-column d-flex justify-content-center align-items-center text-center">
                              <Image
                                className={`h-auto ${styles.foodIcons}`}
                                src={srelaxation}
                                alt=""
                                style={{
                                  border: "2px solid green",
                                  borderRadius: "50px",
                                }}
                              />
                              <label className="fw-600 cgray pt-lg-3 pt-2">
                                Relaxation
                              </label>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* General info */}
          <div className="row mt-3 py-3">
            <div className="col-12 col-md-7 col-lg-7 ">
              {/* General Information / Highlights */}
              {eventDetail?.region && (

              <h5 className="fw-600 mt-4">General Information / Highlights</h5>
              )}
              <p className={styles.eventtitlepara}>{eventDetail?.region}</p>
              {/* My Experience */}
              {eventDetail?.experience && (

              <h5 className="fw-600 mt-4">My Experience</h5>
              )}
              <p className={styles.eventtitlepara}>{eventDetail?.experience}</p>

              {/* Tips */}
              {eventDetail?.description && eventDetail?.description != "•" && (
                <h5 className="fw-600 mt-4">Tips</h5>
              )}
              {eventDetail?.description.trim()!="•" && (

                <ul>
                  {eventDetail?.description?.split('\n').map((item, index) => (
                    <li className={styles.eventtitlepara} key={index}>
                      {item.trim().replace(/•/g, '')}
                    </li>
                  ))}
                </ul>
              )}
              {/* Useful Links */}
              {eventDetail?.links && (
              <h5 className="fw-600 mt-4">Useful Links</h5>
              )}
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
                  : ""}
              </p>
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
                  style={{
                    height: '17px',
                    width: '17px',
                    borderRadius: '50%',
                  }}
                >
                  <Image
                    onClick={() => {
                      const userIdsLogin = localStorage.getItem("userID");

                      if (!userIdsLogin) {
                        Swal.fire({
                          title: "Access Denied",
                          text: "Please login to your account to get more details",
                          icon: "warning",
                        });
                        router.push("/login");
                      }
                      else {
                        setModalShow(true)
                      }
                    }}
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
                      post={itenraryID}
                    />
                  </div>
                </div>

                {/* <div
                  className={`d-flex align-items-center justify-content-center bold1 col-3 ${styles.eventicondiv}`}
                  style={{
                    border: isPostSaved ? '2px solid red' : '2px solid black',
                    borderRadius: '5px', // Optional, for rounded corners
                    borderRadius: "50%",
                  }}
                  onClick={() => {
                    if(isPostSaved){
                      handleRemove(eventDetail?._id)
                    }
                    else  {
                    sendFavListToBackend(eventDetail?._id)
                    }
                  }}
                >
                  <div
                    className={`d-flex align-items-center justify-content-center bold1 col-3`}

                  >
                    <div
                      

                    >
                      
                      <Image width={20} height={20} src={saveicon} />
                    </div>
                  </div>
                  
                </div> */}
                {/* LIKE LOGIC  */}
                <div
                  className={`d-flex align-items-center justify-content-center bold1 col-3 ${styles.eventiconbox}`}
                >
                  <div className=" d-flex align-items-center justify-content-center" >
                    <FontAwesomeIcon
                      icon={faHeart}
                      onClick={() => {
                        const userIdsLogin = localStorage.getItem("userID");

                        if (!userIdsLogin) {
                          Swal.fire({
                            title: "Access Denied",
                            text: "Please login to your account to get more details",
                            icon: "warning",
                          });
                          router.push("/login");
                        }
                        else {
                          if (isPostSaved) {
                            handleRemove();
                          } else {
                            sendFavListToBackend(eventDetail?._id);
                          }
                        }
                      }}
                      style={{
                        color: isPostSaved ? "red" : "black",
                        cursor: "pointer",
                        fontSize: "24px", // Adjust the size as needed
                      }}
                    />
                    {/* <h5 className="mx-1 mb-0 fw-600" style={{ width: "80px" }}>
                      {eventDetail?.likes?.length === 1
                        ? `${eventDetail?.likes?.length} Like`
                        : eventDetail?.likes?.length === 0
                          ? ""
                          : `${eventDetail?.likes?.length} Likes`}
                    </h5> */}
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
      </div>
    </>
  );
};

export default ItenraryRecommendationGrid;
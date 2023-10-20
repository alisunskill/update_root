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

import Link from "next/link";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import NearSlider from "../pages/HomePage/component/NearSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SliderApps from "../pages/HomePage/SliderApps";
import Trip from "../website/ViewSaves/components/Trip";
import Image from "next/image";
import SliderApps2 from "../pages/HomePage/SliderApps2";
import { GoogleMapApiKey, Files_URL, API_URL } from "../apiConfig";
const ItenraryRecommendationGrid = ({ data, userID, loading, error }) => {
  const router = useRouter();
  const [numColumns, setNumColumns] = useState(4);
  const [postDetailId, setPostDetailId] = useState(data[0]._id);
  const [userId, setUserid] = useState(userID);
  const [eventDetail, setEventDetail] = useState(data[0]);
  const [userInfo, setUserInfo] = useState({});
  const [userTotalExp, setuserTotalExp] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState(false);

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

    getUserInfo();
    getTotalExperiencesOfUser();
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
            postId: postDetailId,
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
  const sendFavListToBackend = async (id) => {
    const useridd = localStorage.getItem("userID");
    try {
      const response = await axios.post(`${API_URL}api/savepost`, {
        postId: [id],
        userID: useridd,
      });
      setIsPostSaved(true);
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };
  const handleLinkClick = (itemId, postTitle, item) => {
    router.push(
      {
        pathname: "/Itenraries",
        query: {
          id: JSON.stringify(item._id),
        },
      },
      undefined, // The second argument is for the "as" option, set it to undefined
      { shallow: true } // Use shallow routing to prevent adding the new page to the browser's history
    );
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row px-lg-5 px-2">
          <div className="col-12 pt-3">
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={data.length}
              next={data}
            >
              <Box>
                <Masonry columns={numColumns} spacing={1}>
                  {data &&
                    data?.map((item, index) => {
                      return (
                        <div key={index} className="">
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

                            <div style={{ position: "absolute ", zIndex: 999 }}>
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
                </Masonry>
              </Box>
            </InfiniteScroll>
          </div>
        </div>
      </div>
      <div className="px-lg-3 px-2">
        <div
          className={`container-fluid pb-5 mb-lg-3 px-lg-5 px-3 ${styles.singleventhero}`}
        >
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
                        : "No Experience"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 mt-4">
                  {/* {data.map((item) => { */}
                  <SliderApps2 images1={eventDetail?.images} />
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
                <p className={styles.eventtitlepara}>{eventDetail?.cost}$</p>
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
                  {/* <div className="text-center w-100  d-flex justify-content-center align-items-center">
                    <Trip
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    setModalShow={setModalShow}
                    images1={eventDetail?.images}
                    />
                  </div> */}
                </div>

                <div
                  className={`d-flex align-items-center justify-content-center bold1 col-3`}
                >
                  <div className="animated">
                    <Image width={35} height={35} src={saveicon} />
                    {/* <FontAwesomeIcon
                      icon={faHeart}
                      className="heartbeat"
                      onClick={() => sendFavListToBackend(eventDetail?._id)}
                      style={{
                        color: isPostSaved
                          ? "red"
                          : "black",
                        cursor: "pointer",
                      }}
                    /> */}
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
                      {/* {totalLikesData === 1
                      ? `${totalLikesData} Like`
                      : totalLikesData === 0
                      ? ""
                      : `${totalLikesData} Likes`} */}
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
      </div>
    </>
  );
};

export default ItenraryRecommendationGrid;
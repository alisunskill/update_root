import React, { useState, useEffect } from "react";
import newsletterimg from "../../public/images/card-two.svg";
import styles from "../../styles/viewsave.module.css";
import NewsLetter from "../../website/components/NewsLetter";
import Image from "next/image";
import Trip from "./components/Trip";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@mui/material";
import { Masonry } from "@mui/lab";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  fetchSavePosts,
  deleteSavePost,
} from "../../store/actions/savePostAction";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1663583784667-4a2a386fec62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1622397815608-359540676c67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1550850839-8dc894ed385a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=875&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1587162146766-e06b1189b907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=956&q=80",
  },
];

function ViewSaves() {
  const router = useRouter();
  const dispatch = useDispatch();

  const savePostsData = useSelector(
    (state) => state.saveposts.savepost?.savePosts
  );
  const delPostData = useSelector((state) => state.saveposts);
  useEffect(() => {
    dispatch(fetchSavePosts());
  }, [dispatch]);

  const [postCounts, setPostCounts] = useState({});
  const [postIds, setPostIds] = useState([]);
  console.log(postCounts, "post id is here");
  const [trigger, setTrigger] = useState(new Date());
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  const recommendationData = recommendations.Recommendations || [];
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image

  // const filteredRegion = recommendationData.filter(
  //   (item) => item.id === postIds.map((item) => item.id)
  // );
  // console.log(filteredRegion, "filteredRegion");

  const filteredRegion = recommendationData.filter((item) =>
    postIds?.some((post) => post.id === item.id)
  );

  console.log(
    filteredRegion,
    "filteredRegionfilteredRegionfilteredRegionfilteredRegion"
  );

  const [modalShow, setModalShow] = useState(false);
  // const [userId, setUserId] = useState(null);
  // const fetchPostIds = async () => {
  //   const userID = localStorage.getItem("userID");
  //   // console.log(userID, "userID");
  //   // if (!userID) {
  //   //   console.error("User ID not available.");
  //   //   alert("User ID not available");
  //   //   return;
  //   // }

  //   // try {
  //   //   const response = await axios.get(
  //   //     `http://localhost:8000/api/savepost?userID=${userID}`
  //   //   );
  //   //   const data = response.data;
  //   //   const { savePosts } = data;

  //   //   setPostIds(savePosts);
  //   //   // const postIdList = savePosts.map((post) => post.postId);
  //   //   // console.log(postIdList, "postIdListpostIdListpostIdListpostIdList");
  //   // } catch (error) {
  //   //   console.error("Error fetching data:", error);
  //   // }
  //   setPostIds(savePostsData)
  // };

  useEffect(() => {
    if (savePostsData) {
      setPostIds(savePostsData);
    }
  }, [savePostsData, trigger]);

  useEffect(() => {
    if (savePostsData) {
      const counts = {};
      for (const savedPost of savePostsData) {
        const postId = savedPost.postId;
        counts[postId] = (counts[postId] || 0) + 1;
      }
      setPostCounts(counts);
    }
  }, [savePostsData, trigger]);

  useEffect(() => {
    if (postCounts) {
      localStorage.setItem("postCounts", JSON.stringify(postCounts));
    }
  }, [postCounts]);

  // useEffect(() => {
  //   fetchPostIds();
  // }, [trigger]);

  // const handleRemove = async (postId) => {
  //   const userID = localStorage.getItem("userID");
  //   if (!userID) {
  //     console.error("User ID not available.");
  //     return;
  //   }

  //   try {
  //     await axios.delete(`http://localhost:8000/api/savepost/${postId}`, {
  //       headers: {
  //         Authorization: `Bearer ${userID}`,
  //       },
  //     });

  //     setPostIds((prevPostIds) =>
  //       prevPostIds.filter((post) => post !== postId)
  //     );
  //     setTrigger(new Date());
  //     // console.log("Post deleted successfully.");
  //     // alert("Post deleted successfully.")
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //   }
  // };
  const handleRemove = async (postId) => {
    dispatch(deleteSavePost(postId));
    setPostIds((prevPostIds) => prevPostIds.filter((post) => post !== postId));
    setTrigger(new Date());
  };

  // const handleLinkClick = (postId) => {
  //   Cookies.set("postIdCookie", postId);
  //   // router.push(`/region/${encodeURIComponent(post.title)}`);
  // };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-4">
          <h1 className="dark bold fw-700 pt-4 text-center mb-4">Your Saves</h1>

          <div className="col-lg-12">
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={postIds?.length}
              loader={<h4>Loading...</h4>}
            >
              <Box sx={{ minHeight: 829 }}>
                <Masonry
                  columns={3}
                  spacing={2}
                  style={{ display: "-webkit-inline-box" }}
                >
                  {filteredRegion.map((post, index) => {
                    const imageUrl = post.images;

                    const matchingPostId = postIds.find(
                      (item) => item.postId === post._id
                    );
                    if (matchingPostId) {
                      return (
                        <div key={index}>
                          <div className="position-relative">
                            <div className="col-lg-12 ">
                              <FontAwesomeIcon icon="fa-solid fa-plus" />
                              <FontAwesomeIcon
                                // onClick={() => setModalShow(true)}
                                onClick={() => {
                                  setSelectedImage(post.images[0]);
                                  setModalShow(true);
                                }}
                                className={`${styles.plusicon} animated1 bg-light rounded-5 fw-700 text-dark border-0 position-absolute z-3 p-2.5 fw-700`}
                                icon={faPlus}
                                style={{ left: "13px" }}
                              />
                            </div>
                            <FontAwesomeIcon
                              icon={faTimes}
                              className={`animated1 bg-light rounded-5 fw-700 text-dark border-0 position-absolute z-3 p-2.5 fw-700 ${styles.crosicon}`}
                              onClick={() =>
                                handleRemove(matchingPostId.postId)
                              }
                            />
                          </div>
                          <Link
                            key={index}
                            // onClick={() => handleLinkClick(post._id)}
                            // href={`/region/${encodeURIComponent(
                            //   post.title.replace(/ /g, "-")
                            // )}`}
                            href={`/eventdetail/${encodeURIComponent(
                              post.title.replace(/ /g, "-")
                            )}?id=${post._id}`}
                            className={styles.savelink}
                          >
                            {/* <img
                                layout="fill"
                                objectFit="cover"
                                src={`${
                                  itemData[index % itemData.length].img
                                }?w=162&auto=format`}
                                srcSet={`${
                                  itemData[index % itemData.length].img
                                }?w=162&auto=format&dpr=2 2x`}
                                className={styles.placeImg}
                                loading="lazy"
                                style={{
                                  display: "block",
                                  width: "100%",
                                  borderRadius: "15px",
                                  opacity: "0.99990000999",
                                }}
                              /> */}

                            {/* <img
            src={firstImage}
            alt="save image"
          /> */}

                            <img
                              className={styles.uploadimg}
                              src={post.images[0]}
                              alt="Uploaded Image"
                            />

                            <div
                              style={{ position: "absolute ", zIndex: 999 }}
                              className="text-center"
                            >
                              <p className={`mb-0 letterspac text-white`}>
                                Event
                              </p>
                              <h3 className="w-700 text-white">{post.title}</h3>
                              <p className={`mb-0 m1 text-white`}>
                                {post.region}
                              </p>
                            </div>
                          </Link>
                        </div>
                      );
                    }
                  })}
                  <div className="text-center w-100  d-flex justify-content-center align-items-center">
                    <Trip
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      setModalShow={setModalShow}
                      selectedImage={selectedImage}
                    />
                  </div>
                </Masonry>
              </Box>
            </InfiniteScroll>
          </div>

          {/* <div className="col-lg-4 first-card position-relative">
              <div
                className={` d-flex flex-column justify-content-center align-items-center text-center  ${styles.yoursave_image1}`}
              >
                <div className="col-lg-12 yoursave_text">
                  <FontAwesomeIcon
                    className={styles.plusicon}
                    icon={faPlus}
                  />
                  <div className="text-center w-100  d-flex justify-content-center align-items-center">
                    <Trip
                      
                    
                    />
                  </div>{" "}
                  <p className="letterspac">ITINERARY</p>
                  <h3 className="landingeventheading"> Saved Activity 1 </h3>
                  <p className="mb-0 fw-500">Paris, France</p>
                </div>
              </div>
              <div className="row ">
                <div className="col-lg-12 col-md-12 pt-0 mt-0">
                  <div
                    className={`row  d-flex justify-content-center align-items-center ${styles.landingendcard1}`}
                    style={{ background: "white" }}
                  >
              
                    {eventData1.map((item, index) => {
                      return (
                        <PlaceFullSubCard
                          key={index}
                          imageUrl={item.bgImg}
                          showIcon={showIcon}
                          itinerary={item.itinerary}
                          title={item.title}
                          place={item.place}
                          time={item.time}
                          setModalShow={setModalShow}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="row">
                <div className="col-lg-12 col-md-12 pt-0 mt-0">
                  <div
                    className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                    style={{ background: "white" }}
                  >
                    <Trip show={modalShow} onHide={() => setModalShow(false)} />
                    {eventData.map((item, index) => {
                      return (
                        <PlaceFullSubCard
                          key={index}
                          imageUrl={item.bgImg}
                          showIcon={showIcon}
                          itinerary={item.itinerary}
                          title={item.title}
                          place={item.place}
                          time={item.time}
                          setModalShow={setModalShow}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 first-card">
                  <div className={styles.yoursave_image1}>
                    <div
                      className={`col-lg-12 position-relative d-flex flex-column justify-content-center align-items-center text-center  ${styles.yoursave_text}`}
                    >
                      <FontAwesomeIcon
                        className={styles.plusicon2}
                        icon={faPlus}
                      />
                    
                      <p className="fw-500 ltr-shrt-spec">ITINERARY</p>
                      <h3 className="landingeventheading"> Saved Activity 1 </h3>
                      <p className="mb-0 fw-500">Paris, France</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div
                    className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                    style={{ background: "white" }}
                  >
                    {eventData2.map((item, index) => {
                      return (
                        <PlaceFullSubCard
                          key={index}
                          imageUrl={item.bgImg}
                          showIcon={showIcon}
                          itinerary={item.itinerary}
                          title={item.title}
                          place={item.place}
                          time={item.time}
                          setModalShow={setModalShow}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div> */}
        </div>
      </div>

      <div>
        <NewsLetter
          newsletterimg={newsletterimg}
          heading={"Subscribe to our Newsletter"}
          title={"Get Special Offers and more from Traveller"}
          para={
            "Subscribe to see secret deals prices drop the moment you sign up!"
          }
        />
      </div>
      <br />
    </>
  );
}

export default ViewSaves;

import React, { useState, useEffect } from "react";
import newsletterimg from "../../public/images/card-two.svg";
import styles from "../../styles/viewsave.module.css";
import NewsLetter from "../../website/components/NewsLetter";
import Trip from "./components/Trip";
// import Trip from "../UpcomingTrips/components/Trip";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterPosts from "../../pages/HomePage/component/FilterPosts";
import { Box } from "@mui/material";
import { Masonry } from "@mui/lab";
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
import { Files_URL } from "../../apiConfig";

function ViewSaves() {
  const router = useRouter();
  const dispatch = useDispatch();

  const savePostsData = useSelector(
    (state) => state.saveposts.savepost?.savePosts
  );
  const delPostData = useSelector((state) => state.saveposts);

  // useEffect(() => {
  //   dispatch(fetchSavePosts());
  // }, [dispatch]);
  useEffect(() => {
    dispatch(fetchSavePosts())
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [dispatch]);

  const [postCounts, setPostCounts] = useState({});
  const [postIds, setPostIds] = useState([]);
  console.log(postCounts, "post id is here");
  const [trigger, setTrigger] = useState(new Date());
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  const recommendationData = recommendations?.Recommendations || [];
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [numColumns, setNumColumns] = useState(4);
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

  useEffect(() => {
    window.addEventListener("resize", updateNumColumns);
    updateNumColumns();
    return () => {
      window.removeEventListener("resize", updateNumColumns);
    };
  }, []);

  const filteredRegion = recommendationData.filter((item) =>
    postIds?.some((post) => post.id === item.id)
  );

  console.log(
    filteredRegion,
    "filteredRegionfilteredRegionfilteredRegionfilteredRegion"
  );

  const [modalShow, setModalShow] = useState(false);

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

  const handleRemove = async (postId) => {
    dispatch(deleteSavePost(postId));
    setPostIds((prevPostIds) => prevPostIds.filter((post) => post !== postId));
    setTrigger(new Date());
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-lg-4 px-2">
          <div className="col-12">
            <div className="row align-items-center justify-content-start flex-wrap  pt-lg-0 pt-3">
              <div
                className={`col-lg-4 col-md-4 col-6 d-flex justify-content-start mb-lg-0 mb-3 px-lg-2 px-1 ${styles.filterbox}`}
              >
                <FilterPosts />
              </div>
              <div className="col-lg-4 col-md-4 col-6 pb-lg-3 pb-0">
                <h1 className="dark bold fw-700 pt-lg-0 text-center  mb-lg-3 mb-3 experience-saves-header">
                  Your Saves
                </h1>
              </div>
              <div className="col-lg-4 col-md-4 col-6 d-flex justify-content-lg-end justify-content-start px-lg-4 px-2 pb-lg-3 pt-lg-0 pt-2 pb-md-1">
                <div className="d-flex gap-3">
                  <button className="rounded-5 bg-gray1 border-0 px-3 py-1 fw-600">
                    <Link
                      href="/infinitescroll"
                      className="text-decoration-none text-light"
                    >
                      Experiences{" "}
                    </Link>
                  </button>
                  <button className="rounded-5 bg-gray1 border-0 px-4 py-1 fw-600">
                    <Link
                      href="/upcomingtrips"
                      className="text-decoration-none text-light"
                    >
                      Trips
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12  pt-lg-0 pt-4 mt-lg-0 mt-1">
            {isLoading && (
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            )}
            {!isLoading && (
              <InfiniteScroll
                className="w-100 overflow-hidden"
                dataLength={postIds?.length}
                loader={<h4>Loading...</h4>}
              >
                <Box className="pb-lg-5 pb-sm-3">
                  <Masonry
                    columns={numColumns}
                    spacing={1}
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
                                src={`${Files_URL}${post.images[0]}`}
                                alt="Uploaded Image"
                              />

                              <div
                                style={{ position: "absolute ", zIndex: 999 }}
                                className="text-center"
                              >
                                <p className={`mb-0 letterspac text-white`}>
                                  Event
                                </p>
                                <h3 className="w-700 text-white">
                                  {post.title}
                                </h3>
                                <p className={`mb-0 m1 text-white`}>
                                  {post.region.slice(0, 9)}
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
            )}
          </div>
        </div>
        <div className="text-center">
          <p>Add your saves to an upcoming trip!</p>
        </div>
      </div>

      <br />
    </>
  );
}

export default ViewSaves;

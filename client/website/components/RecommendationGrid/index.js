import { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { fetchRecommendations } from "../../../store/actions/recommendationActions";
import styles from "../../../styles/home.module.css";

import Link from "next/link";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Files_URL } from "../../../apiConfig";

const RecommendationGrid = ({
  recommendations,
  loading,
  error,
  fetchRecommendations,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentRecommendations, setCurrentRecommendations] = useState([]);
  const [numColumns, setNumColumns] = useState(4);
  const updateNumColumns = () => {
    if (window.innerWidth >= 1300) {
      setNumColumns(7);
    } else if (window.innerWidth >= 1250) {
      setNumColumns(5);
    } else if (window.innerWidth >= 768) {
      setNumColumns(4);
    } else if (window.innerWidth >= 500) {
      setNumColumns(3);
    } else if (window.innerWidth >= 350) {
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

  useEffect(() => {
    // Fetch initial 5 recommendations
    fetchRecommendations(currentPage);
  }, [fetchRecommendations, currentPage]);

  useEffect(() => {
    if (Array.isArray(recommendations?.Recommendations)) {
      const sortedRecommendations = recommendations.Recommendations.sort(
        (a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      );
      setCurrentRecommendations(sortedRecommendations);
    }
  }, [recommendations]);

  const loadMoreRecommendations = () => {
    setCurrentPage(currentPage + 1);
    fetchRecommendations(currentPage + 1);
  };
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    localStorage.setItem("scrollPosition", scrollPosition);
  };
  useEffect(() => {
    // Fetch initial 5 recommendations
    fetchRecommendations(currentPage);

    // Retrieve the scroll position from local storage
    const scrollPosition = parseInt(localStorage.getItem("scrollPosition"));
    if (!isNaN(scrollPosition)) {
      window.scrollTo(0, scrollPosition);
    }
  }, [fetchRecommendations, currentPage]);

  const handleLinkClick = async (itemId, postTitle, item) => {
    handleScroll();
    console.log("ITEMMMMM", item);

    if (item.isItenrary === false) {
      router.push(
        `/eventdetail/${encodeURIComponent(
          postTitle.replace(/ /g, "-")
        )}?id=${itemId}`
      );
    } else if (item.isItenrary === true) {
      // Handle the redirection based on your requirements.
      // You can add a condition or further logic here to determine the correct route.

      router.push({
        pathname: "/Itenraries",
        query: {
          id: JSON.stringify(item._id),
        },
      });
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-lg-5 px-2">
          <div className="col-12 pt-3">
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={currentRecommendations.length}
              next={loadMoreRecommendations}
              hasMore={hasMore}
            >
              <Box sx={{ minHeight: 829 }}>
                <Masonry columns={numColumns} spacing={1}>
                  {currentRecommendations.map((item, index) => {
                    return (
                      <div key={index} className="">
                        <div
                          className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                          onClick={() =>
                            handleLinkClick(item._id, item.title, item)
                          }
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
                            style={{ borderRadius: "20px" }}
                          />
                          {/* </Link> */}

                          <div style={{ position: "absolute ", zIndex: 999 }}>
                            <div className="text-center">
                            <h3 className="w-700 text-white">
                                {item.isItenrary?"Itinerary":'Event'}
                              </h3>
                              <h3
                                className={`w-700 text-white ${styles.titlehero}`}
                              >
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
    </>
  );
};

const mapStateToProps = (state) => ({
  recommendations: state.recommendation.recommendations,
  loading: state.recommendation.loading,
  error: state.recommendation.error,
});

const mapDispatchToProps = {
  fetchRecommendations,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationGrid);
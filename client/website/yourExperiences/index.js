import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useRouter } from "next/router";
import FilterPosts from "../../pages/HomePage/component/FilterPosts";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect, useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../store/actions/recommendationActions";
import styles from "../../styles/viewsave.module.css";
import { Files_URL } from "../../apiConfig";

const InfiniteScrollComponent = () => {
  const router = useRouter();
  //const region = router.query.region?.toLowerCase();
  const { min, max, region, descriptor } = router.query;
  console.log(region, "region");
  const minCost = parseInt(min) || 0;
  const maxCost = parseInt(max) || 0;
  console.log(minCost, maxCost, "minCost and maxCost");

  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  // redux
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;

  const [fileredData, setFilteredData] = useState(recommendations?.Recommendations || []);

  const [hasMyPosts, setHasMyPosts] = useState(true);
  useEffect(() => {
    const fetchCheckHasMyPost = () => {
      const userId = localStorage.getItem("userID");
      // Assuming filteredData is available in your component or context

      fileredData.forEach((event) => {
        if (event?.userID === userId) {
          setHasMyPosts(false);
          return; // Exit the loop early if a match is found
        }
      });

      // If you reach this point, no posts were found for the logged-in user
    };

    fetchCheckHasMyPost();
  }, [fileredData]); // Trigger the effect when filteredData changes


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
  // const loading = true;
  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    setHasMore(false);
  }, [router.query.region]);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLinkClick = (itemId, postTitle, item) => {
    if (item?.isItenrary) {
      router.push({
        pathname: "/Itenraries",
        query: {
          id: JSON.stringify(item._id),
        },
      });
    } else {
      router.push(
        `/eventdetail/${encodeURIComponent(
          postTitle.replace(/ /g, "-")
        )}?id=${itemId}`
      );
    }
  };

  const fetchPosts = () => {
    const startIndex = (page - 1) * 10;
    const endIndex = page * 10;
    const newPosts = recommendationData.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      // No more posts available
      setHasMore(false);
    }
  };

  useEffect(() => {
    const filteredCards = posts.filter((card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredCards);
  }, [searchTerm, posts]);

  // api
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);



  const recommendationData = recommendations?.Recommendations || [];




  useEffect(() => {
    setHasMore(false);
  }, [router.query.descriptor]);





  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">

        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const userIDPerson1 =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  return (
    <div>
      <div></div>
      <div className="container-fluid px-lg-3 px-2 pt-3 pb-5 d-flex justify-content-center">
        <div className="row px-lg-4 px-2">


          <div className="col-12">
            <div className="row align-items-center justify-content-start flex-wrap  pt-lg-0 pt-3">
              <div
                className={`col-lg-4 col-md-4 col-5 d-flex justify-content-start mb-lg-0 mb-3 px-lg-2 px-1 ${styles.filterbox}`}
              >
                <FilterPosts minCost={minCost} maxCost={maxCost} descriptor={descriptor} region={region} />
              </div>
              <div className="col-lg-4 col-md-4 col-7 pb-lg-3 pb-0">
                <h1 className="dark bold fw-700 pt-lg-0 text-center  mb-lg-2 mb-2 experience-saves-header">
                  Your Experiences
                </h1>
              </div>
              <div className="col-lg-4 col-md-4 col-6 d-flex justify-content-lg-end justify-content-md-end justify-content-start  px-lg-4 px-3 pb-lg-3 pt-lg-0 pt-2 pb-md-1 pb-3">
                <div className="d-flex gap-3">

                  <Link
                    href="/viewsave"
                    className=" rounded-5 bg-gray1 border-0 px-3 py-1 fw-600 text-decoration-none text-light"
                  >
                    Saves
                  </Link>
                  <Link
                    href="/upcomingtrips"
                    className=" rounded-5 bg-gray1 border-0 px-3 py-1 fw-600 text-decoration-none text-light"
                  >
                    Trips
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 pt-3">
            {fileredData?.length != 0 && (
              <InfiniteScroll
                className="w-100 overflow-hidden"
                dataLength={searchResults.length || posts.length}
                next={recommendationData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
              >

                <Box
                  sx={{ minHeight: !hasMyPosts ? 829 : 0 }}
                  className="d-flex justify-content-center"
                >
                  {fileredData && (
                    <Masonry columns={4} spacing={1}>
                      {(fileredData
                      ).map((item, index) => {
                        if (item.userID == userID) {
                          return (
                            <div>

                              <div key={index} className="">
                                <div
                                  className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                                  onClick={() =>
                                    handleLinkClick(item._id, item.title, item)
                                  }
                                >
                                  <img
                                    className={styles.uploadimg}
                                    src={`${Files_URL}${item.images[0]}`}
                                    alt="Uploaded Image"
                                  />

                                  <div style={{ position: "absolute", zIndex: 999 }}>
                                    <div className="text-center">
                                      <h3 className="w-700 text-white">
                                        {item.isItenrary ? "Itinerary" : 'Event'}
                                      </h3>
                                      <h3 className="w-700 text-white">
                                        {item.title.length <= 45
                                          ? item.title
                                          : `${item.title.slice(0, 45)}...`}
                                      </h3>
                                      <p className={`mb-0 m1 text-white`}>
                                        {item.location}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>

                          )
                        }
                      })}
                    </Masonry>

                  )}
                </Box>
              </InfiniteScroll>
            )}

            {hasMyPosts && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p style={{ textAlign: 'center' }}>
                  Looks like you haven't shared anything yet.
                </p>
                <Link
                  href="/createPost"
                  className="rounded-5 border-0 px-3 py-1 fw-600 text-decoration-none text-light"
                  style={{
                    color: "white",
                    backgroundColor: '#4562B2'
                  }}
                >
                  Add Experience
                </Link>
              </div>


            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// export default
const mapStateToProps = (state) => ({
  recommendations: state.recommendation.recommendations,
  loading: state.recommendation.loading,
  error: state.recommendation.error,
});

const mapDispatchToProps = {
  fetchRecommendations,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfiniteScrollComponent);
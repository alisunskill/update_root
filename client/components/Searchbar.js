import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/home.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchRecommendations } from "../store/actions/recommendationActions";
import { Box } from "@mui/material";
import { Masonry } from "@mui/lab";
import { searchData } from "../store/actions/recommendationActions";
import { Files_URL } from "../apiConfig";

const Searchbar = () => {
  const router = useRouter();
  const region = router.query.region?.toLowerCase();
  const descriptor = router.query.descriptor?.toLowerCase();
  // redux
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;

  // const loading = true;
  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [show, setShow] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [regionData, setRegion] = useState([]);
  useEffect(() => {
    console.count("search useeffect");
    setPosts(filteredPosts);
    setHasMore(false);
  }, [router.query.region]);

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  const fetchPosts = () => {
    const startIndex = (page - 1) * 10;
    const endIndex = page * 10;
    const newPosts = recommendationData.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
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
  useEffect(() => {
    if(searchTerm!=''){
      setShow(true);

    }
  }, [searchTerm]);

  const recommendationData = recommendations.Recommendations || [];
  // warning
  useEffect(() => {
    setRegion(recommendationData);
  }, [regionData]);

  useEffect(() => {
    setSearchTerm("");
  }, [router.pathname]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filteredRecommendations = recommendationData.filter((item) =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    // console.log(filteredRecommendations);
    dispatch(searchData(filteredRecommendations));

    setPosts(filteredRecommendations);
    setShowAll(true);
    // setShowAll(false);
  };

  const toggleShowAll = () => {
   
    setShow(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const filteredCards = posts.filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredCards);
      setShow(false);
      setSearchTerm("");
      router.push(`/infinitescroll?region=${encodeURIComponent(searchTerm)}`);
      
    }
  };
  // current post
  const filteredPosts = recommendationData.filter(
    (post) => post.region.toLowerCase() === region
  );

  // current Descriptor
  // const filtereDescriptor = recommendationData.filter(
  //   (post) => post.descriptor.toLowerCase() === descriptor
  // );
  const filtereDescriptor = recommendationData.filter((post) => {
    if (typeof post.descriptor === "string") {
      return post.descriptor.toLowerCase() === descriptor;
    }
    return false; // Handle non-string descriptor values
  });
  useEffect(() => {
    setPosts(filtereDescriptor);
    setHasMore(false);
  }, [router.query.descriptor]);

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
  if (loading) {
    return (
      <div
        className={`col-lg-7  ${styles.inputgroup}`}
      >
        <Form className="w-100">
          <FormControl
            type="text"
            aria-describedby="button-addon5"
            className={`form-control w-100 ${styles.searchvally}`}
            list="itemList"
          />
          {/* <FontAwesomeIcon className={styles.inputgroupicon} icon={faSearch} /> */}
          <div
            className={`spinner-grow spinner-grow-sm text-primary ${styles.inputgroupicon1}`}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </Form>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // routes set for region

  const regionp = regionData.map((item) => {
    return item.region;
  });
 
  return (
    <>
      <div   className={`col-lg-7 col-md-6 col-sm-11   col-11   ${styles.inputgroup}`}>
        <Form >
          <FormControl
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
            className={`form-control rounded-5 ${styles.searchvally}`}
            list="itemList"
            placeholder="Explore With Us..."
            style={{
              backgroundColor:'#F9F9F9',
              paddingLeft:'25px',
              fontSize:'15px',
              
            }}
          />
          {/* <datalist id="itemList" className="w-100">
            {itemData.map((item) => (
              <option key={item.id} value={item.title} />
            ))}
          </datalist> */}
          <FontAwesomeIcon style={{color:"#727272",}}  className={styles.inputgroupicon} icon={faSearch} />
        </Form>
        {show && (
          <div className={styles.boxed}>
            {searchTerm && (
              <div className={`container-fluid pt-3 pb-2 ${styles.boldedhero}`}>
                <div
                  className="row d-flex btn scroll-hidden border-0"
                  data-toggle="collapse"
                  href="#multiCollapseExample1"
                  role="button"
                  aria-expanded="false"
                  aria-controls="multiCollapseExample1"
                >
                  <InfiniteScroll
                    className="w-100 overflow-hidden"
                    dataLength={searchResults.length || posts.length}
                    next={recommendationData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                  >
                    <Masonry columns={4} spacing={2}>
                      <div
                        className={`w-100 border-0 ${styles.masonery_data}`}
                        data-toggle="collapse"
                        href="#multiCollapseExample1"
                        role="button"
                        aria-expanded="false"
                        aria-controls="multiCollapseExample1"
                      >
                        {(searchResults
                            
                          
                        ).map((item, index) => (
                          <div key={index}>
                            <Link
                              className="d-flex align-items-bottom text-decoration-none justify-content-flex-start gap-4  mt-2"
                              style={{
                                borderBottom: "1px solid gray",
                              }}
                              href={{
                                pathname: "/infinitescroll",
                                query: { region: item.location, type:'Globe' },
                              }}
                              onClick={toggleShowAll}
                            >
                              <img
                                layout="fill"
                                objectFit="cover"
                                src={`${Files_URL}${item.images[0]}`}
                                alt={item.region}
                                loading="lazy"
                                style={{
                                  display: "block",
                                  width: "100%",
                                  maxWidth: "50px",
                                  height: "50px",
                                  borderRadius: "5px",
                                }}
                              />
                              <h6
                                className="text-dark text-end mb-0 d-flex align-items-end"
                                // style={{ width: "15%" }}
                              >
                                {item.title}
                              </h6>
                            </Link>
                          </div>
                        ))}
                      </div>
                      {searchTerm && (
                      <Link
                        href="/infinitescroll"
                        className="btn text-light bold w-100"
                        style={{ background: "#7CC5E5" }}
                        onClick={toggleShowAll}

                      >
                        Show All
                      </Link>
                      )}
                    </Masonry>
                  </InfiniteScroll>
                  {/* {!showAll && (
                    <div className="text-center mt-3">
                      <button
                    onClick={toggleShowAll}
                    className="btn text-light bold"
                    style={{ background: "#7CC5E5" }}
                  >
                    Show All
                  </button>
                    </div>
                  )} */}
                </div>
              </div>
            )}
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Searchbar);
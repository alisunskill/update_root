import { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import DeatilPage from "./DetailPage";
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
  const [selectedPost, setSelectedPost] = useState({
    id: null,
    title: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

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

  const handleLinkClick = (itemId, postTitle) => {
    setSelectedPost({
      id: itemId,
      title: postTitle,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row px-5">
          <div className="col-12 pt-3">
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={currentRecommendations.length}
              next={loadMoreRecommendations}
              hasMore={hasMore}
            >
              <Box sx={{ minHeight: 829 }}>
                <Masonry columns={4} spacing={1}>
                  {currentRecommendations.map((item, index) => {
                    return (
                      <div key={index} className="">
                        <div
                          className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                          onClick={() => handleLinkClick(item._id, item.title)}
                        >
                          <div className="w-100">
                            <img
                              className={styles.uploadimg}
                              src={`${Files_URL}${item.images[0]}`}
                              alt="Uploaded Image"
                            />
                          </div>

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
     <div className={styles.bolded12}>
     <Modal
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="full-screen-modal modal-xl"
        show={selectedPost.id !== null}
        onHide={() => setSelectedPost({ id: null, title: "" })}
        className={`w-100 m-0 p-0 ${styles.modaldetailbox}`}
        style={{ maxWidth: "100vw", margin: "0", padding: "0" }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-600">Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
  
          <DeatilPage id={selectedPost.id} />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedPost({ id: null, title: "" })}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
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

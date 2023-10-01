import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/post.module.css";
import Global from "../components/Globe";
import { fetchRecommendations } from "../../store/actions/recommendationActions";

export default () => {
  const router = useRouter();
  const { region } = router.query;

  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;

  const [regionData, setRegion] = useState([]);

  useEffect(() => {
    if (region) {
      fetchRecommendations(region)
        .then((data) => {
          const cregion = data.Recommendations;
          setRegion(cregion);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [region]);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const recommendationData =
    (recommendations && recommendations.Recommendations) || [];
  useEffect(() => {
    setRegion(recommendationData);
  }, [regionData]);

  return (
    <div className="text-center py-5">
      <div>
        <h1>Create a Post</h1>
        <p className="pt-3 fw-500">
          Discover the world's top destinations and plan your next adventure
          with ease using
          <br /> Onroot's curated posts and itineraries
        </p>
      </div>

      <div className="row align-center">
        <div className="col-12 col-md-6 col-lg-6">
          <div className="d-flex justify-content-end">
            <button href="#" className={styles.itin_button}>
              {" "}
              <FontAwesomeIcon icon={faPlus} />
              <h2>Recommendation</h2>
            </button>
          </div>
          <div className="pt-4 d-flex justify-content-end">
            <button href="#" className={styles.itin_button}>
              {" "}
              <FontAwesomeIcon icon={faPlus} />
              <h2>Recommendation</h2>
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-12">
          {/* <Image className={styles.itin_globe} src={globe} alt="globe" /> */}
          <Global data={recommendationsData} />
        </div>
      </div>
      <div className="mt-5 pt-3">
        <button className="savebtn ">Finish</button>
      </div>
    </div>
  );
};

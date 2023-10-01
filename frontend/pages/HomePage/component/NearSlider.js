import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../../styles/singular.module.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Navigation, Thumbs } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../../../store/actions/recommendationActions";
import { useRouter } from "next/router";

export default function NearSlider() {
  const dispatch = useDispatch();
  const router = useRouter();
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const [selectedPosts, setSelectedPosts] = useState([]);

  useEffect(() => {
    if (recommendations && recommendations?.Recommendations?.length > 0) {
      const selectedData = recommendations.Recommendations.map(
        (recommendation) => {
          if (recommendation.images && recommendation.images.length > 0) {
            return {
              id: recommendation._id,
              title: recommendation.title,
              region: recommendation.region,
              image: recommendation.images[0],
            };
          }
          return null;
        }
      );

      setSelectedPosts(selectedData);
    }
  }, [recommendations]);

  if (loading) {
    return (
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    );
  }

  const handleLinkClick = (itemId, postTitle) => {
    router.push(
      `/eventdetail/${encodeURIComponent(
        postTitle.replace(/ /g, "-")
      )}?id=${itemId}`
    );
  };
  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "transparent",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper2"
        slidesPerView={5}
      >
        {selectedPosts.map((post, index) => (
          <SwiperSlide
            key={index}
            className={` d-flex justify-content-center align-items-center ${styles.savelink1}`}
            onClick={() => handleLinkClick(post.id, post.title)}
          >
            <img
              className={`${styles.scenery2} object-cover`}
              src={post.image}
              alt=""
            />
            <div
              style={{ position: "absolute ", zIndex: 999 }}
              className={styles.scenerybox}
            >
              <div className="text-center">
                <p className={`mb-0 letterspac text-white f-16`}>ITINERARY</p>
                <h5 className="w-700 text-white"> {post.title}</h5>
                <p className={`mb-0 m1 text-white f-16`}>{post.region.slice(0, 9)}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

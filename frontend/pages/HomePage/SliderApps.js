import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../styles/singular.module.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function SliderApps({ images1 }) {
  console.log(images1, "ali");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = (image) => {
    setSelectedImage(image);
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
        slidesPerView={1}
      >
        {selectedImage ? (
          <SwiperSlide className="m-0">
            <img
              key={selectedImage}
              className={`${styles.scenery} object-cover`}
              src={selectedImage}
              alt=""
              loading="lazy"
            />
          </SwiperSlide>
        ) : (
          images1?.map((item, index) => (
            <SwiperSlide key={index} className="m-0">
              <img
                className={`${styles.scenery} object-cover`}
                src={item}
                alt=""
                onClick={() => handleClick(item)}
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>
      <Swiper
        spaceBetween={10}
        slidesPerView={6}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="mySwiper"
      >
        {images1?.map((item, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleClick(item)}
            style={{ marginRight: "0px", width: "10%" }}
          >
            <img className={styles.smallimg} src={item} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

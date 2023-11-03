import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../styles/singular.module.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Files_URL } from "../../apiConfig";

export default function SliderApps({ images1 }) {
  const [selectedImage, setSelectedImage] = useState(images1 ? images1[0] : null);

  useEffect(() => {
    // Set selectedImage to the first item in the images1 array when the component mounts
    if (images1?.length > 0) {
      setSelectedImage(images1[0]);
    }
  }, [images1]);

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
            {selectedImage.endsWith(".mp4") || selectedImage.endsWith(".webm") ? (
              <video
                key={selectedImage}
                className={`${styles.scenery} object-cover`}
                src={`${Files_URL}${selectedImage}`}
                alt=""
                controls
              />
            ) : (
              <img
                key={selectedImage}
                className={`${styles.scenery} object-cover`}
                src={`${Files_URL}${selectedImage}`}
                alt=""
                loading="lazy"
              />
            )}
          </SwiperSlide>
        ) : (
          images1?.map((item, index) => (
            <SwiperSlide key={index} className="m-0">
              {item.endsWith(".mp4") || item.endsWith(".webm") ? (
                <video
                  className={`${styles.scenery} object-cover`}
                  src={item}
                  style={{height:'100%',width:'100%'}}
                  alt=""
                  onClick={() => handleClick(item)}
                  
                />
              ) : (
                <img
                  className={`${styles.scenery} object-cover`}
                  src={item}
                  alt=""
                  onClick={() => handleClick(item)}
                />
              )}
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
            {item.endsWith(".mp4") || item.endsWith(".webm") ? (
              <video
                className={styles.smallimg}
                src={`${Files_URL}${item}`}
                alt=""
                
              />
            ) : (
              <img
                className={styles.smallimg}
                src={`${Files_URL}${item}`}
                alt=""
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

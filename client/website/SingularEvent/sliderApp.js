import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../styles/singular.module.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const slideImg = [
  {
    id: "1",
    img: "https://swiperjs.com/demos/images/nature-1.jpg",
  },
  {
    id: "2",
    img: "https://swiperjs.com/demos/images/nature-2.jpg",
  },
  {
    id: "3",
    img: "https://swiperjs.com/demos/images/nature-3.jpg",
  },
  {
    id: "4",
    img: "https://swiperjs.com/demos/images/nature-4.jpg",
  },
  {
    id: "5",
    img: "https://swiperjs.com/demos/images/nature-5.jpg",
  },
  {
    id: "6",
    img: "https://swiperjs.com/demos/images/nature-6.jpg",
  },
  {
    id: "7",
    img: "https://swiperjs.com/demos/images/nature-7.jpg",
  },
  {
    id: "8",
    img: "https://swiperjs.com/demos/images/nature-8.jpg",
  },
  {
    id: "9",
    img: "https://swiperjs.com/demos/images/nature-9.jpg",
  },
];

export default function SliderApp() {
  const [selectedData, setSelectedData] = useState(null);

  const handleClick = (itemId) => {
    const selected = slideImg.find((item) => item.id === itemId);
    console.log(selected, "ali");
    setSelectedData(selected);
  };

  return (
    <>
      {selectedData ? (
        <Swiper
          style={{
            "--swiper-navigation-color": "transparent",
            "--swiper-pagination-color": "#fff",
          }}
          spaceBetween={10}
          navigation={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
          slidesPerView={1}
        >
          <SwiperSlide>
            <img className={` ${styles.scenery}`} src={selectedData.img} />
          </SwiperSlide>
        </Swiper>
      ) : (
        <Swiper
          style={{
            "--swiper-navigation-color": "transparent",
            "--swiper-pagination-color": "#fff",
          }}
          spaceBetween={10}
          navigation={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
          slidesPerView={1}
        >
          {slideImg.map((item) => {
            return (
              <SwiperSlide>
                <img className={` ${styles.scenery}`} src={item.img} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* smallimages */}
      <Swiper
        // onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={6}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {slideImg.map((item) => {
          return (
            <SwiperSlide
              onClick={() => handleClick(item.id)}
              style={{ marginRight: "0px" }}
            >
              <img className={styles.smallimg} src={item.img} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}

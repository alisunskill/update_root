import React from "react";
import styles from "../../../styles/allcards.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import calender from '../../../public/images/calender.svg'

export default (
  { imageUrl, itinerary, title, place, time, showIcon, setModalShow },
  showcalender
) => {
  const cardStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRpeat: "no-repeat",
    borderRadius: "25px",
  };
  return (
    <div className="col-12 col-lg-12 p-2">
      <div
        className={`flex-column w-100 position-relative ${styles.landingimageb}`}
        style={cardStyle}
      >
        {showIcon && (
          <div className={`col-lg-12 ${styles.yoursave_plusi}`}>
            <FontAwesomeIcon
              className={styles.plusicon}
              icon={faPlus}
              onClick={() => setModalShow(true)}
            />
          </div>
        )}
        {showcalender && (
          <div className={`col-lg-12 ${styles.yoursave_plusi}`}>
            <Image
              src={calender}
              onClick={() => setModalShow(true)}
              className={styles.plusicon3}
            />
          </div>
        )}

        <p className={`mb-0 ${styles.letterspac}`}>{itinerary}</p>
        <h6 className={`fw-500 mb-0 ${styles.landingeventheading}`}>{title}</h6>
        <p className="mb-0 fw-500">{place}</p>
        <p className="mb-0 mt-2 fw-500">{time && time}</p>
      </div>
    </div>
  );
};

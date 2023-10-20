import React from "react";
import styles from "../../../styles/allcards.module.css";

export default ({ imageUrl, itinerary, title, place, time, edate }) => {
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
        className={`flex-column w-100 ${styles.landingimage1}`}
        style={cardStyle}
      >
        <p className={`mb-0 ${styles.letterspac}`}>{itinerary}</p>
        <h6 className={`fw-500 mb-0 ${styles.landingeventheading}`}>{title}</h6>
        <p className="mb-0 fw-500">{place}</p>
        <div className="d-flex gap-3">
          <p className="mb-0 mt-2 fw-500">{time && time}</p>
          <p className="mb-0 mt-2 fw-500">{edate && "To"}</p>
          <p className="mb-0 mt-2 fw-500">{edate && edate}</p>
        </div>
      </div>
    </div>
  );
};

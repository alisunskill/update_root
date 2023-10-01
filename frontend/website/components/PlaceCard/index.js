import React from "react";
import styles from "../../../styles/allcards.module.css";

export default ({ imageUrl, itinerary, title, place }) => {
  const cardStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRpeat: "no-repeat",
    borderRadius: "25px",
  };
  return (
    <div className="col-12 col-md-6 col-lg-4 p-2">
      <div className={`flex-column ${styles.landingimage}`} style={cardStyle}>
        <p className={`mb-0 ${styles.letterspac}`}>{itinerary}</p>
        <h6 className={`fw-500 mb-0 ${styles.landingeventheading}`}>{title}</h6>
        <p className="mb-0">{place}</p>
      </div>
    </div>
  );
};

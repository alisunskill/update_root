import React from "react";
import styles from "../../../styles/allcards.module.css";

export default ({ imageUrl, title, region }) => {
  const cardStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRpeat: "no-repeat",
  };
  return (
    <div
    className={`col-12  m-2 overflow-hidden ${styles.sweetslide}`}
  >
    {imageUrl ? (
      <div
        className={`${styles.landingimage} ${styles.animateOnHover}`}
        style={cardStyle}
      >
        <h6 className={`fw-500 mb-0 ${styles.landingeventheading}`}>
          {title} <br />
          <span className="my-3">{region}</span>
        </h6>
      </div>
    ) : (
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    )}
  </div>
  );
};

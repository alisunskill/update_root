import React from "react";
import styles from "../../../styles/allcards.module.css";
import Image from "next/image";

export default ({ imageUrl, city, address }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4 p-3">
      <div >
        <img className={styles.placeImg} src={imageUrl} />
        <h6 className={`fw-500 mb-0 mt-3 ${styles.landingeventheading}`}>
          {city} <br />
        </h6>
        {address ? (
          <div className="d-flex align-center gap-2 pt-2">
            <h6>Starting from </h6>{" "}
            <h6 className={styles.landingeventheading}>{address}</h6>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

import React from "react";
import styles from "../../styles/signin.module.css";

export default () => {
  return (
    <>
      <div className={`row position-relative ${styles.confirmme1}`}>
        <div className={` col-lg-12 ${styles.confirm_container1}`}>
          <h3 className={styles.confirm_font1}>Thank You for Recommending</h3>
          <div className="mt-4">
            <button className="savebtn mx-2"> Back to Home</button>

            <button className="savebtn mx-2"> Recommend More</button>
          </div>
        </div>
        <div
          className="position-absolute text-center"
          style={{ bottom: "35px" }}
        >
          <h3 className=" text-light">California, USA</h3>
        </div>
      </div>
    </>
  );
};

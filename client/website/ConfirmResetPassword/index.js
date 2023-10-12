import React from "react";
import styles from "../../styles/signin.module.css";

export default () => {
  return (
    <>
      <div className={`row ${styles.confirmme}`}>
        <div className={` col-lg-12 ${styles.confirm_container}`}>
          <p className={styles.confirm_font}>
            Please check your email for reseting the password.
          </p>
        </div>
      </div>
    </>
  );
};

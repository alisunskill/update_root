import React from "react";
import styles from "../../styles/signin.module.css";
import { useRouter } from 'next/router';

export default () => {
  const router = useRouter();
  const handleLoginButtonClick = () => {
    router.replace('/login'); // Use router.push to navigate to the /login page
  };
  return (
    <>
      <div className={`row ${styles.confirmme}`}>
        <div className={` col-lg-12 ${styles.confirm_container}`}>
          <p className={styles.confirm_font2}>
            Thank You for Signing Up! <br />
            Please check your email for confirmation
          </p>
          <button
            className="savebtn1 text-light mb-5 cursor-pointer"
            onClick={handleLoginButtonClick}

          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/profile.module.css";

export default () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  const signupHandle = () => {
    router.push("/signup");
  };

  return (
    <div className="">
      <div className={styles.cyclebg}>
        <div className={styles.cyclehero}>
          <h1 className={styles.sryheader}>Sorry to see you go!</h1>
          <div className="d-flex justify-content-around gap-3 mt-3">
            <button
              onClick={handleGoBack}
              type=""
              className={styles.signupbtns}
            >
              Back to Home
            </button>
            <button
              onClick={signupHandle}
              className={styles.signupbtns}
              type=""
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

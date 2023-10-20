import React, { useEffect, useState } from "react";
import styles from "../../styles/signin.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from '../../apiConfig';

export default () => {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const handleLoginButtonClick = () => {
    router.replace('/login'); // Use router.push to navigate to the /login page
  };

  useEffect(() => {
    // Get the token from the query parameters
    const { token } = router.query;

    if (token) {
      axios
        .get(`${API_URL}api/users/verifyEmail?token=${token}`)
        .then((response) => {
          if (response.data.status === "verified") {
            setVerificationStatus("verified");
          } else {
            setVerificationStatus("failed");
          }
        })
        .catch((error) => {
          setVerificationStatus("failed");
          console.error(error);
        });
    }
  }, [router.query]);

  return (
    <>
      <div className={`row ${styles.confirmme}`}>
        <div className={`col-lg-12 ${styles.confirm_container}`}>
          <p className={styles.confirm_font2}>
            {verificationStatus === "verified" ? (
              "Email Verified Successfully"
            ) : verificationStatus === "failed" ? (
              "Email Verification Failed"
            ) : (
              "Verifying Your Email"
            )}
          </p>
          {verificationStatus=="verified" && (
          <button
            className="savebtn1 text-light mb-2 cursor-pointer"
            onClick={handleLoginButtonClick}

          >
            Login
          </button>
          )}
        </div>
      </div>
    </>
  );
};

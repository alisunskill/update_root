import React, { useEffect, useState } from "react";
import styles from "../../styles/signin.module.css";
import Link from "next/link";
import axios from "axios";
import { API_URL } from "../../apiConfig";
import * as Yup from "yup";
import { useRouter } from "next/router";

function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");
    if (tokenFromURL) {
      setResetToken(tokenFromURL);
    }
  }, []);

  const forgotSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must contain at least one letter, one number, and may contain special characters"
      ),
  });

  const handleReset = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}api/users/resetpassword`, {
        email: email,
        resetToken: resetToken,
        password: password,
      });

      if (response.status === 200) {
        console.log("Password reset request successful.");
        router.push("/login");
      } else {
        console.error("Password reset request failed.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`row ${styles.confirmme}`}>
        <div className="col-lg-12 d-flex justify-content-center">
          <div className={styles.signupsignupcontainer}>
            <h1 className={styles.signupheading1}>Reset Password</h1>

            <div className="row mt-1 gy-3 d-flex justify-content-center align-center px-5">
              <form className={styles.formStyles}>
                <input
                style={{display:'none'}}
                  name="email"
                  className="form-control rounded-2 border-0 mt-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="on"
                  required
                />
                <input
                  name="password"
                  type="password"
                  className="form-control rounded-2 border-0 mt-2"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-center">
                  <button
                    className="savebtn1 text-light mt-4"
                    onClick={handleReset}
                  >
                    {loading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "RESET PASSWORD"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
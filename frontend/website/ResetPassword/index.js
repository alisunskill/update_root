import React, { useEffect, useState } from "react";
import styles from "../../styles/signin.module.css";
import Link from "next/link";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    // resetToken: Yup.string().required("Reset Token is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must contain at least one letter, one number, and may contain special characters"
      ),
  });

  const handleReset = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/users/resetpassword",
        // values
        {
          ...values,
          resetToken: resetToken,
        }
      );

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
              <Formik
                initialValues={{
                  email: "",
                  resetToken: "",
                  password: "",
                }}
                validationSchema={forgotSchema}
                onSubmit={handleReset}
              >
                {({ isValid }) => (
                  <Form>
                    <Field
                      name="email"
                      style={{ padding: "10px", display: "none" }}
                      className="form-control rounded-2 border-0 mt-2"
                      placeholder="email"
                    />
                    <ErrorMessage
                      name="resetToken"
                      component="div"
                      className="text-light"
                    />
                    {resetToken ? (
                      <p className="text-success">
                        Reset token received successfully!
                      </p>
                    ) : (
                      <div>
                        <Field
                          name="resetToken"
                          style={{ padding: "10px" }}
                          className="form-control rounded-2 border-0 mt-2"
                          placeholder="Reset Token"
                        />
                      </div>
                    )}

                    <Field
                      name="password"
                      style={{ padding: "10px" }}
                      className="form-control rounded-2 border-0 mt-2"
                      type="password"
                      placeholder="New Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-light"
                    />
                    <div className="text-center">
                      <button
                        // disabled={!isValid}
                        className="savebtn1 text-light mt-4"
                        type="submit"
                      >
                        {loading ? (
                          <div class="spinner-border text-light" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "RESET PASSWORD"
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;

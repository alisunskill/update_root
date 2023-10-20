import React, { useState } from "react";
import styles from "../../styles/signin.module.css";
import axios from "axios";
import wlogo from "../../public/images/rootwhite.png";
import Image from "next/image";
import { API_URL } from "../../apiConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const forgotSchema = Yup.object().shape({
    email: Yup.string().required("email is required"),
  });

  const handleForgot = async (values) => {
    try {
      setLoading(true);
      // const response = await axios.post(
      //   "http://localhost:8000/api/users/forgot-password",
      //   values
      // );
      const response = await axios.post(
        `${API_URL}api/users/forgot-password`,
        values
      );

      if (response.status === 200) {
        console.log("Password reset request successful.");
        router.push("/confirmedreset");
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
            <h1 className={styles.signupheading1}>Get back</h1>

            <Image width={160} src={wlogo} alt="wlogo" />
            <p className="text-light pt-lg-4 ">Let's find your account!</p>

            <div className="row gy-3 d-flex justify-content-center align-center">
              <Formik
                initialValues={{
                  email: "",
                }}
                validationSchema={forgotSchema}
                onSubmit={handleForgot}
              >
                {({ isValid }) => (
                  <Form>
                    <Field
                      name="email"
                      style={{ padding: "10px" }}
                      className="form-control rounded-2 border-0 mt-2"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-light"
                    />

                    <div className="text-center">
                      <button
                        className={`savebtn1 text-light mt-4 ${styles.resetbtntext}`}
                        type="submit"
                        disabled={!isValid}
                      >
                        {loading ? (
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Send a password reset email"
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

export default ForgotPassword;
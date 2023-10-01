import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchLoginUser,
  setUserID,
} from "../../store/actions/recommendationActions";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/signin.module.css";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { handleLogout } from "./authUtils";
import wlogo from "../../public/images/rootwhite.png";
import Image from "next/image";

// import setUserID

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [storedUserID, setStoredUserID] = useState("");
  const [storedEmail, setStoredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaResponse, setRecaptchaResponse] = useState("");
  if (storedUserID && storedEmail) {
    dispatch(setUserID(storedUserID, storedEmail));
  }

  useEffect(() => {
    const userID = storedUserID;
    const email = storedEmail;
    console.log(email, userID, "ali");
  }, [dispatch]);

  const handleCaptchaChange = (response) => {
    setRecaptchaResponse(response);
  };

  const handleLogin = async (values, { setSubmitting, getState }) => {
    try {
      if (!recaptchaResponse) {
        Swal.fire({
          text: "Please complete the reCAPTCHA challenge.",
          icon: "error",
        });
        return;
      }

      await dispatch(fetchLoginUser({ ...values, recaptchaResponse }));

      const token = localStorage.getItem("token");
      console.log(token, "kkk");
      if (token) {
        router.push("/");
      } else {
        Swal.fire({
          text: "An error occurred during login.",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        text: "An error occurred during login.",
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      )
      .required("Password is required"),
  });

  return (
    <>
      <div className={`row ${styles.confirmme}`}>
        <div className="col-lg-12 d-flex justify-content-center">
          <div className={styles.signupsignupcontainer}>
            <h1 className={`text-align-left ${styles.signupheading1}`}>
              Welcome to
            </h1>
            <Image width={160} src={wlogo} alt="wlogo" />
            <p className="text-light pt-lg-4 pt-3">
              Share your experiences and get inspired to plan your next trip.
            </p>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ isValid }) => (
                <Form>
                  <Field
                    name="email"
                    style={{ padding: "10px" }}
                    className="form-control rounded-3 border-0 mt-2"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-light"
                  />
                  <div className="position-relative ">
                    <Field
                      name="password"
                      style={{ padding: "10px" }}
                      className="form-control rounded-3 border-0 mt-2"
                      placeholder="Password"
                      // type="password"
                      type={showPassword ? "text" : "password"}
                    />
                    <button
                      type="button"
                      className="password-toggle-button position-absolute"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "0",
                        margin: "0",
                        cursor: "pointer",
                        right: "12px",
                        top: "13px",
                        color: "black",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-light"
                  />

                  <div className="text-center">
                    <div className="w-100 d-flex justify-content-center mt-3">
                      <ReCAPTCHA
                        sitekey="6LdNryEnAAAAAHvI4ty3RvMc2dnX0fR9aF1dXq7r"
                        onChange={handleCaptchaChange}
                      />
                    </div>
                    <button
                      className="savebtn1 text-light mt-4 cursor-pointer"
                      type="submit"
                      disabled={!isValid}
                    >
                      Login
                    </button>
                    <div className="text-center mt-3">
                      <Link
                        href="/forgotpassword"
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        Forgot Password?
                      </Link>{" "}
                      <br />
                      <Link
                        href="/signup"
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        New member? Register here.
                      </Link>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

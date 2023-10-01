import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import styles from "../../styles/signin.module.css";
import Captcha from "./Captcha";
import wlogo from "../../public/images/rootwhite.png";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
function Signup() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const recaptchaValueRef = useRef("");
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);

    if (!recaptchaValueRef.current) {
      setRecaptchaError("Please complete the reCAPTCHA challenge.");
      Swal.fire({
        text: "Please complete the reCAPTCHA challenge.",
        icon: "error",
      });
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log(token, "token he ye");
      const response = await axios.post(
        "http://localhost:8000/api/users",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response Data:", response.data);

      if (response.data.user) {
        const { email, _id } = response.data.user;
        localStorage.setItem("userID", _id);
        Cookies.set("userID", _id);
        localStorage.setItem("email", email);
      }

      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSubmitting(false);
      router.push("/confirmsignup");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        showAccountExistsAlert();
      } else {
        console.error("Error sending data to backend:", error);
      }
    }
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      recaptchaValueRef.current = value; // Store reCAPTCHA value in the ref
      setRecaptchaError("");
    } else {
      recaptchaValueRef.current = ""; // Clear the ref value
      setRecaptchaError("Please complete the reCAPTCHA challenge.");
    }
  };

  const showAccountExistsAlert = () => {
    Swal.fire({
      title: "Account Exists",
      text: "Provided Email is Already Exists.",
      icon: "warning",
    });
  };

  const signupSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(10, "Too Long!")
      .required("Firstname is required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(10, "Too Long!")
      .required("Lastname is required"),

    region: Yup.string()
      .min(2, "Too Short!")
      .max(10, "Too Long!")
      .required("Region is required"),

    email: Yup.string().email("Email is invalid").required("Email is required"),
    username: Yup.string()
      .min(2, "Too Short!")
      .max(20, "Too Long!")
      .required("Username is required"),
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
            <h1 className={styles.signupheading1}>Welcome to</h1>
            <Image width={160} src={wlogo} alt="wlogo" />
            <p className="text-light pt-lg-4 pt-3">
              Share your experiences and get inspired to plan your next trip.
            </p>
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                region: "",
                email: "",
                username: "",
                password: "",
              }}
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid }) => (
                <Form>
                  <div className="d-flex gap-3 mt-4">
                    <div className="w-100">
                      <Field
                        name="firstName"
                        style={{ padding: "10px" }}
                        className="form-control rounded-3 border-0 "
                        placeholder="First Name"
                      />
                      {errors.firstName && touched.firstName ? (
                        <div className="text-light">{errors.firstName}</div>
                      ) : null}
                    </div>

                    <div className="w-100">
                      <Field
                        name="lastName"
                        style={{ padding: "10px" }}
                        className="form-control rounded-3 border-0 "
                        placeholder="Last Name"
                      />
                      {errors.lastName && touched.lastName ? (
                        <div className="text-light ">{errors.lastName}</div>
                      ) : null}
                    </div>
                  </div>
                  <Field
                    name="username"
                    style={{ padding: "10px" }}
                    className="form-control rounded-3 border-0 mt-2"
                    placeholder="Username"
                  />
                  {errors.username && touched.username ? (
                    <div className="text-light ">{errors.username}</div>
                  ) : null}
                  <Field
                    name="region"
                    ref={fileInputRef}
                    style={{ padding: "10px" }}
                    className="form-control rounded-3 border-0 mt-2"
                    placeholder="Region"
                  />

                  {errors.region && touched.region ? (
                    <div className="text-light">{errors.region}</div>
                  ) : null}

                  <Field
                    name="email"
                    type="email"
                    style={{ padding: "10px" }}
                    className="form-control rounded-3 border-0 mt-2"
                    placeholder="Email"
                  />
                  {errors.email && touched.email ? (
                    <div className="text-light">{errors.email}</div>
                  ) : null}

                  <div className="position-relative">
                    <Field
                      // type="password"
                      name="password"
                      style={{ padding: "10px" }}
                      className="form-control rounded-3 border-0 mt-2"
                      placeholder="Password"
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
                    {recaptchaError && (
                      <div className="text-light">{recaptchaError}</div>
                    )}
                    <button
                      type="submit"
                      className="savebtn1 text-light mt-4"
                      // disabled={!isValid}
                      disabled={!!recaptchaError}
                    >
                      Sign Up
                    </button>
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

export default Signup;

import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import styles from "../../styles/signin.module.css";
import Captcha from "./Captcha";
import wlogo from "../../public/images/rootwhite.png";
import Image from "next/image";
import { API_URL } from "../../apiConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { sitekey } from "../../apiConfig";
import Link from "next/link";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

function Signup() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const recaptchaValueRef = useRef("");
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false); // Added state for the checkbox
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    if (!values.username) {
      // Generate 4 random numbers and append them to the beginning of firstName
      const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
      values.username = `${values.firstName}${randomNumbers}`;
    }

    const emptyFields = Object.keys(values).filter((key) => !values[key]);
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.join(", ");
      Swal.fire({
        title: "Empty Fields",
        text: `Please fill out the following fields: ${fieldNames}`,
        icon: "error",
      });
      setSubmitting(false);
      return;
    }
    if (!privacyPolicyAccepted) {
      // Swal.fire({
      //   title: "Privacy Policy Not Accepted",
      //   text: "Please accept the Privacy Policy to proceed.",
      //   icon: "error",
      // });
      setPrivacyPolicyModalOpen(true); // Open the privacy policy modal

      setSubmitting(false);
      return;
    }
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
      const response = await axios.post(`${API_URL}api/users`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response Data:", response.data);

      if (response.data.status) {
        //localStorage.setItem("userID", _id);
        //Cookies.set("userID", _id);
        //localStorage.setItem("email", email);
        Swal.fire({
          title: "Account Created",
          text: `Welcome, ${response.data.user.firstName.charAt(0).toUpperCase() + response.data.user.firstName.slice(1)}! Your account has been successfully created.`,
          icon: "success",
        });
        // resetForm();
        // if (fileInputRef.current) {
        //   fileInputRef.current.value = "";
        // }
        // setSubmitting(false);
        router.push("/confirmsignup");
      }
      else if (!response.data.status) {
        if (response.data.message === "Email already exists") {
          Swal.fire({
            title: "Account Exists",
            text: "Provided Email is Already Exists.",
            icon: "warning",
          });
        } else if (response.data.message === "Username already exists") {
          Swal.fire({
            title: "Account Exists",
            text: "Provided Username is Already Exists.",
            icon: "warning",
          });
        }
      }

    } catch (error) {
      Swal.fire({
        title: "Server Error",
        text: "Something went wrong in backend. Please try again later",
        icon: "error",
      });

      setSubmitting(false);
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

    // region: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(10, "Too Long!")
    //   .required("Region is required"),

    email: Yup.string().email("Email is invalid").required("Email is required"),
    // username: Yup.string()
    //   .min(2, "Too Short!")
    //   .max(20, "Too Long!")
    //   .required("Username is required"),
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
                region: "Islamabad",
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
                  {/* <Field
                    name="region"
                    ref={fileInputRef}
                    style={{ padding: "10px" }}
                    className="form-control rounded-3 border-0 mt-2"
                    placeholder="Region"
                  />

                  {errors.region && touched.region ? (
                    <div className="text-light">{errors.region}</div>
                  ) : null} */}

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

<div className="mt-2">
  {/* Privacy Policy Checkbox */}
  <label style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>
    <Field
      type="checkbox"
      name="privacyPolicyAccepted"
      checked={privacyPolicyAccepted}
      onChange={(e) => setPrivacyPolicyModalOpen(e.target.checked)}
      style={{ zoom: 1.5 }} // Adjust the zoom value to change the size of the checkbox
    />{" "}
    <span style={{ fontSize: "16px",fontWeight:"bold", marginLeft:'5px',color:"white" }}>Accept the Privacy Policy</span>
  </label>
  {errors.privacyPolicyAccepted && (
    <div className="text-light" style={{ fontSize: "16px" }}>
      {errors.privacyPolicyAccepted}
    </div>
  )}
</div>

                  <div className="text-center">
                    <div className="w-100 d-flex justify-content-center mt-3">
                      <ReCAPTCHA
                        sitekey={sitekey}
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
                  <div className="text-center mt-2 " >
                    <Link
                      href="/login"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      Already have an account? Login here.
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <PrivacyPolicyModal
          open={privacyPolicyModalOpen}
          setPrivacyPolicyAccepted={setPrivacyPolicyAccepted}
          onClose={() => setPrivacyPolicyModalOpen(false)}
        />
      </div>
    </>
  );
}

export default Signup;

function PrivacyPolicyModal({ open, onClose, setPrivacyPolicyAccepted }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent dividers>
        <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
          <p>Welcome to OnRoot - Your Ultimate Travel Companion!</p>

          <p>At OnRoot, we are committed to protecting your privacy and ensuring a secure and enjoyable user experience. This Privacy Policy outlines how we collect, use, and safeguard your personal information while you explore and make the most of our platform.</p>

          <p><strong>1. Information We Collect</strong></p>
          <p>When you use OnRoot, we may collect the following information:</p>
          <ul>
            <li>- Personal Information: We may collect your name, email address, and other contact information when you sign up for an account or use our services.</li>
            <li>- User-Generated Content: Any content you create or upload to the platform, such as photos, posts, and comments, may be collected and displayed on OnRoot.</li>
            <li>- Usage Information: We collect information about how you interact with our platform, including your browsing history, search queries, and the pages you visit.</li>
          </ul>

          <p><strong>2. How We Use Your Information</strong></p>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>- Providing Services: We use your information to offer you a personalized and engaging experience on OnRoot, such as creating and sharing travel content, connecting with other users, and receiving recommendations.</li>
            <li>- Communication: We may send you updates, notifications, and promotional messages related to OnRoot services. You can opt out of receiving these communications at any time.</li>
            <li>- Improving Our Services: We use data analytics to enhance our services, make informed decisions, and optimize your experience on the platform.</li>
          </ul>

          <p><strong>3. Protecting Your Information</strong></p>
          <p>We take security seriously and implement measures to safeguard your personal information. However, please be aware that no system is entirely secure, and there is always a small risk associated with sharing information online.</p>

          <p><strong>4. Third-Party Links and Services</strong></p>
          <p>OnRoot may contain links to third-party websites and services. Please note that this Privacy Policy does not cover the privacy practices of those third parties. We recommend reviewing their privacy policies when using their services.</p>

          <p><strong>5. Your Choices</strong></p>
          <p>You have choices regarding the information you share with OnRoot. You can:</p>
          <ul>
            <li>- Access, Correct, or Delete Your Data: You can access and update your account information. You can also delete your account or specific content you have shared on the platform.</li>
            <li>- Control Notifications: You can manage your notification preferences in your account settings.</li>
          </ul>

          <p><strong>6. Contact Us</strong></p>
          <p>If you have any questions, concerns, or requests related to your privacy, please contact us at [email address].</p>

          <p>By using OnRoot, you agree to this Privacy Policy. We may update this policy from time to time, and we will notify you of any significant changes.</p>

          <p>Thank you for choosing OnRoot as your travel companion!</p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={() => {
            setPrivacyPolicyAccepted(true);
            onClose();
          }}
          color="primary"
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
}


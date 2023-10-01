import React, { useEffect, useState } from "react";
import styles from "../../styles/profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { faPlus, faHeart } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";

import {
  fetchFavPosts,
  fetchRecommendations,
} from "../../store/actions/recommendationActions";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import profileicon from "../../public/images/men.svg";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import {
  fetchUserData,
  deleteUserProfile,
} from "../../store/actions/userAction";

function EditProfile() {
  const countries = [
    "Russia",
    "China",
    "UAE",
    "USA",
    "Pakistan",
    "Malaysia",
    "Mexico",
    "Bangladesh",
    "Sri Lanka",
    "Britian",
  ];
  const languages = ["English", "Spanish", "French", "German", "Chinese"];

  // const userIds = localStorage.getItem("userID");
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  // fetch recommendation
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userId);

  const [modalShow, setModalShow] = React.useState(false);

  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  const [user, setUser] = useState(null);
  const recData = recommendations.Recommendations;
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    region: "",
    email: "",
    language: "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { username, region, email, language, password } = profileData;

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    const userIds = localStorage.getItem("userID");

    if (userIds) {
      dispatch(fetchUserData(userIds));
      setUser(userData);
    }
  }, [dispatch]);

  const handleSaveProfile = async () => {
    console.log(profileData, "profileData");
    setIsSaving(true);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/profile/${userID}`,
        profileData
      );

      if (response.status === 200) {
        setIsEditing(false);
        setIsSaving(false);
        window.location.reload();
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSaving(false);
    }
  };

  const handleUsernameChange = (e) => {
    setProfileData({ ...profileData, username: e.target.value });
  };

  const handleRegionChange = (e) => {
    setProfileData({ ...profileData, region: e.target.value });
  };

  const handleEmailChange = (e) => {
    setProfileData({ ...profileData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setProfileData({ ...profileData, password: e.target.value });
  };

  const handleLanguageChange = (e) => {
    setProfileData({ ...profileData, language: e.target.value });
  };

  // delete user profile
  const deleteProfileHandel = () => {
    dispatch(deleteUserProfile(userID));

    setModalShow(false);

    router.push("/deleteduser");
  };

  return (
    <>
      <div className="row px-5 py-3">
        <div className=" col-lg-12 align-items-center gap-2 ">
          <div className="d-flex align-items-center gap-3">
            <Image
              width={100}
              height={100}
              className={`${styles.menicon} mt-2`}
              src={profileicon}
              alt="profile"
            />
            <div>
              <h6 className={`fe-600 ${styles.aboutheader}`}>About</h6>
              <p className={styles.fellpara}>
                Fell in love with traveling and want to share my experiences
                with the world!
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4">
              <h6 className={`fw-600 mb-0 mt-3 ${styles.aboutheader}`}>
                {userData?.userId?.username}
              </h6>
              <div>
                <h6 className="fw-600 mb-0 mt-3">{userData?.userId?.region}</h6>

                <p className="pt-3">
                  Where you’ve been: 30 countries, 112 cities
                </p>
              </div>
              <h6 className="fw-600">Total shared experiences: 20 </h6>
              <h6 className="fw-600 mb-0 mt-3">
                Language : {userData?.userId?.language}
              </h6>

              <h6 className="fw-600 mb-4 mt-3">{userData?.userId?.email}</h6>
              {isSaving ? (
                <div className="spinner-border text-primary mt-3" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  className={`fw-600 cursor-pointer ${styles.editbtn}`}
                >
                  Save Profile
                </button>
              )}
            </div>

            {/*  */}
            <div className="col-lg-7">
              <Form className="w-50">
                <Form.Group controlId="email" className="">
                  <Form.Label className={styles.lablenames}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Form.Group>
                <Form.Group controlId="username" className="mt-2">
                  <Form.Label className={styles.lablenames}>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </Form.Group>
                <Form.Group controlId="region" className="mt-2 ">
                  <Form.Label className={styles.lablenames}>
                    Country / Region
                  </Form.Label>
                  <Form.Select
                    as="select"
                    value={region}
                    onChange={handleRegionChange}
                  >
                    <option value="">Select a Country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="language" className="mt-2 ">
                  <Form.Label className={styles.lablenames}>
                    Language
                  </Form.Label>
                  <Form.Select
                    as="select"
                    value={language}
                    onChange={handleLanguageChange}
                  >
                    <option value="">Select a Language</option>
                    {languages.map((lang, index) => (
                      <option key={index} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="password" className="mt-2 ">
                  <Form.Label className={styles.lablenames}>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
              </Form>
            </div>
            {/*  */}
          </div>

          {/* {isSaving ? (
            <div className="spinner-border text-primary mt-3" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            <button
              onClick={handleSaveProfile}
              className={`fw-600 cursor-pointer ${styles.editbtn}`}
            >
              Save Profile
            </button>
          )} */}
        </div>
        <div className="col-lg-8"></div>
        <div>
          <button
            onClick={() => setModalShow(true)}
            className={`mt-3 mt-lg-5 mb-5 fw-600 cursor-pointer px-3 ${styles.editbtn}`}
          >
            Delete Profile
          </button>
        </div>
        {/* Delet Modal */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="medium"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Modal heading
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Centered Modal</h4>
            <p>
              This means you will permanently delete your data and everything
              associated with the account.
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-around">
            <button
              type=""
              className="savebtn1"
              onClick={() => setModalShow(false)}
            >
              No
            </button>
            <button className="savebtn1" type="" onClick={deleteProfileHandel}>
              Yes
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default EditProfile;

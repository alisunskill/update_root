import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { API_URL, Files_URL } from "../../apiConfig";
import Modal from "react-bootstrap/Modal";
import {
  fetchFavPosts,
  fetchRecommendations,
} from "../../store/actions/recommendationActions";
import Form from "react-bootstrap/Form";
import profileicon from "../../public/images/men.svg";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { handleLogout } from "../../website/Login/authUtils";

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
  const fileInputRef = useRef();

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
  const [trips, setTrips] = useState([]);
  const [userInfo, setUserInfo] = useState({})
  const [totalCountries, setTotalCountries] = useState(0);
  const [totalCities, setTotalCities] = useState(0);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [newDP, setNewDP] = useState({});
  const [profileData, setProfileData] = useState({
    username: "",
    region: "",
    email: "",
    language: "",
    password: "",
    about: ""
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

  useEffect(() => {

    const getUserInfo = async (userID) => {

      const userIds = localStorage.getItem("userID");

      try {
        const url = `${API_URL}api/users/userInfo`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userIds,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            setUserInfo(data.data);
          } else {
            // Handle error if needed
          }
        } else {
          // Handle HTTP error if needed
        }
      } catch (error) {
        // Handle fetch or other errors
        console.error(error);
      }

    };
    const fetchTotalCountryCitiesVisited = async () => {
      const uid = await localStorage.getItem("userID");
      try {
        const url = `${API_URL}api/trips/userVisitedCountriesRegions`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: uid,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTotalCities(data.totalSimilarCities);
          setTotalCountries(data.totalSimilarCountries);
        }
      } catch (error) {
        // Handle fetch or other errors
        console.error(error);
      }
    };
    getUserInfo()
    fetchTotalCountryCitiesVisited()


  }, [profileUpdated,newDP]);
  const handleSaveProfile = async () => {
    console.log(userInfo, "profileData");
    let profileData = userInfo;
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${API_URL}api/users/profile/${userID}`,
        profileData
      );
      if (response.status === 200) {
        setProfileUpdated(true);
        setIsEditing(false);
        setIsSaving(false);

       router.push("/profile");
        // window.location.reload();
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSaving(false);
    }
  };
  useEffect(() => {
    fetchTrips();
  }, []);
  const fetchTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}api/trips`);
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };
  const handleUsernameChange = (e) => {
    setUserInfo({ ...userInfo, username: e.target.value });
  };
  const handleAboutChange = (e) => {
    setUserInfo({ ...userInfo, about: e.target.value });
  };
  const handleRegionChange = (e) => {
    setUserInfo({ ...userInfo, region: e.target.value });
  };
  const handleEmailChange = (e) => {
    setUserInfo({ ...userInfo, email: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setUserInfo({ ...userInfo, password: e.target.value });
  };
  const handleLanguageChange = (e) => {
    setUserInfo({ ...userInfo, language: e.target.value });
  };
  // delete user profile
  const deleteProfileHandel = () => {
    dispatch(deleteUserProfile(userID));
    setModalShow(false);
    handleLogout();
    router.push("/deleteduser");
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
  
    const uid = await localStorage.getItem("userID");
    const formData = new FormData();
    formData.append('dp', file);
    formData.append('userId', uid);
  
    try {
      const response = await fetch(`${API_URL}api/users/uploadDp`, {
        method: 'POST',
        
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.status) {
          setNewDP(file);
          setProfileUpdated(true);
        } else {
          alert(data.message); // Handle error message
        }
      } else {
        alert('File upload failed'); // Handle request error
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the file'); // Handle fetch error
    }
  };
  

  return (
    <>
      <div className="row px-lg-5 px-4 py-3">
        <div className=" col-lg-12 align-items-center gap-2 ">
          <div className="d-flex align-items-center gap-3">
            {userInfo?.dp && (
              <div>
                <div style={{ position: 'relative' }}>
                  <img
                    width={100}
                    height={100}
                    style={{
                      borderRadius: '50%',
                      marginBottom: '10px',
                    }}
                    src={`${Files_URL}${userInfo?.dp}`}
                    alt="profile"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{
                      display: 'none',
                    }}
                    onChange={handleImageChange}
                    ref={fileInputRef}
                  />
                  <FontAwesomeIcon
                    className="cursor-pointer"
                    icon={faPen}
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: 'black',
                      padding: '5px',
                      background: 'white',
                      borderRadius: '50%',
                    }}
                  />
                </div>
              </div>


            )}
            <div>
              <p >
                {userInfo?.about}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <h6 className={`fw-600 mb-0 mt-3 ${styles.aboutheader}`}>
                {userInfo?.username}
              </h6>
              <div>
                <h6 className="fw-600 mb-0 mt-3">{userInfo?.region}</h6>
                <p className="pt-3">
                  Where you've been:
                  {totalCities === 0 && totalCountries === 0 && " Nowhere yet"}
                  {totalCities === 1 &&
                    totalCountries === 1 &&
                    ` ${totalCities} city and ${totalCountries} country`}
                  {totalCities === 1 &&
                    totalCountries > 1 &&
                    ` ${totalCities} city and ${totalCountries} countries`}
                  {totalCities > 1 &&
                    totalCountries === 1 &&
                    ` ${totalCities} cities and ${totalCountries} country`}
                  {totalCities > 1 &&
                    totalCountries > 1 &&
                    ` ${totalCities} cities and ${totalCountries} countries`}
                </p>
              </div>
              <h6 className="fw-600 mb-3 mb-lg-4">
                Total Trips: {trips?.length}{" "}
              </h6>
              <h6 className="fw-600 mb-0 mt-3">
                Language : {userInfo?.language}
              </h6>
              <h6 className="fw-600 mb-4 mt-3">{userInfo?.email}</h6>
              {isSaving ? (
                <div className="spinner-border text-primary mt-3" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  className={`fw-600 cursor-pointer text-light savebtn1 mb-lg-0 mb-3 ${styles.editbtn}`}
                >
                  Save Profile
                </button>
              )}

              {profileUpdated && (
                <button
                  onClick={() => router.push("/profile")}
                  className={`mt-2 mt-lg-5 mb-5 fw-600 text-light savebtn1 cursor-pointer px-3 ${styles.editbtn}`}
                  style={{ marginLeft: '20px' }}
                >
                  Profile
                </button>
              )}

            </div>
            {/*  */}
            <div className="col-lg-7 col-md-6">
              <Form className="w--lg-5 w-100">
                <Form.Group controlId="email" className="">
                  <Form.Label className={styles.lablenames}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={userInfo?.email}
                    onChange={handleEmailChange}
                  />
                </Form.Group>
                <Form.Group controlId="username" className="mt-2">
                  <Form.Label className={styles.lablenames}>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={userInfo?.username}
                    onChange={handleUsernameChange}
                  />
                </Form.Group>
                <Form.Group controlId="about" className="mt-2">
                  <Form.Label className={styles.lablenames}>
                    About
                  </Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={userInfo?.about}
                    onChange={handleAboutChange}
                    maxLength={100}
                  />
                </Form.Group>
                <Form.Group controlId="region" className="mt-2 ">
                  <Form.Label className={styles.lablenames}>
                    Country / Region
                  </Form.Label>
                  <Form.Select
                    as="select"
                    defaultValue={userData?.userId?.region}
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
                    defaultValue={userData?.userId?.language}
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
                {/* <Form.Group controlId="password" className="mt-2 ">
                  <Form.Label className={styles.lablenames}>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Group> */}
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
            className={`mt-2 mt-lg-5 mb-5 fw-500 text-light savebtn1 cursor-pointer px-3 ${styles.editbtn}`}
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
          <div className="pt-3 px-3">
            <Modal.Header className="border-0" closeButton></Modal.Header>
          </div>
          <Modal.Body className="px-5 border-0">
            <h3>Are you sure you want to delete your account? </h3>
            <p className="pt-2">
              This means you will <strong>permanently delete</strong> your data
              and everything associated with the account.
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-around border-0 pb-4">
            <button
              type=""
              className={`mt-lg-5 mb-5 fw-500 br-0 text-light savebtn1 cursor-pointer px-3 ${styles.editbtn1}`}
              onClick={() => setModalShow(false)}
            >
              <h5 className="mb-0 fw-600" style={{ padding: '4px 25px' }}>No</h5>
            </button>
            <button
              className={`mt-lg-5 mb-5 fw-500 text-light savebtn1 cursor-pointer px-3 ${styles.editbtn1}`}
              type=""
              onClick={deleteProfileHandel}
            >
              <h5 className="mb-0 fw-600" style={{ padding: '4px 25px' }}>Yes</h5>
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
export default EditProfile;
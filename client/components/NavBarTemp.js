import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logo from "../public/images/logo.svg";
import men from "../public/images/men.svg";
import plusicon from "../public/images/plusicon.svg";
import earth from "../public/images/earth.webp";
import logout from "../public/images/logout.png";
import styles from "../styles/home.module.css";
import Image from "next/image";
import Link from "next/link";
import Searchbar from "./Searchbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { handleLogout } from "../website/Login/authUtils";
import { connect, useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../store/actions/recommendationActions";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import { fetchLoginUser } from "../store/actions/recommendationActions";

const Navbar = () => {
  const router = useRouter();
  const [modalShow, setModalShow] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const toggleSidebarclosed = () => {
    setIsOpen(false);
  };

  const handleReload = () => {
    router.push("/");
  };
  const handleLogout1 = () => {
    handleLogout();
    getLocalStorageState();
    router.push("/login");
  };

  // globe
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const [searchTerm, setSearchTerm] = useState("");
  const [userIDs, setUserID] = useState("");
  const [emails, setEmail] = useState(null);

  const { userID, email } = useSelector((state) => state.recommendation);
  console.log(userID, email, "authr");

  // const userID =
  //   typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  // const email =
  //   typeof window !== "undefined" ? localStorage.getItem("email") : null;

  const getLocalStorageState = () => {
    if (typeof window !== "undefined") {
      const storedUserID = localStorage.getItem("userID");
      const storedEmail = localStorage.getItem("email");
      setUserID(storedUserID);
      setEmail(storedEmail);
    }
  };
  useEffect(() => {
    getLocalStorageState();
  });

  const handleCreateItinerary = () => {
    if (!userID) {
      Swal.fire({
        text: "Please login to create an itinerary.",
        icon: "warning",
      }).then(() => {
        router.push("/login");
      });
    }
  };
  const handleCreateItinerary1 = () => {
    router.push("/createposts");
  };

  return (
    <>
      <div>
        <header className="container-fluid">
          <div
            className={`row d-flex align-items-center justify-content-between position-relative ${styles.headerhero}`}
          >
            <div
              className={`col-lg-3 d-flex justify-content-start ${styles.logo}`}
            >
              {/* logo */}
              <Link href="/" className="mx-3">
                <Image
                  onClick={handleReload}
                  width={270}
                  height={50}
                  className={styles.logoimage}
                  src={logo}
                  alt="logo"
                />
              </Link>
              {/* uploaes */}
              <div
                className={`icons-right col-xl-3 col-lg-3 col-md-3 col-sm-3 position-absolute d-flex justify-content-end align-items-center ${styles.right_box}`}
              >
                {userIDs && (
                  <Button
                    className="bg-transparent border-0 outline-none"
                    // onClick={() => setModalShow(true)}
                  >
                    <Link href="/globemap">
                      <Image
                        width={50}
                        height={50}
                        src={earth}
                        alt="earth"
                        style={{ objectFit: "contain" }}
                        className={`mx-3" ${styles.plusicon}`}
                      />
                    </Link>
                  </Button>
                )}

                {!userIDs ? (
                  <div onClick={handleCreateItinerary}>
                    <Image
                      width={50}
                      height={50}
                      src={plusicon}
                      alt="plusicon"
                      className={`mx-4 ${styles.plusicon}`}
                      style={{ cursor: !userID ? "not-allowed" : "pointer" }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={handleCreateItinerary1}
                    className="cursor-pointer"
                  >
                    {" "}
                    <Image
                      width={50}
                      height={50}
                      src={plusicon}
                      alt="plusicon"
                      className={`mx-4 ${styles.plusicon}`}
                    />
                  </div>
                )}

                <div>
                  <button style={{borderWidth:'0px',backgroundColor:'white'}} className="mx-3">
                    <FontAwesomeIcon
                      icon={faBars}
                      onClick={toggleSidebar}
                      style={{
                        fontSize: "30px",
                      }}
                    />
                    {/* Render the menu icon */}
                  </button>
                </div>
              </div>
            </div>
            {/* searchbar */}
            <div className="d-flex justify-content-center align-items-center">
              <Searchbar />
            </div>
          </div>

          {/* sidebar */}

          {isOpen && (
            <div className={` ${styles.rightsidebar}`}>
              <div className="position-relative w-100 d-flex justify-content-between">
                <div>
                  {userIDs ? (
                    <div>
                      {/* <Image
                        src={logout}
                        width={50}
                        height={50}
                        alt=""
                        onClick={handleLogout1}
                        className={`mx-3 object-fit-contain cursor-pointer ${styles.menicon}`}
                      /> */}
                    </div>
                  ) : (
                    <>
                      <div onClick={handleCreateItinerary}>
                        {/* Show "Create Itinerary" icon */}
                      </div>
                      {/* <Link href="/login">
                        <Image
                          width={50}
                          height={50}
                          marginTop={10}
                          src={men} // Show "Profile" icon for logged-out user
                          alt=""
                          className={`mx-3 ${styles.menicon}`}
                        />
                      </Link> */}
                    </>
                  )}
                </div>
                <button
                  className={`rounded-5 fw-600 text-info bg-light my-1 mx-3 d-flex justify-content-center align-items-center h4 mb-0 ${styles.crossdownbtn}`}
                  onClick={toggleSidebarclosed}
                >
                  x
                </button>
              </div>
              {userIDs && (
                <div className="">
                  <Dropdown.Item
                    className={styles.dropdownprofile}
                    style={{fontSize:'17px',marginTop:'3px'}}
                    href="/profile"
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={styles.dropdownprofile}
                    style={{fontSize:'17px'}}
                    href="/globemap"
                  >
                    Globe
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={styles.dropdownprofile}
                    style={{fontSize:'17px'}}
                    href="/upcomingtrips"
                  >
                    Upcoming Trips
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={styles.dropdownprofile}
                    href="/viewsave"
                    style={{fontSize:'17px'}}

                  >
                    Saved Posts
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={styles.dropdownprofile}
                    style={{fontSize:'17px'}}
                    onClick={handleLogout1}
                  >
                    Logout
                  </Dropdown.Item>
                </div>
              )}

              {!userIDs && (
                <div className="">
                  <Dropdown.Item
                    className={styles.dropdownprofile}
                    style={{fontSize:'17px',marginTop:'3px'}}
                    href="/login"
                  >
                    Login
                  </Dropdown.Item>
                </div>
              )}
            </div>
          )}
        </header>
      </div>
    </>
  );
};

// export default Navbar;
const mapStateToProps = (state) => ({
  recommendations: state.recommendation.recommendations,
  loading: state.recommendation.loading,
  error: state.recommendation.error,
});

const mapDispatchToProps = {
  fetchRecommendations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
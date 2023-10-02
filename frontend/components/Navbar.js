import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logo from "../public/images/logo.svg";
import men from "../public/Images/men.svg";
import plusicon from "../public/Images/plusicon.svg";
import earth from "../public/Images/earth.webp";
import logout from "../public/Images/logout.png";
import styles from "../styles/home.module.css";
import Image from "next/image";
import Link from "next/link";
import Searchbar from "./Searchbar";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { handleLogout } from "../website/Login/authUtils";
import { connect, useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../store/actions/recommendationActions";
import { useRouter } from "next/navigation";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Globe from "./Globe";
import { fetchLoginUser } from "../store/actions/recommendationActions";

const Navbar = () => {
  const router = useRouter();
  const [modalShow, setModalShow] = React.useState(false);
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
  const { recommendations, loading, error } = recommendationsData;
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
    router.push("/createitinerary");
  };

  return (
    <>
      <div>
        <header className="container-fluid">
          <div
            className={`row d-flex align-items-center position-relative ${styles.headerhero}`}
          >
            <div
              className={`col-xl-6 col-lg-6 col-md-6 col-sm-6  d-flex justify-content-start ${styles.logo}`}
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
                  <div className="mx-3">
                    <DropdownButton
                      id="dropdown-basic-button"
                      title="Pages"
                      variant="info"
                    >
                      <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                      <Dropdown.Item href="/globemap">Globe</Dropdown.Item>
                      <Dropdown.Item href="/upcomingtrips">
                        Upcoming Trips
                      </Dropdown.Item>
                      <Dropdown.Item href="/viewsave">
                        Saves Posts
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                )}
                <Button
                  className="bg-transparent border-0 outline-none"
                  // onClick={() => setModalShow(true)}
                >
                  <a href="/globemap">
                    <Image
                      width={50}
                      height={50}
                      src={earth}
                      alt="earth"
                      style={{ objectFit: "contain" }}
                      className={`mx-4" ${styles.plusicon}`}
                    />
                  </a>
                </Button>

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

                {userIDs ? (
                  <>
                    <Image
                      src={logout}
                      width={50}
                      height={50}
                      alt=""
                      onClick={handleLogout1}
                      className={`mx-3 object-fit-contain cursor-pointer ${styles.menicon}`}
                    />
                  </>
                ) : (
                  <>
                    <div onClick={handleCreateItinerary}>
                      {/* Show "Create Itinerary" icon */}
                    </div>
                    <Link href="/login">
                      <Image
                        width={50}
                        height={50}
                        src={men} // Show "Profile" icon for logged-out user
                        alt=""
                        className={`mx-3 ${styles.menicon}`}
                      />
                    </Link>
                  </>
                )}

                {/* <Image
                  src={logout}
                  width={50}
                  height={50}
                  alt=""
                  onClick={handleLogout1}
                  className={`mx-3 object-fit-contain cursor-pointer ${styles.menicon}`}
                /> */}
              </div>
            </div>
            {/* searchbar */}
            <div className="mr-5 d-flex w-100 justify-content-center">
              <Searchbar />
            </div>
          </div>
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

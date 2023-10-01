import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileicon from "../../public/images/men.svg";
import { fetchRecommendations } from "../../store/actions/recommendationActions";
import { fetchUserData } from "../../store/actions/userAction";
import styles from "../../styles/profile.module.css";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1663583784667-4a2a386fec62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1622397815608-359540676c67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1550850839-8dc894ed385a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=875&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1587162146766-e06b1189b907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=956&q=80",
  },
];

function Profile() {
  // const userIds = localStorage.getItem("userID");
  const userID =
    typeof window !== "undefined" ? localStorage.getItem("userID") : null;
  // fetch recommendation
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userId);

  // login Data id, email
  // const { userID, email } = useSelector((state) => state.recommendation);
  // console.log(userID, email, "userData");

  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  const [user, setUser] = useState(null);
  const recData = recommendations.Recommendations;
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    region: "",
    email: "",
    password: "",
  });

  const { username, region, email, password } = profileData;

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

  return (
    <>
      <div className="row px-5 py-3">
        <div className=" col-lg-4 align-items-center gap-2 ">
          <div className="d-flex align-items-center gap-3">
            <Image
              width={100}
              height={100}
              className={`${styles.menicon} mt-2`}
              src={profileicon}
              alt="profile"
            />
            <p>
              Fell in love with traveling and want to share my experiences with
              the world!
            </p>
          </div>
          <h6 className="fw-600 mb-0 mt-4">{user?.userId?.username}</h6>
          <p className="pt-3">Where you’ve been: 30 countries, 112 cities</p>
          <h6 className="fw-600 mb-3 mb-lg-4">Total shared experiences: 20 </h6>
          <Link
            href="/editprofile"
            className={` fw-600 cursor-pointer text-decoration-none fw-600 ${styles.editbtn}`}
          >
            Edit Profile
          </Link>
        </div>
        <div className="col-lg-8"></div>
      </div>

      <div className="container-fluid pb-4">
        <div className="row py-5 mt-4">
          <div className="col-12 col-md-4 col-lg-4 text-center justify-content-center d-flex">
            <Link
              href="/upcomingtrips"
              className="text-decoration-none text-light"
            >
              <button
                href="#"
                className={`d-flex align-items-center justify-content-start px-4 d-flex  ${styles.profilebutton}`}
              >
                <h6 className="mb-0 fw-600">Trips</h6>
              </button>
            </Link>
          </div>
          <div className="col-12 col-md-4 col-lg-4 text-center justify-content-center d-flex">
            <Link
              href="/recommendation"
              className="text-decoration-none text-light"
            >
              <button
                href="#"
                className={`text-center d-flex align-items-center justify-content-between fw-600 px-4 d-flex ${styles.profilebutton} ${styles.reccommendbtn}`}
              >
                Your Experiences
              </button>
            </Link>
          </div>
          <div className="col-12 col-md-4 col-lg-4 text-center">
            <Link href="/viewsave" className="text-decoration-none text-light">
              <button
                href="#"
                className={`text-center d-flex align-items-center justify-content-between px-4 d-flex ${styles.profilebutton} ${styles.heartbtn}`}
              >
                <h6 className="mb-0 fw-600">Saves</h6>
                <FontAwesomeIcon
                  className={styles.profileheart}
                  icon={faHeart}
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

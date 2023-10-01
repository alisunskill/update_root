import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profileicon from "../../../public/images/men.svg";
import styles from "../../../styles/profile.module.css";
// import Globe from "./Globe";

export default function Profile({ trips }) {
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
  console.log(recommendations.Recommendations, "recommendationsData");
  const [user, setUser] = useState(null);
  const recData = recommendations?.Recommendations;
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    region: "",
    email: "",
    password: "",
  });

  return (
    <div className=" align-items-center gap-2 ">
      <div className="d-flex align-items-center gap-3">
        <Image
          width={100}
          height={100}
          className={`${styles.menicon} mt-2`}
          src={profileicon}
          alt="profile"
        />
        <p>
          Fell in love with traveling and want to share my experiences with the
          world!
        </p>
      </div>
      <h6 className="fw-600 mb-0 mt-4">{user?.userId?.username}</h6>
      <p className="pt-3">
        Where you’ve been: {recommendations?.Recommendations?.length} countries
      </p>
      <h6 className="fw-600 mb-3 mb-lg-4">Total Trips: {trips?.length} </h6>
      <Link
        href="/editprofile"
        className={` fw-600 cursor-pointer text-decoration-none fw-600 ${styles.editbtn}`}
      >
        Edit Profile
      </Link>
    </div>
  );
}

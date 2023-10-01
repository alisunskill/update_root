import React from "react";
import styles from "../styles/footer.module.css";
import logo from "../public/images/flogo.svg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import twitter from "../public/images/twitter.png";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      <div className={`row justify-content-around m-0 ${styles.footer_main}`}>
        <div className={`col-md-12 col-lg-4 ${styles.footer_col}`}>
          <Link href="/">
            <Image className={styles.footer_1_logo} src={logo} alt="logo" />
          </Link>
          <p className="fw-400">
            Onroot app provides a comprehensive guide to events and activities
            around the world, with curated posts and itineraries to help you
            plan your next adventure with ease."
          </p>
        </div>
        <div className={`col-lg-2 col-md-4 col-sm-4 col-6 `}>
          <p className={styles.footer_heading}>Quick Links</p>
          <Link className={styles.footer_link} href="/">
            Home
          </Link>
          <Link className={styles.footer_link} href="/">
            About
          </Link>
          <Link className={styles.footer_link} href="/globemap">
            Globe
          </Link>
          <Link className={styles.footer_link} href="/">
            FAQs
          </Link>
        </div>
        <div className={`col-lg-2 col-md-4 col-sm-4 col-6 `}>
          <p className={styles.footer_heading}>Destinations</p>
          <Link className={styles.footer_link} href="/login">
            Login
          </Link>
          <Link className={styles.footer_link} href="/signup">
            Sign Up
          </Link>
          <Link className={styles.footer_link} href="/forgotpassword">
            Forgot Password
          </Link>
          <Link className={styles.footer_link} href="/">
            Terms & Conditions
          </Link>
        </div>
        <div
          className={`col-lg-2 col-md-4 col-sm-4 col-6 ${styles.socialhero}`}
        >
          <p className={styles.footer_heading}>Social Media</p>

          <div className="d-flex align-items-center gap-2">
            <Link target="_blank" href="https://www.facebook.com/">
              <FontAwesomeIcon className="mx-2 w-30px" icon={faFacebook} />
            </Link>
            <Link target="_blank" href="https://twitter.com/">
              <Image
                width={25}
                height={25}
                src={twitter}
                className="text-light rounded-5 bg-light p-1 mb-1"
                alt="twitter"
              />
            </Link>
            <Link target="_blank" href="https://www.instagram.com/">
              <FontAwesomeIcon className="mx-2 w-30px" icon={faInstagram} />
            </Link>
            <Link target="_blank" href="https://www.youtube.com/">
              <FontAwesomeIcon className="mx-2 w-30px" icon={faYoutube} />
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.footer_end}>
        Copyright © 2023 Onroot. All rights reserved. Developed by Sun Skill
        Techs
      </div>
    </div>
  );
}

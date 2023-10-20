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
      <div className={`row justify-content-between align-items-center m-0 ${styles.footer_main}`}>
        <div className={` col-lg-2 col-md-2 col-6 text-start ${styles.footer_col}`}>
          <Link className={styles.footer_link} href="/">
            About
          </Link>
        </div>
        <div className={` col-lg-2 col-md-2  col-6 text-start ${styles.footer_col}`}>
          <Link className={styles.footer_link} href="/">
            Terms of Service
          </Link>
        </div>
        <div className={`col-lg-2 col-md-2   col-6 text-start`}>
          <Link className={styles.footer_link} href="/">
            Privacy Policy
          </Link>
        </div>
        <div className={`col-lg-2 col-md-2   col-6 text-start `}>
          <Link className={styles.footer_link} href="/globemap">
            Contact Us
          </Link>
        </div>
        <div
          className={`col-lg-2 col-md-2  col-6 d-flex flex-column gap-2 justify-content-between align-items-lg-end mt-lg-0 mt-3 align-items-baseline pt-0 ${styles.socialhero}`}
        >
          <p className={styles.footer_heading}>Follow US</p>
          <div className="d-flex align-items-center gap-2 justify-content-end">
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
          </div>
        </div>
      </div>
      <div className={styles.footer_end}>
      Copyright © 2023 Onroot LLC. All rights reserved. Developed by Sun Skill Techs
      </div>
    </div>
  );
} 
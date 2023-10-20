import React from "react";
import styles from "../../../styles/home.module.css";
import Image from "next/image";

export default ({ newsletterimg, heading, title, para }) => {
  return (
    <div>
      <div className={`py-3`}>
        <h3 className={`mb-0 fw-700 text-center ${styles.newsletter}`}>
          {heading}{" "}
        </h3>

        <div className={` mt-4 pt-2 ${styles.landingcontainer}`}>
          <div className={`row border rounded-5 ${styles.newsltrhero}`}>
            <div
              className={`col-lg-6 ${styles.landingsection2leftcontainer} p-0`}
            >
              <Image
                src={newsletterimg}
                alt=""
                className={styles.landingnewsletterimage}
              />
            </div>

            <div className="col-lg-6 d-flex flex-column align-center justify-content-center">
              <div className={`${styles.offerbox} text-center`}>
                <h4 className="mb-0 fw-600">{title} </h4>
                <p className={`mb-0 ${styles.textgrey} mt-3`}>{para}</p>
                <div className="d-flex border w-100 justify-content-between px-1 rounded-5 mt-4">
                  <input
                    type="text"
                    placeholder="Email Address"
                    className={`${styles["landinginput1"]} ${styles["input1"]}`}
                  />
                  <a
                    style={{ textDecoration: "none" }}
                    href="#"
                    className={styles.landingbtnlast}
                  >
                    Subscribe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

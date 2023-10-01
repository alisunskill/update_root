import React from "react";

import foodicon from "../../public/Images/foodicon.svg";
import cultureicon from "../../public/Images/cultureicon.svg";
import hikingicon from "../../public/images/hikingicon.svg";
import styles from "../../styles/home.module.css";
import Image from "next/image";

export default function Sliders({ bgimg1, title, region, descriptor }) {
  const bgstyle = {
    backgroundImage: `url(${bgimg1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRpeat: "no-repeat",
  };
  return (
    <div className={`row w-100 p-0 m-0`}>
      <div className={`col-12 col-md-12 col-lg-12 p-0 m-0`}>
        <div
          className={`container-fluid d-flex justify-content-end align-items-center flex-column ${styles.bghut}`}
          style={bgstyle}
        >
          <div className="row p-0 m-0">
            <div className="col-12 col-md-12 col-lg-12 p-0 m-0">
              <div
                className={`${styles.landingiconcenter} d-flex justify-content-center gap-3 mb-4`}
              >
                {descriptor === "food" && (
                  <div className={styles.landingicon1}>
                    <Image
                      src={foodicon}
                      alt=""
                      className={styles.landingsection3icon}
                    />
                  </div>
                )}
                <br />

                {descriptor === "Art" && (
                  <div className={styles.landingicon1}>
                    <Image
                      src={cultureicon}
                      alt=""
                      className={styles.landingsection3icon}
                    />
                  </div>
                )}

                <br />

                {descriptor === "Hiking" && (
                  <div className={styles.landingicon1}>
                    <Image
                      src={hikingicon}
                      alt=""
                      className={styles.landingsection3icon}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.landingsection3content} pb-5 fw-600`}>
            <h5 className={`mb-0 fw-600`}>{title}</h5>
            <h5 className={`mb-0 fw-600`}>{region}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

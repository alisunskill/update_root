import React from "react";
import styles from "../../styles/post.module.css";
import Link from "next/link";
export default () => {
  return (
    <>
      <div className="container ">
        <div className="text-center">
          <h1 className={`${styles.signupheading} fw-600`}>Create a Post</h1>
          <p className="fw-500">
          Share your experiences with our global community.
            
          </p>
          <div className="row  justify-content-center">
            <div
              className={`col-3 col-md-3 col-lg-3.5     ${styles.post_card_wrapper}`}
            >
              <div className={`${styles.post_central} `}>
                <Link
                  href="/createitinerary"
                  className="text-decoration-none text-light"
                >
                  <h3 className="savebtn2 fw-600 px-4"> Itinerary </h3>
                </Link>
              </div>
            </div>

            <div
              className={` col-3 col-md-3 col-lg-3.5    ${styles.post_card_wrapper}`}
            >
              <div className={`${styles.post_central1} `}>
                <Link
                  href="/singleitinerarypost"
                  className="savebtn2 px-4 text-decoration-none text-light"
                >
                  <h3 className="mb-0 fw-600"> Event</h3>
                </Link>
              </div>
            </div>
          </div>
          <br /> <br />
          <div className="text-light text-center mb-4">
            {/* <button className="savebtn1">Next</button> */}
            <Link
              href="/createitinerary"
              className="text-decoration-none text-light"
            >
              <button style={{color:'white'}} className="savebtn1">Next</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import newsletterimg from "../../public/images/card-two.svg";
import styles from "../../styles/viewsave.module.css";
import NewsLetter from "../../website/components/NewsLetter";
import PlaceFullSubCard from "../components/PlaceFullSubCard";
import Trip from "./components/Trip";
import calender from "../../public/images/calender.svg";
import Image from "next/image";

const eventData = [
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
  },
];
const eventData1 = [
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
  },
];
const eventData2 = [
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
  },
  {
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
    itinerary: "ITINERARY",
    title: "POST TITLE HERE",
    place: "City, Country",
  },
];
function ViewTrips() {
  const [showcalender, setShowcalender] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  return (
    <>
      <div className="container-fluid">
        <div className="row px-4">
          <h1 className="dark bold fw-700 pt-4 text-center mb-4">Asia</h1>
          <div className="col-lg-4 first-card position-relative">
            <div
              className={` d-flex flex-column justify-content-center align-items-center text-center  ${styles.yoursave_image1}`}
            >
              <div className="col-lg-12 yoursave_text">
              <Image
              src={calender}
              onClick={() => setModalShow(true)}
              className={styles.plusicon4}
            />
                <div className="text-center w-100  d-flex justify-content-center align-items-center">
                  <Trip
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    setModalShow={setModalShow}
                  />
                </div>{" "}
                <p className="letterspac">ITINERARY</p>
                <h3 className="landingeventheading"> Saved Activity 1 </h3>
                <p className="mb-0 fw-500">Paris, France</p>
              </div>
            </div>
            <div className="row ">
              <div className="col-lg-12 col-md-12 pt-0 mt-0">
                <div
                  className={`row  d-flex justify-content-center align-items-center ${styles.landingendcard1}`}
                  style={{ background: "white" }}
                >
                  <Trip
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    setModalShow={setModalShow}
                  />
                  {eventData1.map((item, index) => {
                    return (
                      <PlaceFullSubCard
                        key={index}
                        imageUrl={item.bgImg}
                        showcalender={showcalender}
                        itinerary={item.itinerary}
                        title={item.title}
                        place={item.place}
                        time={item.time}
                        setModalShow={setModalShow}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-lg-12 col-md-12 pt-0 mt-0">
                <div
                  className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                  style={{ background: "white" }}
                >
                  <Trip show={modalShow} onHide={() => setModalShow(false)} />
                  {eventData.map((item, index) => {
                    return (
                      <PlaceFullSubCard
                        key={index}
                        imageUrl={item.bgImg}
                        showcalender={showcalender}
                        itinerary={item.itinerary}
                        title={item.title}
                        place={item.place}
                        time={item.time}
                        setModalShow={setModalShow}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4 first-card">
                <div className={styles.yoursave_image1}>
                  <div
                    className={`col-lg-12 position-relative d-flex flex-column justify-content-center align-items-center text-center  ${styles.yoursave_text}`}
                  >
         
                    <Image src={calender}   onClick={() => setModalShow(true)}
                      className={styles.plusicon3} />
                    <Trip show={modalShow} onHide={() => setModalShow(false)} />
                    <p className="fw-500 ltr-shrt-spec">ITINERARY</p>
                    <h3 className="landingeventheading"> Saved Activity 1 </h3>
                    <p className="mb-0 fw-500">Paris, France</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div
                  className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                  style={{ background: "white" }}
                >
                  {eventData2.map((item, index) => {
                    return (
                      <PlaceFullSubCard
                        key={index}
                        imageUrl={item.bgImg}
                        showcalender={showcalender}
                        itinerary={item.itinerary}
                        title={item.title}
                        place={item.place}
                        time={item.time}
                        setModalShow={setModalShow}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <NewsLetter
          newsletterimg={newsletterimg}
          heading={"Subscribe to our Newsletter"}
          title={"Get Special Offers and more from Traveller"}
          para={
            "Subscribe to see secret deals prices drop the moment you sign up!"
          }
        />
      </div>
      <br />
    </>
  );
}

export default ViewTrips;

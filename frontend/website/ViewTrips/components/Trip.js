import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../../styles/viewsave.module.css";
import NewTrip from "./NewTrip";
import MyCalendar from "./MyCalendar";
export default function Trip(props, setModalShow) {
  const [modalTrip, setModalTrip] = React.useState(false);
  const handleClick = () => {
    setModalTrip(true);
    // setModalShow(false)
  };
  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          closeButton
          style={{ padding: "20px 40px", border: "none" }}
        ></Modal.Header>
        <Modal.Body style={{ padding: "20px 40px 40px 40px" }}>
          <MyCalendar />
          <button
            className={`fw-500 text-center ${styles.herobtn}`}
            onClick={handleClick}
            onHide={() => setModalShow(false)}
          >
            Save
          </button>
        </Modal.Body>
      </Modal>
      {/* New Trip */}
      <div className="text-center w-100  d-flex justify-content-center align-items-center">
        <NewTrip show={modalTrip} onHide={() => setModalTrip(false)} />
      </div>
    </div>
  );
}

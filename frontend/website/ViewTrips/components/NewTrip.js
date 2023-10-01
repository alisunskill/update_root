import React from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../../styles/viewsave.module.css";
import Form from "react-bootstrap/Form";

export default function NewTrip(props) {
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
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            className={`text-center w-100 ${styles.thumbnail}`}
          >
            Thumbnail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 40px 20px 40px" }}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="file"
                className="py-lg-3 py-md-2"
                placeholder="Choose a File"
              />
              <Form.Control
                type="text"
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Enter the Title of the trip"
              />

              <Form.Control
                type="text"
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Enter Address or Select a Location"
              />

              <Form.Control
                type="email"
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Add Collaborators (Email or Username)"
              />

              <Form.Control
                type="text"
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Start Date"
              />

              <Form.Control
                type="text"
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Start Date"
              />
              <button className={`text-center fw-500 ${styles.herobtn}`}>
                Finish
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

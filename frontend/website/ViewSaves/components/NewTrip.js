import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../../styles/viewsave.module.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { API_URL } from "../../../apiConfig";
import FileBase64 from "react-file-base64";
import { useRouter } from "next/router";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css";

export default function NewTrip(props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    image: "",
    region: "",
    email: "",
    sdate: "",
    edate: "",
  });
  const onSelectImage = (file) => {
    const imageBase64 = file.base64.toString();
    setFormData((prevData) => ({
      ...prevData,
      image: imageBase64,
    }));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleCreate = async () => {
    try {
      const response = await axios.post(`${API_URL}api/trips`, formData);
      router.push("/createdtrips");

      console.log(response.data);

      props.onHide();
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <div>
      <Modal
        {...props}
        size="md"
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
            Create Trip
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px 40px 20px 40px" }}>
          {/* <img
                  src={props.selectedImage}
                  alt="tripimg"
                  className={styles.smallimg1}
                /> */}
          {formData.image ? (
            <img
              src={formData.image}
              alt="tripimg"
              className={styles.smallimg1}
            />
          ) : (
            ""
          )}
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <h5>Choose an Image</h5>
              <div
                style={{
                  border: "0.5px solid #dee2e6",
                  borderRadius: "4px",
                  padding: "10px",
                  height: "50px",
                }}
              >
                <div className="placeholder-text">Choose an image</div>
                <div
                  style={{
                    fontSize: "20px",
                    height: "42px",
                    position: "relative",
                    top: "-25px",
                    color: "transparent",
                  }}
                >
                  <FileBase64
                    name="image"
                    value={formData.image}
                    onDone={onSelectImage}
                  />
                </div>
              </div>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Enter the Title of the Trip"
              />
              {/* 
              <Form.Control
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Enter the Region "
              /> */}
              <PlacesAutocomplete
                value={formData.region}
                onChange={(value) => {
                  setFormData((prevData) => ({ ...prevData, region: value }));
                }}
                onSelect={async (value) => {
                  try {
                    const results = await geocodeByAddress(value);
                    const latLng = await getLatLng(results[0]);
                    console.log("Selected Location:", value);
                    console.log("Coordinates:", latLng);
                    setFormData((prevData) => ({ ...prevData, region: value }));
                  } catch (error) {
                    console.error("Error:", error);
                  }
                }}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div>
                    <Form.Control
                      {...getInputProps({
                        placeholder: "Enter the Region",
                        className: "py-lg-3 py-md-2 mt-3",
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const style = {
                          backgroundColor: suggestion.active
                            ? "#41b6e6"
                            : "#fff",
                        };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              style,
                              className: "suggestion-item",
                            })}
                          >
                            {suggestion.description}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>

              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Add Collaborators (Email)"
              />

              {/* <Form.Control
                type="date"
                name="sdate"
                value={formData.sdate}
                onChange={handleChange}
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Start Date"
              />

              <Form.Control
                type="date"
                name="edate"
                value={formData.edate}
                onChange={handleChange}
                className="py-lg-3 py-md-2 mt-3"
                placeholder="Start Date"
              /> */}

              <DatePicker
                selected={formData.sdate}
                onChange={(date) =>
                  setFormData((prevData) => ({ ...prevData, sdate: date }))
                }
                className={`py-lg-3 py-md-2 mt-3 form-control ${styles.datepicke_wrapper}`}
                placeholderText="Start Date"
              />
              <br />
              <DatePicker
                selected={formData.edate}
                onChange={(date) =>
                  setFormData((prevData) => ({ ...prevData, edate: date }))
                }
                className={`py-lg-3 py-md-2 mt-3 form-control ${styles.datepicke_wrapper}`}
                placeholderText="End Date"
              />

              <button
                className={`text-center fw-500 ${styles.herobtn}`}
                onClick={handleCreate}
              >
                Create Trip
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

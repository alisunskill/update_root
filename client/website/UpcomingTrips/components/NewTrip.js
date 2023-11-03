import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { API_URL } from "../../../apiConfig";
// import moment from "moment";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from '@mui/material/Alert';
 
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import styles from "../../../styles/viewsave.module.css";
 
export default function NewTrip(props) {
  const router = useRouter();
  const [hasError,setHasError]=useState(false)
  
  const [formData, setFormData] = useState({
    region: "",
    email: "",
    sdate: new Date(),
    edate: new Date(),
    userID: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleCreate = async (event) => {
    event.preventDefault();

    if (
      !formData.title ||
      //!formData.region ||
      !formData.email ||
      !formData.sdate ||
      !formData.edate
    ) {
      Swal.fire({
        text: "Please fill in all the required fields",
        icon: "info",
      });
      return;
    }

    try {
      // const response = await axios.post(
      //   "http://localhost:8000/api/trips",
      //   formData
      // );
      const response = await axios.post(`${API_URL}api/trips`, formData);
      // router.push("/");
      if(response.data.status){
        location.reload();      props.onHide();
        setHasError(false)

      }
      else {
        //alert(response.data.message)
        setHasError(true)
      }
      
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    setFormData((prevData) => ({ ...prevData, userID }));
  }, []);

  const handleStartDateChange = (date) => {
    if (date > formData.edate) {
      // You can choose to show an error message or prevent the change in another way
      // For now, let's just set the start date to the current selected end date
      setFormData((prevData) => ({ ...prevData, sdate: formData.edate }));
    } else {
      setFormData((prevData) => ({ ...prevData, sdate: date }));
    }
  };
  
  const handleEndDateChange = (date) => {
    if (date < formData.sdate) {
      // You can choose to show an error message or prevent the change in another way
      // For now, let's just set the end date to the current selected start date
      setFormData((prevData) => ({ ...prevData, edate: formData.sdate }));
    } else {
      setFormData((prevData) => ({ ...prevData, edate: date }));
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
            className={`text-center fw-600 w-100 ${styles.thumbnail}`}
          >
            Create a new trip{" "}
          </Modal.Title>
          
        </Modal.Header>
        {hasError && (
          <Alert variant="filled" severity="error">
          A trip already exists for this date range.
        </Alert>
          )}
        <Modal.Body style={{ padding: "0px 40px 20px 40px" }}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="py-lg-3 py-md-2 mt-3 rounded-5"
                placeholder="Enter the Title"
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
                        className: "py-lg-3 py-md-2 mt-3 rounded-5",
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
                className="py-lg-3 py-md-2 mt-3 rounded-5"
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
      onChange={handleStartDateChange}
      minDate={new Date()}
      className={`py-lg-3 py-md-2 mt-3 form-control rounded-5 ${styles.datepicke_wrapper}`}
      placeholderText="Start Date"
    />
    <br />
    <DatePicker
      selected={formData.edate}
      onChange={handleEndDateChange}
      minDate={formData.sdate || new Date()}
      className={`py-lg-3 py-md-2 mt-3 form-control rounded-5 ${styles.datepicke_wrapper}`}
      placeholderText="End Date"
    />

              <button
                className={`text-center fw-500 rounded-5 ${styles.herobtn}`}
                onClick={handleCreate}
              >
                Finish
              </button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

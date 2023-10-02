import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { API_URL } from "../../apiConfig";
import Sliderm from "@mui/material/Slider";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import burger from "../../public/images/burger.svg";
import filter from "../../public/images/filter.svg";
import painticon from "../../public/images/painticon.svg";
import travelicon from "../../public/images/travelicon.svg";
import { fetchRecommendations } from "../../store/actions/recommendationActions";
import styles from "../../styles/home.module.css";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import NewsLetter from "../../website/components/NewsLetter";
import Form from "react-bootstrap/Form";
import RecommendationGrid from "../../website/components/RecommendationGrid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Modal from "react-bootstrap/Modal";
import { miniSerializeError } from "@reduxjs/toolkit";

function valuetext(value) {
  return `${value}°C`;
}

export default ({ data1 }) => {
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const [searchTerm, setSearchTerm] = useState("");
  const { recommendations, loading, error } = recommendationsData;
  const [modalShow, setModalShow] = useState(false);
  const [selectedDescriptors, setSelectedDescriptors] = useState([]);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("searchTerm");
      setSearchTerm(storedValue);
    }
  }, [searchTerm]);

  // api
  const [regionData, setRegion] = useState([]);
  const router = useRouter();
  const { region } = router.query;
  const { descriptor } = router.query;
  const { min, max } = router.query;
  const [filteredData, setFilteredData] = useState([]);
  const [selectedValue, setSelectedValue] = React.useState("a");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [value, setValue] = useState([min || 0, max || 1000]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1550);
  const [filterPrice, setFilterPrice] = useState();

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    if (region) {
      axios
        // .get(`http://localhost:8000/api/recommendations?region=${region}`)
        .get(`${API_URL}api/recommendations?region=${region}`)
        .then((response) => {
          const data = response.data;
          const cregion = data.Recommendations;
          setFilteredData(cregion);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [region]);



  const recommendationData =
    (recommendations && recommendations.Recommendations) || [];
  useEffect(() => {
    setRegion(recommendationData);
  }, [regionData]);

  const handleDescriptorChange = (descriptor) => {
    if (selectedDescriptors.includes(descriptor)) {
      setSelectedDescriptors(
        selectedDescriptors.filter((d) => d !== descriptor)
      );
    } else {
      // If the descriptor is not selected, add it
      setSelectedDescriptors([...selectedDescriptors, descriptor]);
    }
  };

  // region urls
  useEffect(() => {
    if (region) {
      const filteredRegionData = regionData.filter(
        (item) => item.region === region
      );
      setFilteredData(filteredRegionData);
    }
  }, [region, regionData]);
  // discripttors urls
  useEffect(() => {
    if (descriptor) {
      const filteredDescriptorData = regionData.filter(
        (item) => item.descriptor === descriptor
      );
      setFilteredData(filteredDescriptorData);
    }
  }, [descriptor, regionData]);

  useEffect(() => {
    if (recommendations && recommendations.Recommendations?.length > 0) {
      const minCost = Math.min(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      const maxCost = Math.max(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      setMinValue(minCost);
      setMaxValue(maxCost);
      if (value[0] < minCost || value[1] > maxCost) {
        setValue([minCost, maxCost]);
      }
    }
  }, [value, recommendations]);

  const handleRegionChange = (region) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter((r) => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  // preice range
  useEffect(() => {
    if (recommendations && recommendations.Recommendations?.length > 0) {
      const minCost = Math.min(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      const maxCost = Math.max(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      setMinValue(minCost);
      setMaxValue(maxCost);
      if (value[0] < minCost || value[1] > maxCost) {
        setValue([minCost, maxCost]);
      }
    }
  }, [value, recommendations]);

  const handleChanges1 = (event, newValue) => {
    setValue(newValue);
  };

  const handleApply = () => {
    const descriptorQuery =
      selectedDescriptors.length > 0
        ? `descriptor=${selectedDescriptors.join(",")}`
        : "";

    const regionQuery =
      selectedRegions.length > 0 ? `region=${selectedRegions.join(",")}` : "";
    const minQuery = `min=${value[0]}`;
    const maxQuery = `max=${value[1]}`;

    const queryParams = [descriptorQuery, regionQuery, minQuery, maxQuery]
      .filter((param) => param)
      .join("&");

    const url = `/infinitescroll?${queryParams}`;
    router.push(url);
  };

  const resetHandle = () => {
    setSelectedDescriptors([]);
    setSelectedRegions([]);
    setValue([0, 1000]);
    setSelectedValue("a");
    setModalShow(false);
  };
  return (
    <>
      {!searchTerm?.length > 0 && (
        <div>
          <div>
            {filteredData.map((item) => (
              <div key={item.title}>
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
          <div
            className={`d-flex align-content-center px-3 mx-5 my-4 ${styles.filterhero}`}
            onClick={() => setModalShow(true)}
          >
            <h6 className="fw-600 mb-0">Filters</h6>
            <Image width={30} height={20} src={filter} alt="filter" />
          </div>

          {/* Modal */}
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title
                id="contained-modal-title-vcenter "
                className="amgray text-center w-100 fw-600"
              >
                Filters
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-lg-5 px-3">
              {/* region */}
              <h5 className="amgray">Price Range</h5>
              <div className="d-flex gap-3 flex-wrap">
                {/* <RangeSlider /> */}
                <div className="d-flex justify-content-center">
                  <Box sx={{ width: 275 }}>
                    <Sliderm
                      getAriaLabel={() => "Price range"}
                      value={value}
                      onChange={handleChanges1}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      // min={minValue}
                      // max={1000}
                      min={minValue}
                      max={maxValue}
                    />
                    <div>
                      Min: ${value[0]} &#160; &#160; Max: ${value[1]}
                    </div>
                  </Box>
                </div>
              </div>

              {/* REgions */}
              <div className="row w-100 p-0 mb-4 mt-3">
                <h5 className="amgray py-3">Filtered By Region</h5>

                <div className="d-flex gap-3 flex-wrap">
                  <RadioGroup
                    aria-label="radio-buttons"
                    name="radio-buttons"
                    value={selectedValue}
                    onChange={handleChange}
                    className="d-flex flex-row"
                  >
                    {regionData.map((item, index) => (
                      <div key={index} className={styles.regionbox}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedRegions.includes(item.title)}
                              onChange={() => handleRegionChange(item.title)}
                            />
                          }
                          label={item.title}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Descriptors */}
              <h5 className="amgray mt-3">Descriptors</h5>

              <div className="py-3 py-lg-5">
                <div
                  className={`btn-group px-2 d-flex w-100 d-flex align-center justify-content-between `}
                >
                  <div
                    className={`justify-between d-flex text-decoration-none  gap-3 px-3 py-2 ${
                      styles.descripthero
                    }  ${
                      selectedDescriptors.includes("food")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("food")}
                  >
                    <Image
                      className={`h-auto ${styles.foodIcons}`}
                      src={burger}
                      alt=""
                    />
                    <span>Food</span>
                  </div>
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-3 px-3 py-2 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors.includes("Hiking")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("Hiking")}
                  >
                    <Image
                      className={`h-auto ${styles.foodIcons}`}
                      src={travelicon}
                      alt=""
                    />
                    <span>Hiking</span>
                  </div>
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center gap-3 px-3 py-2 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors.includes("Art") ? styles.selected : ""
                    }`}
                    onClick={() => handleDescriptorChange("Art")}
                  >
                    <Image
                      className={`h-auto ${styles.foodIcons}`}
                      src={painticon}
                      alt=""
                    />
                    <span>Art</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mb-3 py-3">
                <button
                  type=""
                  className="savebtn text-light"
                  onClick={resetHandle}
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  type=""
                  className="savebtn text-light"
                >
                  Apply
                </button>
              </div>
            </Modal.Body>
          </Modal>

          <div
            className={`row  ${styles.globalhero}`}
            style={{ marginBottom: "20px;" }}
          >
            {/* Events Zone */}
            <div className={`col-lg-12 p-0`}>
              <RecommendationGrid data={recommendationData} />
            </div>

            <div className="row pt-lg-5 pt-5 pb-3">
              <div className="col-12  pt-4 text-center">
                <h5 className="fw-500">
                  Oops, looks like there’s no more to show.
                </h5>
                <br />
                <h5 className="fw-500">
                  Try searching for another destination or make a post of your
                  own!
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

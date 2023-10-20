// FilterModalComponent.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Slider,
  RadioGroup,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { fetchRecommendations } from "../../../store/actions/recommendationActions";
import Sliderm from "@mui/material/Slider";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { API_URL } from "../../../apiConfig";
import styles from "../../../styles/home.module.css";
import burger from "../../../public/images/burger.svg";
import filter from "../../../public/images/filter.svg";
import painticon from "../../../public/images/painticon.svg";
import travelicon from "../../../public/images/travelicon.svg";

function valuetext(value) {
  return `${value}°C`;
}

const FilterModalComponent = ({minCost,maxCost,descriptor,region}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux state
  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData || {};

  // Component state
  // const [recommendationsData, setRecommendationsData] = useState([]);
  const [regionData, setRegion] = useState();
  const [selectedValue, setSelectedValue] = useState("a");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDescriptors, setSelectedDescriptors] = useState(descriptor);
  const [selectedRegions, setSelectedRegions] = useState(region);
  const [value, setValue] = useState([0, 1000]);
  const [modalShow, setModalShow] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const [minValue1, setMinValue1] = useState(0);
  const [maxValue, setMaxValue] = useState(1550);
  const [maxValue1, setMaxValue1] = useState(1550);
  const [filterPrice, setFilterPrice] = useState();
  // Fetch recommendations on component mount

  console.log(recommendationsData, "recommendationsData");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };



  useEffect(() => {
    if (router.query.region) {
      axios
        .get(`${API_URL}api/recommendations?region=${router.query.region}`)
        .then((response) => {
          const data = response.data;
          const cregion = data.Recommendations;
          setFilteredData(cregion);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [router.query.region]);

  const recommendationData =
    (recommendations && recommendations.Recommendations) || [];

  useEffect(() => {
    if (recommendations && recommendations.Recommendations?.length > 0) {
      const minCost = Math.min(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      const maxCost = Math.max(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      setMinValue(minCost);
      setMinValue1(minCost);
      setMaxValue(maxCost);
      setMaxValue1(maxCost)
      if (value[0] < minCost || value[1] > maxCost) {
        setValue([minCost, maxCost]);
      }
    }
  }, [value, recommendations]);
  useEffect(() => {
    setRegion(recommendationData);
  }, [regionData]);
  // Filter and update data based on region and descriptors
  useEffect(() => {
    if (router.query.region && recommendations) {
      const filteredRegionData = recommendations.Recommendations.filter(
        (item) => item.region === router.query.region
      );

      const filteredDescriptorData = filteredRegionData.filter((item) =>
        selectedDescriptors.length
          ? selectedDescriptors.includes(item.descriptor)
          : true
      );

      const filteredDataByRegionAndDescriptors = filteredDescriptorData.filter(
        (item) =>
          selectedRegions.length ? selectedRegions.includes(item.region) : true
      );

      setFilteredData(filteredDataByRegionAndDescriptors);
    }
  }, [
    router.query.region,
    recommendations,
    selectedDescriptors,
    selectedRegions,
  ]);

  // Handle descriptor selection
  const handleDescriptorChange = (descriptor) => {
    setSelectedDescriptors((prevDescriptors) =>
      prevDescriptors?.includes(descriptor)
        ? prevDescriptors.filter((d) => d !== descriptor)
        : [...prevDescriptors, descriptor]
    );
  };

  // Handle region selection
  const handleRegionChange = (region) => {
    setSelectedRegions((prevRegions) =>
      prevRegions?.includes(region)
        ? prevRegions.filter((r) => r !== region)
        : [...prevRegions, region]
    );
  };

  const handleChanges1 = (event, newValue) => {
    setValue(newValue);
  };

  const handleApply = () => {
    const descriptorQuery =
      selectedDescriptors?.length > 0
        ? `descriptor=${selectedDescriptors.join(",")}`
        : "";

    const regionQuery =
      selectedRegions?.length > 0 ? `region=${selectedRegions}` : "";
    const minQuery = `min=${value[0]}`;
    const maxQuery = `max=${value[1]}`;

    const queryParams = [descriptorQuery, regionQuery, minQuery, maxQuery]
      .filter((param) => param)
      .join("&");
    
      setModalShow(false);

    const url = `/infinitescroll?${queryParams}`;
    router.push(url);
  };

  const resetHandle = () => {
    setSelectedDescriptors([]);
    setSelectedRegions([]);
    setValue([0, 1000]);
    setSelectedValue("a");
    setMaxValue(maxValue1);
    setMinValue(minValue1)
   // setModalShow(false);
  };
  return (
    <div>
      <div
        className={`d-flex align-content-center px-3 ${styles.filterhero}`}
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
        className={styles.filterherobox}
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
            <h5 className="amgray py-3">Region</h5>

            <div className="d-flex gap-3 flex-wrap">
              <RadioGroup
                aria-label="radio-buttons"
                name="radio-buttons"
                value={selectedValue}
                onChange={handleChange}
                className="d-flex flex-row"
              >
                {regionData &&
                  regionData?.map((item, index) => (
                    <div key={index} className={styles.regionbox}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedRegions?.includes(item.location)}
                            onChange={() => handleRegionChange(item.location)}
                          />
                        }
                        label={item.location}
                      />
                    </div>
                  ))}
              </RadioGroup>
            </div>
          </div>

          {/* Descriptors */}
          <h5 className="amgray mt-3">Descriptors </h5>

          <div className="py-3 py-lg-5">
            <div
              className={`btn-group px-2 gap-lg-0 gap-2 d-flex d-flex align-items-center justify-content-between flex-wrap gap-lg-0 gap-2`}
            >
              <div
                className={`justify-between d-flex text-decoration-none  gap-3 px-lg-3 py-2 ${styles.descripthero
                  }  ${selectedDescriptors?.includes("food") ? styles.selected : ""
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
                className={`justify-between d-flex text-decoration-none align-items-center  gap-3 px-lg-3 px-1 py-2 ${styles.descripthero
                  } ${selectedDescriptors?.includes("Hiking") ? styles.selected : ""
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
                className={`justify-between d-flex text-decoration-none align-items-center gap-3 px-lg-3 px-1 py-2 ${styles.descripthero
                  } ${selectedDescriptors?.includes("Art") ? styles.selected : ""
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
            <button type="" className="savebtn text-light" onClick={resetHandle}>
              Reset
            </button>
            <button onClick={handleApply} type="" className="savebtn text-light">
              Apply
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FilterModalComponent;
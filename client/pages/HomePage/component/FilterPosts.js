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
import culture from "../../../public/images/descriptors/culture.svg";
import sculture from "../../../public/images/descriptors/sculture.svg";
import thrills from "../../../public/images/descriptors/thrills.svg";
import sthrills from "../../../public/images/descriptors/sthrills.svg";
import food from "../../../public/images/descriptors/food.svg";
import sfood from "../../../public/images/descriptors/sfood.svg";

import fgroup from "../../../public/images/descriptors/fgroup.svg";
import sfgroup from "../../../public/images/descriptors/sfgroup.svg";
import family from "../../../public/images/descriptors/family.svg";
import sfamily from "../../../public/images/descriptors/sfamily.svg";
import hanged from "../../../public/images/descriptors/hanged.svg";
import shanged from "../../../public/images/descriptors/shanged.svg";

import guitar from "../../../public/images/descriptors/guitar.svg";
import sguitar from "../../../public/images/descriptors/sguitar.svg";
import nature from "../../../public/images/descriptors/nature.svg";
import snature from "../../../public/images/descriptors/snature.svg";
import relaxation from "../../../public/images/descriptors/relaxation.svg";
import srelaxation from "../../../public/images/descriptors/srelaxation.svg";

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
  const [selectedDescriptors, setSelectedDescriptors] = useState(descriptor?.split(','));
  const [selectedRegions, setSelectedRegions] = useState(region?.split(','));
  const [value, setValue] = useState([0, 1000]);
  const [modalShow, setModalShow] = useState(false);
  const [minValue, setMinValue] = useState(minCost);
  const [minValue1, setMinValue1] = useState(0);
  const [maxValue, setMaxValue] = useState(maxCost);
  const [maxValue1, setMaxValue1] = useState(1550);
  const [filterPrice, setFilterPrice] = useState();
  // Fetch recommendations on component mount

  console.log(selectedRegions, "selectedRegionsselectedRegions");

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
      const minCostt = Math.min(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      const maxCostt = Math.max(
        ...recommendations.Recommendations.map((post) => post.cost)
      );
      if(!minCost){
        setMinValue(minCostt);
      }
      if(!maxCost){
        setMaxValue(maxCostt);
      }
      setMinValue1(minCostt);
     setMaxValue1(maxCostt)
      if (value[0] < minCostt || value[1] > maxCostt) {
        setValue([minCostt, maxCostt]);
      }
    }
  }, [value, recommendations]);
  useEffect(() => {
    // Use a Set to keep track of unique locations
    const uniqueLocations = new Set();

    // Filter recommendations to remove duplicates based on the 'location' attribute
    const filteredRecommendations = recommendationData.filter((recommendation) => {
      if (!uniqueLocations.has(recommendation.location)) {
        uniqueLocations.add(recommendation.location);
        return true;
      }
      return false;
    });

    // Set the 'region' state with filtered recommendations
    setRegion(filteredRecommendations);
  }, [recommendationData]);
  // Filter and update data based on region and descriptors
  useEffect(() => {
    if (router.query.region && recommendations) {
      const filteredRegionData = recommendations.Recommendations.filter(
        (item) => item.region === router.query.region
      );

      const filteredDescriptorData = filteredRegionData.filter((item) =>
        selectedDescriptors?.length
          ? selectedDescriptors?.includes(item.descriptor)
          : true
      );

      const filteredDataByRegionAndDescriptors = filteredDescriptorData.filter(
        (item) =>
          selectedRegions?.length ? selectedRegions?.includes(item.region) : true
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
    setSelectedDescriptors((prevDescriptors) => {
      if (!prevDescriptors || prevDescriptors.length === 0) {
        // If prevDescriptors is empty or undefined, return a new array with the descriptor
        return [descriptor];
      }
  
      return prevDescriptors.includes(descriptor)
        ? prevDescriptors.filter((d) => d !== descriptor)
        : [...prevDescriptors, descriptor];
    });
  };
  

  // Handle region selection
  const handleRegionChange = (region) => {
    setSelectedRegions((selectedRegions) => {
      if (!selectedRegions || selectedRegions?.length === 0) {
        // If prevRegions is empty or undefined, return a new array with the region
        return [region];
      }
  
      return selectedRegions?.includes(region)
        ? selectedRegions?.filter((r) => r !== region)
        : [...selectedRegions, region];
    });
  };
  

  const handleChanges1 = (event, newValue) => {
    setValue(newValue);
  };

  const handleApply = () => {
    const descriptorQuery =
      selectedDescriptors?.length > 0
        ? `descriptor=${selectedDescriptors?.join(",")}`
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
            className={`d-flex align-content-center px-3 mx-lg-5 mx-4 my-lg-4 my-md-2 my-2  ${styles.filterhero}`}
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
            className={styles.filteredboxhero}
          >
            <Modal.Header closeButton className="border-0 mt-2  px-lg-4 px-2">
              <Modal.Title
                id="contained-modal-title-vcenter "
                className="amgray text-center w-100 fw-600"
              >
                Filters
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-lg-5 px-3 ">
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
                    <div className="lgray">
                      Min: ${value[0]} &#160; &#160; Max: ${value[1]}
                    </div>
                  </Box>
                </div>
              </div>

              {/* REgions */}
              <div className="row w-100 p-0 mb-4 mt-3">
                <h5 className="amgray pt-3 fw-600">Regions</h5>

                <div
                  className={`d-flex gap-3 flex-wrap ${styles.filteredregion}`}
                >
                  <RadioGroup
                    aria-label="radio-buttons"
                    name="radio-buttons"
                    value={selectedValue}
                    onChange={handleChange}
                    className="d-flex flex-row"
                  >
                    {regionData?.map((item, index) => (
                      <div key={index} className={styles.regionbox}>
                        <FormControlLabel
                          className="lgray"
                          control={
                            <Checkbox
                              className="lgray fw-500"
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
              <h5 className="amgray mt-3 fw-600">Descriptors</h5>

              <div className="py-3">
                <div
                  className={`btn-group px-2 d-flex w-100 d-flex align-center justify-content-between flex-wrap gap-lg-0 gap-1`}
                >
                  {/* 1 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 mt-1
                    ${styles.descripthero}  ${
                      selectedDescriptors?.includes("food")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("food")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("food")
                          ? sculture
                          : culture
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Arts & Culture</span>
                  </div>
                  {/* 2 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 mt-1
                   ${styles.descripthero} ${
                      selectedDescriptors?.includes("Art") ? styles.selected : ""
                    }`}
                    onClick={() => handleDescriptorChange("Art")}
                  >
                    <Image
                      className={` ${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("Art") ? sthrills : thrills
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}>Adventure</span>
                  </div>
                  {/* 3 */}
                  <div
                    className={`justify-between mt-1 d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("Hiking")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("Hiking")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("Hiking") ? sfood : food
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Food & Drinks</span>
                  </div>
                  {/* 4 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-3 gap-1 mt-1 px-lg-3 px-0 py-2 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("family")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("family")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("family")
                          ? sfamily
                          : family
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Family Friendly</span>
                  </div>
                  {/* 5 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-1 px-0 py-2 mt-1 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("fgroup")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("fgroup")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("fgroup")
                          ? sfgroup
                          : fgroup
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Group Friendly</span>
                  </div>
                  {/* 6 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 mt-1 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("hanged")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("hanged")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("hanged")
                          ? shanged
                          : hanged
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Local Hangout</span>
                  </div>
                  {/* 7 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 mt-1 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("guitar")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("guitar")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("guitar")
                          ? sguitar
                          : guitar
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Music & Dance</span>
                  </div>
                  {/* 8 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 mt-1 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("nature")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("nature")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("nature")
                          ? snature
                          : nature
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Nature</span>
                  </div>
                  {/* 9 */}
                  <div
                    className={`justify-between d-flex text-decoration-none align-items-center  gap-lg-2 gap-1 px-lg-2 px-2 py-1 mt-1 ${
                      styles.descripthero
                    } ${
                      selectedDescriptors?.includes("relaxation")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("relaxation")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors?.includes("relaxation")
                          ? srelaxation
                          : relaxation
                      }
                      width={40}
                      height={40}
                      alt=""
                    />
                    <span className={styles.grp_text}> Relaxation</span>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mb-3 py-3 mt-3">
                <button
                  type=""
                  className="savebtn1 text-light"
                  onClick={resetHandle}
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  type=""
                  className="savebtn1 text-light"
                >
                  Apply
                </button>
              </div>
            </Modal.Body>
          </Modal>

    </div>
  );
};

export default FilterModalComponent;
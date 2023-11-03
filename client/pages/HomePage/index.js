import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Sliderm from "@mui/material/Slider";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import culture from "../../public/images/descriptors/culture.svg";
import sculture from "../../public/images/descriptors/sculture.svg";
import thrills from "../../public/images/descriptors/thrills.svg";
import sthrills from "../../public/images/descriptors/sthrills.svg";
import food from "../../public/images/descriptors/food.svg";
import sfood from "../../public/images/descriptors/sfood.svg";

import fgroup from "../../public/images/descriptors/fgroup.svg";
import sfgroup from "../../public/images/descriptors/sfgroup.svg";
import family from "../../public/images/descriptors/family.svg";
import sfamily from "../../public/images/descriptors/sfamily.svg";
import hanged from "../../public/images/descriptors/hanged.svg";
import shanged from "../../public/images/descriptors/shanged.svg";

import guitar from "../../public/images/descriptors/guitar.svg";
import sguitar from "../../public/images/descriptors/sguitar.svg";
import nature from "../../public/images/descriptors/nature.svg";
import snature from "../../public/images/descriptors/snature.svg";
import relaxation from "../../public/images/descriptors/relaxation.svg";
import srelaxation from "../../public/images/descriptors/srelaxation.svg";

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
import { API_URL } from "../../apiConfig";

function valuetext(value) {
  return `${value}°C`;
}

export default function YourComponentName({ data1 }) {
  console.log(data1, "data");
  const dispatch = useDispatch();
  const recommendationsData = useSelector((state) => state.recommendation);
  const [searchTerm, setSearchTerm] = useState("");
  const { recommendations, loading, error } = recommendationsData;
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedDescriptors, setSelectedDescriptors] = useState([]);

  // const loading = true;
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
  const [minValue1, setMinValue1] = useState(0);
  const [maxValue, setMaxValue] = useState(1550);
  const [maxValue1, setMaxValue1] = useState(1550);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    if (region) {
      axios
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
    // Use a Set to keep track of unique locations
    const uniqueLocations = new Set();

    // Filter recommendations to remove duplicates based on the 'location' attribute
    const filteredRecommendations = recommendationData.filter(
      (recommendation) => {
        if (!uniqueLocations.has(recommendation.location)) {
          uniqueLocations.add(recommendation.location);
          return true;
        }
        return false;
      }
    );

    // Set the 'region' state with filtered recommendations
    setRegion(filteredRecommendations);
  }, [recommendationData]);

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
      setMinValue1(minCost);
      setMaxValue(maxCost);
      setMaxValue1(maxCost);
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

    // const regionQuery =
    //   selectedRegions.length > 0 ? `region=${selectedRegions.join(",")}` : "";
    const regionQuery =
      selectedRegions.length > 0
        ? `region=${selectedRegions
            .map((region) => encodeURIComponent(region))
            .join(",")}`
        : "";
    const minQuery = `min=${value[0]}`;
    const maxQuery = `max=${value[1]}`;

    const queryParams = [descriptorQuery, regionQuery, minQuery, maxQuery]
      .filter((param) => param)
      .join("&");

    const url = `/infinitescroll?${queryParams}`;
    console.log("Generated URL:", url);
    router.push(url);
  };

  const resetHandle = () => {
    setSelectedDescriptors([]);
    setSelectedRegions([]);
    setValue([0, 1000]);
    setSelectedValue("a");
    setMaxValue(maxValue1);
    setMinValue(minValue1);
    // setModalShow(false);
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
                      Min: ${minValue1} &#160; &#160; Max: ${maxValue1}
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
                    {regionData.map((item, index) => (
                      <div key={index} className={styles.regionbox}>
                        <FormControlLabel
                          className="lgray"
                          control={
                            <Checkbox
                              className="lgray fw-500"
                              checked={selectedRegions.includes(item.location)}
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
                      selectedDescriptors.includes("food")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("food")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("food")
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
                      selectedDescriptors.includes("Art") ? styles.selected : ""
                    }`}
                    onClick={() => handleDescriptorChange("Art")}
                  >
                    <Image
                      className={` ${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("Art") ? sthrills : thrills
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
                      selectedDescriptors.includes("Hiking")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("Hiking")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("Hiking") ? sfood : food
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
                      selectedDescriptors.includes("family")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("family")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("family")
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
                      selectedDescriptors.includes("fgroup")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("fgroup")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("fgroup")
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
                      selectedDescriptors.includes("hanged")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("hanged")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("hanged")
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
                      selectedDescriptors.includes("guitar")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("guitar")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("guitar")
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
                      selectedDescriptors.includes("nature")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("nature")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("nature")
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
                      selectedDescriptors.includes("relaxation")
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleDescriptorChange("relaxation")}
                  >
                    <Image
                      className={`${styles.foodIcons}`}
                      src={
                        selectedDescriptors.includes("relaxation")
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

          <div
            className={`row  ${styles.globalhero}`}
            style={{ marginBottom: "20px;" }}
          >
            {/* Events Zone */}
            <div className={`col-lg-12 p-0`}>
              <RecommendationGrid data={recommendationData} />
            </div>

            <div className="row pt-lg-5 pt-4 pb-3">
              <div className="col-12  pt-lg-3 pt-0 text-center">
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
}
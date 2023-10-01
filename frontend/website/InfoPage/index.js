import React, { useEffect, useState } from "react";
import styles from "../../styles/singular.module.css";
import plusicon2 from "../../public/images/plusicon2.svg";
import hearticon21 from "../../public/images/hearticon21.svg";
import burger from "../../public/images/burger.svg";
import painticon from "../../public/images/painticon.svg";
import travelicon from "../../public/images/travelicon.svg";
// import mapimage from "../../public/images/mapimage.svg";
import PlaceCard from "../../website/components/PlaceCard";
import Image from "next/image";
import women from "../../public/images/women.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import PlaceNameCard from "../components/PlaceNameCard";
import PlaceCardFull from "../components/PlaceCardFull";
import GoogleLoc from "./components/GoogleLoc";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchRecommendations } from "../../store/actions/recommendationActions";

const highlights = [
  {
    para: "Browse the Font Squirrel fonts tagged as paragraph",
  },
  {
    para: "Browse the Font Squirrel fonts tagged as paragraph",
  },
  {
    para: "Browse the Font Squirrel fonts tagged as paragraph",
  },
  {
    para: "Browse the Font Squirrel fonts tagged as paragraph",
  },
];

function Singularevent() {
  const dispatch = useDispatch();
  const router = useRouter();

  const recommendationsData = useSelector((state) => state.recommendation);
  const [searchTerm, setSearchTerm] = useState("");
  const { recommendations, loading, error } = recommendationsData;

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
  const { regions } = router.query;
  const { descriptor } = router.query;
  const [filteredData, setFilteredData] = useState([]);
  const searchDataList = useSelector((state) => state.recommendation);
  const { getSearchData } = searchDataList;

  console.log(getSearchData, "BOLDED");

  // const [regionData, setRegion] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/recommendations?select=title,region")
      .then((response) => {
        const data = response.data;
        const extractedTitles = data.Recommendations;
        setRegion(extractedTitles);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const region = regionData.map((item) => {
    return item.region;
  });
  useEffect(() => {
    if (regions) {
      axios
        .get(`http://localhost:8000/api/recommendations?regions=${region}`)
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

  const titleD = regionData.map((item) => {
    return item.title;
  });
  const placeData = [
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      city: region[0],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      city: region[1],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      city: region[2],
    },
  ];

  const eventData = [
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[0],
      place: region[0],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[1],
      place: region[1],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[2],
      place: region[2],
    },
  ];

  const data = [
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[0],
      place: region[0],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[2],
      place: region[2],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[1],
      place: region[1],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[0],
      place: region[0],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[2],
      place: region[2],
    },
    {
      bgImg:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
      itinerary: "ITINERARY",
      title: titleD[2],
      place: region[2],
    },
  ];
  return (
    <>
      <div className="container-fluid py-5">
        <div className="row">
          <div
            className={`col-lg-5 col-12 col-md-12 mt-3 ${styles.scenerypara}`}
          >
            <div className={`row align-items-center ${styles.eventtopsection}`}>
              <div className=" col-9 col-md-6 col-lg-8">
                <h6 className="fw-500">
                  Garden State Gathering: Celebrating New Jersey's Rich Culture
                </h6>
              </div>
              <div
                className={` col-3 col-md-6 col-lg-4 align-items-center d-flex justify-content-end gap-3 ${styles.eventicon}`}
              >
                <div
                  className={`d-flex align-items-center justify-content-center ${styles.eventicondiv}`}
                >
                  <Image
                    className={styles.eventtopicons}
                    src={plusicon2}
                    alt=""
                  />
                </div>
                <div
                  className={`d-flex align-items-center justify-content-center ${styles.eventicondiv}`}
                >
                  <Image
                    className={styles.eventtopicons}
                    src={hearticon21}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 mt-4">
                <div
                  className={`row  d-flex justify-content-center flex-column align-items-center ${styles.landingendcard1}`}
                >
                  {eventData.map((item, index) => {
                    return (
                      <PlaceCardFull
                        key={index}
                        imageUrl={item.bgImg}
                        itinerary={item.itinerary}
                        title={item.title}
                        place={item.place}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-1">
            <div className="row">
              <div
                className={`col-12 col-md-12 col-lg-12 ${styles.eventmidicons}`}
              >
                <div className={styles.eventicons}>
                  <Image
                    className={`h-auto ${styles.foodIcons}`}
                    src={burger}
                    alt=""
                  />
                </div>
                <div className={` ${styles.eventicons}`}>
                  <Image
                    className={`h-auto ${styles.foodIcons}`}
                    src={painticon}
                    alt=""
                  />
                </div>
                <div className={` ${styles.eventicons}`}>
                  <Image
                    className={`h-auto ${styles.foodIcons}`}
                    src={travelicon}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-align-right p-0">
            <GoogleLoc data={recommendationData} />
          </div>
        </div>

        {/* Places */}
        <div className="px-5 pt-5 mt-lg-3 mt-md-2">
          <h1 className="px-4 pb-2">Places You'll See</h1>
          <div
            className={`row px-4 d-flex justify-content-center align-items-center ${styles.landingendcard1}`}
          >
            {placeData.map((item, index) => {
              return (
                <PlaceNameCard
                  key={index}
                  imageUrl={item.bgImg}
                  city={item.city}
                  country={item?.country}
                />
              );
            })}
          </div>
        </div>

        {/* Highlights */}
        <div className="row align-center pt-5">
          <div className="col-lg-7 d-flex justify-content-start align-center flex-column">
            <div className="text-align-start w-100 px-5">
              <h1 className={styles.highlightheading}>Highlights</h1>
              <div className="pt-3">
                {highlights.map((item, index) => {
                  return (
                    <div
                      className="d-flex align-items-center gap-3"
                      key={index}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={styles.tikicon}
                      />
                      <p className="mb-0">{item.para}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <Image className="w-75 h-auto" src={women} />
          </div>
        </div>

        <div className="text-center py-5">
          <p className={`fw-600 mb-0 ${styles.eventendheading}`}>
            Related Iterinaries Near By
          </p>
        </div>
        <div
          className={`row px-4 d-flex justify-content-center align-items-center ${styles.landingendcard1}`}
        >
          {data.map((item, index) => {
            return (
              <PlaceCard
                key={index}
                imageUrl={item.bgImg}
                itinerary={item.itinerary}
                title={item.title}
                place={item.place}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
export default Singularevent;

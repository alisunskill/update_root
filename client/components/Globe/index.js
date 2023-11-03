import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import useSize from "react-sizeme"; // Make sure the import is correct
import { fetchRecommendations } from "../../store/actions/recommendationActions";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { SizeMe } from "react-sizeme";
import { renderToString } from "react-dom/server";
import { API_URL } from "../../apiConfig";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function Flobe(props) {
  const { data } = props;
  const { width } = useSize();
  const [globeHeight, setGlobeHeight] = useState(450); 

  useEffect(() => {
    setIsClient(true);
  }, [fetchRecommendations]);

  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const markerHiking = (
    <div>
      <img
        style={{ width: "25px" }}
        src="/images/descriptor-hiking.svg"
        alt="Hiking Descriptor"
      />
    </div>
  );
  const markerFood = (
    <div>
      <img
        style={{ width: "25px" }}
        src="/images/descriptor-food.svg"
        alt="Food Descriptor"
      />
    </div>
  );
  const markerArt = (
    <div>
      <img
        style={{ width: "25px" }}
        src="/images/descriptor-art.svg"
        alt="Art Descriptor"
      />
    </div>
  );
  const recommendations = data.recommendations.Recommendations;
  console.log(recommendations, "recommendations ali");
  const { region } = router.query;

  if (region) {
    router.push(`${API_URL}infinitescroll?region=${region}`);
  }

  let cityData = [];
  if (recommendations && recommendations.length > 0) {
    const uniqueRegions = new Set();
    cityData = recommendations.reduce((acc, recommendation) => {
      if (!uniqueRegions.has(recommendation.location)) {
        uniqueRegions.add(recommendation.location);
        acc.push({
          label: recommendation.location,
          lat: recommendation.latitude,
          lng: recommendation.longitude,
          size: 18,
          color: "white",
          descriptor: recommendation.descriptors,
        });
      }
      return acc;
    }, []);
  } else {
    cityData = [];
  }
 
  const handleLocationClick = (event, data) => {
    const region = data.label;
    router.push({
      pathname: "/infinitescroll",
      query: { region, type:"Globe" },
    });
  };

  if (!isClient) {
    return null;
  }

  const LocationMarker = () => (
    <FontAwesomeIcon
      icon={faMapMarkerAlt}
      color="red"
      onClick={handleLocationClick}
    />
  );
  return (
    <div>
      <h3 className="p-4 fw-600 d-flex justify-content-center w-100">
        Discover the World
      </h3>

      <div
        // {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
      <div style={{ height: `${globeHeight}px` }}>
          <SizeMe>
            {({ size }) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Globe
                  // width="width"
                  // height={width * 0.5}
                  width={width || size.width} // Use width from useSize hook if available, otherwise fallback to size.width
                  height={globeHeight}
                  globeImageUrl="images/8081_earthmap10k-blue-svg.webp"
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  labelLat={(d) => d.lat}
                  labelLng={(d) => d.lng}
                  labelText={(d) => d.label}
                  labelSize={8}
                  labelDotRadius={3}
                  labelColor={() => "white"}
                  labelResolution={2}
                  onPointHover={handleLocationClick}
                  htmlElementsData={cityData}
                  htmlElement={(d) => {
                    const el = document.createElement("div");

                    let marker;
                    if (d.descriptor === "hiking") {
                      marker = markerHiking;
                    } else if (d.descriptor === "food") {
                      marker = markerFood;
                    } else {
                      marker = markerArt;
                    }

                    el.innerHTML =
                      renderToString(marker) +
                      `<p style="font-size: 12px;color:white;text-align: center; margin: 8px 0;">${d.label}</p>`;
                    el.style.color = d.color;
                    el.style.width = `${d.size}px`;

                    el.style["pointer-events"] = "auto";
                    el.style.cursor = "pointer";
                    el.onclick = (event) => handleLocationClick(event, d);
                    return el;
                  }}
                />
              </div>
            )}
          </SizeMe>
        </div>
      </div>
    </div>
  );
}
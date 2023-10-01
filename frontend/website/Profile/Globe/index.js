import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchRecommendations } from "../../../store/actions/recommendationActions";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { SizeMe } from "react-sizeme";
import { renderToString } from "react-dom/server";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default ({ data }) => {
  console.log(data, "data");
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
  const recommendations = data;
  console.log(recommendations, "recommendations ali");
  const { region } = router.query;

  if (region) {
    router.push(`/infinitescroll?region=${region}`);
  }

  let cityData = [];
  if (recommendations && recommendations.length > 0) {
    const uniqueRegions = new Set();
    cityData = recommendations.reduce((acc, recommendation) => {
      if (!uniqueRegions.has(recommendation.region)) {
        uniqueRegions.add(recommendation.region);
        acc.push({
          label: recommendation.region,
          lat: recommendation.location.coordinates[0],
          lng: recommendation.location.coordinates[1],
          size: 18,
          color: "white",
          descriptor: recommendation.descriptor,
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
      query: { region },
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
    <div style={{ height: "500px" }}>
      <SizeMe>
        {({ size: { width } }) => (
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
              // width="100px"
              width="width"
              height={width * 0.5}
              globeImageUrl="images/8081_earthmap10k-blue-svg.webp"
              backgroundColor="rgba(255, 255, 255, 0.2)"
              labelLat={(d) => d.lat}
              labelLng={(d) => d.lng}
              labelText={(d) => d.label}
              labelSize={2}
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
                  `<p style="font-size: 12px;color:white;text-align: center;">${d.label}</p>`;
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
  );
};

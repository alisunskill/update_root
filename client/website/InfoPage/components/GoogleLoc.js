import React, { useEffect, useState } from "react";
import styles from "../../../styles/singular.module.css";
import { fetchRecommendations } from "../../../store/actions/recommendationActions";
import { useRouter } from "next/router";

export default function GoogleLoc({ data }) {
  const router = useRouter();
  const [regionData, setRegion] = useState([]);
  const recommendations = data;
  console.log(recommendations, "Ali");
  const { region } = router.query;

  useEffect(() => {
    if (region) {
      // Call the function to generate the static map URL and open it in a new tab
      const staticMapURL = generateMapURL(region);
      window.open(staticMapURL, "_blank");
    }
  }, [region]);

  const generateMapURL = (region) => {
    const apiKey = "Your_API_Key";
    const imageSize = "640x480";
    const marker = `markers=color:red|label:${region}|${region}`;
    return `https://maps.googleapis.com/maps/api/staticmap?key=${apiKey}&center=${region}&zoom=14&size=${imageSize}&${marker}`;
  };

  return (
    <div>
      <iframe
        className={`h-auto ${styles.eventmapimage}`}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.870099868516!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919213222ed80b5%3A0x1c9a2b307254fc6b!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1626233246593!5m2!1sen!2s"
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
}

// import React from "react";
// import styles from "../../../styles/singular.module.css";
import React from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function GoogleLoc() {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };
  return (
    // <div>
    //   <iframe
    //     className={`h-auto ${styles.eventmapimage}`}
    //     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.870099868516!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919213222ed80b5%3A0x1c9a2b307254fc6b!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1626233246593!5m2!1sen!2s"
    //     allowFullScreen=""
    //     loading="lazy"
    //   ></iframe>
    // </div>

    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
        </GoogleMapReact>
      </div>
    </>
  );
}

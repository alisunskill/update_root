import "../styles/globals.css";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Provider } from "react-redux";
import store from "../store";
import Head from "next/head";
import { GoogleMapApiKey } from "../apiConfig";
export default function App({ Component, pageProps }) {
  console.log(pageProps, "pbrop");
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GoogleMapApiKey}&libraries=places`;
    script.async = true; // Load script asynchronously
    document.head.appendChild(script);
    return () => {
      // Clean up the script element when the component unmounts
      document.head.removeChild(script);
    };
  }, []);
  useEffect(() => {
    // Set scroll position to the top of the page
    //window.scrollTo(0, 0);
    
    // Save scroll position as 0 in local storage
    localStorage.setItem('scrollPosition', 0);
  }, []);
  
  

  return (
    <>
      <Head>
        {/* Remove the script tag from here */}
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
}

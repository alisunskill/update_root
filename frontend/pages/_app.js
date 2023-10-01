import "../styles/globals.css";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Provider } from "react-redux";
import store from "../store";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  console.log(pageProps, "pbrop");
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAX815OLgYZi7EbfQOgbBn6XeyCzwexMlM&libraries=places`}
        ></script>
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  );
}

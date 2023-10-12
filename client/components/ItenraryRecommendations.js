import { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import styles from "../styles/home.module.css";

import Link from "next/link";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Files_URL } from "../apiConfig";

const ItenraryRecommendationGrid = ({
    data,
  loading,
  error,
}) => {
  const router = useRouter();
  
  

  const handleLinkClick = (itemId, postTitle, item) => {
   
    
     
    router.push(
        {
          pathname: "/Itenraries",
          query: {
            id: JSON.stringify(item._id),
          },
        },
        undefined, // The second argument is for the "as" option, set it to undefined
        { shallow: true } // Use shallow routing to prevent adding the new page to the browser's history
      );
      
    
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row px-lg-5 px-2">
          <div className="col-12 pt-3">
            <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={data.length}
              next={data}
            >
              <Box sx={{ minHeight: 829 }}>
                <Masonry  columns={2}  spacing={1}>
                  { data && data?.map((item, index) => {
                    return (
                      <div key={index} className="">
                        <div
                          className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                          onClick={() => handleLinkClick(item._id, item.title,item)}
                        >
                          <Link
                            href={`/eventdetail/${encodeURIComponent(
                              item.title.replace(/ /g, "-")
                            )}?id=${item._id}`}
                            className="w-100"
                          >
                            <img
                              className={styles.uploadimg}
                              src={`${Files_URL}${item.images[0]}`}
                              alt="Uploaded Image"
                            />
                          </Link>

                          <div style={{ position: "absolute ", zIndex: 999 }}>
                            <div className="text-center">
                              {/* <p className={`mb-0 letterspac text-white`}>
                                Event
                              </p> */}
                              <h3 className="w-700 text-white">{item.title.length <= 40
                                    ? item.title
                                    : `${item.title.slice(0, 40)}...`}</h3>
                              <p className={`mb-0 m1 text-white`}>
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Masonry>
              </Box>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
};



export default ItenraryRecommendationGrid;
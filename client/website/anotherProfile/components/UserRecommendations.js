import { useEffect, useState } from "react";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import styles from "../../../styles/home.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import InfiniteScroll from "react-infinite-scroll-component";
import { GoogleMapApiKey, Files_URL, API_URL } from "../../../apiConfig";
const UserRecommendations = ({  data, }) => {
  const router = useRouter();
  const [numColumns, setNumColumns] = useState(4);
  const { id } = router.query;

  const recommendationsData = useSelector((state) => state.recommendation);
  const { recommendations, loading, error } = recommendationsData;
  console.log(recommendations.Recommendations, "recommendationsData");


  const [posts, setPosts] = useState([]);
  console.log("ID: ",id)


  useEffect(() => {
    // Filter the posts in the useEffect
    const filteredPosts = recommendations.Recommendations?.filter(post => post.userID == JSON?.parse(id));
    
    // Update the state with the filtered posts
    setPosts(filteredPosts);
  }, [id]);

 


  

  useEffect(() => {
    window.addEventListener("resize", updateNumColumns);
    updateNumColumns();
    return () => {
      window.removeEventListener("resize", updateNumColumns);
    };
  }, []);
  const updateNumColumns = () => {
    if (window.innerWidth >= 1500) {
      setNumColumns(3);
    } else if (window.innerWidth >= 1200) {
      setNumColumns(2);
    } else if (window.innerWidth >= 768) {
      setNumColumns(2);
    } else if (window.innerWidth >= 500) {
      setNumColumns(2);
    } else {
      setNumColumns(1);
    }
  };
  const handleLinkClick = async (itemId, postTitle, item) => {
    console.log("ITEMMMMM", item);
  
    if (item.isItenrary === false) {
      router.push(
        `/eventdetail/${encodeURIComponent(postTitle.replace(/ /g, "-"))}?id=${itemId}`
      );
    } else if (item.isItenrary === true) {
      // Handle the redirection based on your requirements.
      // You can add a condition or further logic here to determine the correct route.
      
        router.push({
          pathname: "/Itenraries",
          query: {
            id: JSON.stringify(item._id),
          },
        });
     
      
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row px-lg-5 px-2">
          <div className="col-12 pt-3">
          <InfiniteScroll
              className="w-100 overflow-hidden"
              dataLength={posts?.length}
            >
              <Box sx={{ minHeight: 829 }}>
                <Masonry  columns={numColumns}  spacing={1}>
                  {posts?.map((item, index) => {
                    return (
                      <div key={index} className="">
                        <div
                          className={`text-decoration-none d-flex justify-content-center flex-column ${styles.savelink}`}
                          onClick={() => handleLinkClick(item._id, item.title,item)}
                        >
                          
                            <img
                              className={styles.uploadimg}
                              src={`${Files_URL}${item?.images[0]}`}
                              alt="Uploaded Image"
                              style={{borderRadius:'20px'}}
                            />
                        

                          <div style={{ position: "absolute ", zIndex: 999 }}>
                            <div className="text-center">
                              {/* <p className={`mb-0 letterspac text-white`}>
                                Event
                              </p> */}
                              <h3 className="w-700 text-white">{item.title.length <= 40
                                    ? item.title
                                    : `${item?.title.slice(0, 40)}...`}</h3>
                              <p className={`mb-0 m1 text-white`}>
                                {item?.location}
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

export default UserRecommendations;
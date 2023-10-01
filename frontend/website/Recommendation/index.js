import React, { useEffect, useState } from "react";
import styles from "../../styles/home.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@mui/material";
import { Masonry } from "@mui/lab";
import axios from "axios";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1663583784667-4a2a386fec62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1622397815608-359540676c67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1550850839-8dc894ed385a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=875&q=80",
  },
  {
    img: "https://images.unsplash.com/photo-1587162146766-e06b1189b907?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=956&q=80",
  },
];
export default () => {
  const [postIds, setPostIds] = useState([]);
  console.log(postIds, "postIds");
  const [trigger, setTrigger] = useState(new Date());
  const [editData, setEditData] = useState({});
  const [ediData, setEdiData] = useState({
    title: "",
    cost: "",
    experience: "",
    region: "",
    description: "",
  });

  const postImage = postIds.map((item) => {
    return (
      <div>
        <img src={item.images} alt="" />
      </div>
    );
  });
  console.log(postImage[0], "Potato");

  const postDataId = postIds.map((item) => {
    return <>{item._id}</>;
  });

  const fetchPostIds = async () => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      console.error("User ID not available.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/recommendations?userID=${userID}`
      );
      const data = response.data;

      // const savePosts = data.Recommendations;
      const savePosts = data.Recommendations.map((post) => ({
        ...post,
        slug: post.title.toLowerCase().replace(/\s+/g, "-"),
      }));

      console.log(savePosts, "savePosts bbbb");

      setPostIds(savePosts);
      const postData = savePosts.map((post) => post.cost);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchPostIds();
  }, [trigger]);
  const handleRemove = async (postId) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      console.error("User ID not available.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/recommendations/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${userID}`,
          },
        }
      );
      setPostIds((prevPostIds) => prevPostIds.filter((id) => id !== postId));
      console.log("Post deleted successfully.");
      setTrigger(new Date());
      // alert("Post deleted successfully.")
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (postId) => {
    const postToEdit = postIds.find((post) => post._id === postId);
    if (postToEdit) {
      setEditData({ ...postToEdit });
      setEdiData({
        title: postToEdit.title,
        cost: postToEdit.cost,
        experience: postToEdit.experience,
        region: postToEdit.region,
        description: postToEdit.description,
      });
    }
  };
  const handleSaveEdit = async (editedData) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      console.error("User ID not available.");
      return;
    }

    try {
      const updatedData = {
        ...editedData,
        title: ediData.title,
        cost: ediData.cost,
        experience: ediData.experience,
        region: ediData.region,
        description: ediData.description,
      };

      await axios.put(
        `http://localhost:8000/api/recommendations/${editedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${userID}`,
          },
        }
      );
      setEditData({});
      setTrigger(new Date());
      console.log("Post updated successfully.");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      {/* formal */}
      {/* <div className="container px-5 pt-3 pb-5">
        <div className={`row`}>
          <h1 className="dark bold pb-3 text-center mb-3">
            Your Recommendations
          </h1>
          <div className={`col-4 ${styles.landingfirstcard}`}>
            <div className={styles.landingimage1}>
              <div
                className={`position-relative d-flex flex-column justify-content-center align-center  ${styles.landingtext}`}
              >
                <div className={`grid ${styles.herogrid}`}>
                  <div
                    className={`d-flex justify-content-center align-center ${styles.paintgoal}`}
                  >
                    <Image src={burger} width={40} height={40} />
                  </div>
                  <div
                    className={`d-flex justify-content-center align-center mt-3 ${styles.paintgoal}`}
                  >
                    <Image src={paint} width={40} height={40} />
                  </div>
                </div>

                <p className={`mb-0 ${styles.letterspac}`}>Event</p>
                <h3 className={`mb-0   white fw-600 pb-5${styles.matchheader}`}>
                  {" "}
                  Football Match LA FC vs NYC FC{" "}
                </h3>
                <p className={`mb-0 m1`}>New York, USA</p>
              </div>
            </div>
          </div>

          <div className="col-5 ">
            <div className={`row`}>
              <div className={`col-lg-12`}>
                <div
                  className={`${styles.landingimage2} d-flex align-center light-dark`}
                >
                  <div className={`col-lg-12 ${styles.landingtextmidgrid}`}>
                    <p className={`mb-0 ${styles.letterspac}`}>ITINERARY</p>
                    <p
                      className={`mb-0 ${styles.matchheader} mt-1 white fw-600`}
                    >
                      {" "}
                      PARIS LUXURY TOUR{" "}
                    </p>
                    <p className={`mb-0`}>Paris, France</p>
                  </div>
                </div>
                <div
                  className={`${styles.landingimage3} d-flex align-center my-4 light-dark`}
                >
                  <div
                    className={`col-lg-12 px-5 ${styles.landingtextmidgrid}`}
                  >
                    <p className={`mb-0 ${styles.letterspac}`}>ITINERARY</p>
                    <h3
                      className={`mb-0 ${styles.matchheader} mt-1 white fw-600`}
                    >
                      {" "}
                      Heavenly Expedition: Discovering the Beauty of Northern
                      Pakistan{" "}
                    </h3>
                    <p className={`mb-0 m1`}>Paris, France</p>
                  </div>
                </div>
                <div
                  className={`${styles.landingimage4} d-flex align-center light-dark`}
                >
                  <div className={`col-lg-12 ${styles.landingtextmidgrid}`}>
                    <p className={`mb-0 ${styles.letterspac}`}>ITINERARY</p>
                    <p
                      className={`mb-0 ${styles.matchheader} mt-1 white fw-600`}
                    >
                      {" "}
                      PARIS LUXURY TOUR{" "}
                    </p>
                    <p className={`mb-0 m1`}>Paris, France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className={`row`}>
              <div className={`col-lg-12 mx-0 px-0`}>
                <div className={`${styles.landingimage5} d-flex align-center`}>
                  <div
                    className={`col-lg-12 ${styles.landingtextmidgrid}  light-dark d-flex align-center flex-column flex-center`}
                    style={{ height: "100%", borderRadius: "20px" }}
                  >
                    <p className={`mb-0 ${styles.letterspac}`}>EVENT</p>
                    <p
                      className={`mb-0 ${styles.matchheader} mt-1 white fw-600`}
                    >
                      {" "}
                      Tokyo Night Run{" "}
                    </p>
                    <p className={`mb-0 m1`}>Tokyo, Japan</p>
                  </div>
                </div>
              </div>
              <div className={`${styles.landingimage6} my-4`}>
                <div className={`col-lg-12 ${styles.landingtextinalgrid}`}>
                  <p className={`mb-0 ${styles.letterspac}`}>ITINERARY</p>
                  <p className={`mb-0 ${styles.matchheader} mt-1 white fw-600`}>
                    Tokyo Night Run
                  </p>
                  <p className={`mb-0 m1`}>Paris, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* added */}
      <div className="row  px-5 pt-3 pb-5">
        <h1 className="dark bold pb-3 text-center mb-3">
          Your Recommendations
        </h1>
        <div className="col-lg-12">
          <InfiniteScroll
            className="w-100 overflow-hidden"
            dataLength={postDataId.length}
            loader={<h4>Loading...</h4>}
          >
            <Box sx={{ minHeight: 829 }}>
              <Masonry columns={3} spacing={2}>
                {postIds.map((post, index) => (
                  <div key={post._id}>
                    <div className="position-relative">
                      <button
                        className="bg-success border-0 rounded-2 position-absolute z-3 px-3 fw-700"
                        style={{ left: "0px" }}
                        // onClick={() => handleRemove(post._id)}
                        onClick={() => {
                          const userID = localStorage.getItem("userID");
                          if (userID) {
                            handleEdit(post._id);
                          } else {
                            alert("Only the user can delete this post.");
                          }
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-danger border-0 rounded-2 position-absolute z-3 px-3 fw-700"
                        style={{ right: "0px" }}
                        // onClick={() => handleRemove(post._id)}
                        onClick={() => {
                          const userID = localStorage.getItem("userID");
                          if (userID) {
                            handleRemove(post._id);
                          } else {
                            alert("Only the user can delete this post.");
                          }
                        }}
                      >
                        x
                      </button>
                    </div>

                    {post.images.length === 3 ? (
                      <div>
                        <img
                          layout="fill"
                          objectFit="cover"
                          src={`${
                            itemData[index % itemData.length].img
                          }?w=162&auto=format`}
                          srcSet={`${
                            itemData[index % itemData.length].img
                          }?w=162&auto=format&dpr=2 2x`}
                          className={styles.placeImg}
                          loading="lazy"
                          style={{
                            display: "block",
                            width: "100%",
                            borderRadius: "15px",
                            opacity: "0.99990000999",
                          }}
                        />
                      </div>
                    ) : post ? (
                      <div>
                        <img
                          src={post.images[0]}
                          alt={`Image 0`}
                          style={{
                            display: "block",
                            width: "100%",
                            borderRadius: "15px",
                            opacity: "0.99990000999",
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="pt-2">
                      {editData._id === post._id && (
                        <div className="edit-form">
                          <input
                            type="text"
                            value={ediData.title}
                            onChange={(e) =>
                              setEdiData({
                                ...ediData,
                                title: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            value={ediData.cost}
                            onChange={(e) =>
                              setEdiData({
                                ...ediData,
                                cost: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            value={ediData.experience}
                            onChange={(e) =>
                              setEdiData({
                                ...ediData,
                                experience: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            value={ediData.region}
                            onChange={(e) =>
                              setEdiData({
                                ...ediData,
                                region: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            value={ediData.description}
                            onChange={(e) =>
                              setEdiData({
                                ...ediData,
                                description: e.target.value,
                              })
                            }
                          />

                          {/* ... Repeat the above for other properties */}

                          <div className="gap-3 d-flex mt-2">
                            <button
                              className="text-light border-0 rounded-1"
                              onClick={() => handleSaveEdit(editData)}
                              style={{ background: "#14b7ff" }}
                            >
                              Save
                            </button>
                            <button
                              className="text-light border-0 rounded-1"
                              onClick={() => setEditData({})}
                              style={{ background: "#14b7ff" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      <h3 className="w-700 text-dark"> {post.title}</h3>
                      <div className="d-flex gap-3">
                        <p className="w-700 text-dark">Cost: {post.cost}</p>
                        <p className="w-700 text-dark">
                          Experience: {post.experience}
                        </p>
                        <p className="w-700 text-dark">Region: {post.region}</p>
                        <p className="w-700 text-dark">
                          {/* Description: {post.description} */}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </Box>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

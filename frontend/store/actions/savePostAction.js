import axios from "axios";

export const FETCH_SAVEPOST_REQUEST = "FETCH_SAVEPOST_REQUEST";
export const FETCH_SAVEPOST_SUCCESS = "FETCH_SAVEPOST_SUCCESS";
export const FETCH_SAVEPOST_FAILURE = "FETCH_SAVEPOST_FAILURE";

export const DELETE_SAVEPOST_REQUEST = "DELETE_SAVEPOST_REQUEST";
export const DELETE_SAVEPOST_SUCCESS = "DELETE_SAVEPOST_SUCCESS";
export const DELETE_SAVEPOST_FAILURE = "DELETE_SAVEPOST_FAILURE";

export const fetchSavePostRequest = () => ({
  type: FETCH_SAVEPOST_REQUEST,
});

export const fetchSavePostSuccess = (savepost) => ({
  type: FETCH_SAVEPOST_SUCCESS,
  payload: savepost,
});

export const fetchSavePostFailure = (error) => ({
  type: FETCH_SAVEPOST_FAILURE,
  payload: error,
});

export const deleteSavePostRequest = () => ({
  type: DELETE_SAVEPOST_REQUEST,
});

export const deleteSavePostSuccess = (delPost) => ({
  type: DELETE_SAVEPOST_SUCCESS,
  payload: delPost,
});

export const deleteSavePostFailure = (error) => ({
  type: DELETE_SAVEPOST_FAILURE,
  payload: error,
});

// Async action
// get posts
export const fetchSavePosts = () => {
  return async (dispatch) => {
    const userID = localStorage.getItem("userID");
    try {
      dispatch(fetchSavePostRequest());
      const response = await axios.get(
        `http://localhost:8000/api/savepost?userID=${userID}`
      );
      dispatch(fetchSavePostSuccess(response.data));
    } catch (error) {
      dispatch(fetchSavePostFailure(error.message));
    }
  };
};

export const deleteSavePost = (postId) => {
  return async (dispatch) => {
    const userID = localStorage.getItem("userID");
    try {
      dispatch(deleteSavePostRequest());
      await axios.delete(`http://localhost:8000/api/savepost/${postId}`, {
        headers: {
          Authorization: `Bearer ${userID}`,
        },
      });
      dispatch(deleteSavePostSuccess(postId));
    } catch (error) {
      dispatch(deleteSavePostFailure(error.message));
    }
  };
};

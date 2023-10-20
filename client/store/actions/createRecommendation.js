import axios from "axios";
import { useRouter } from "next/router";

export const FETCH_REGIONPOST_REQUEST = "FETCH_REGIONPOST_REQUEST";
export const FETCH_REGIONPOST_SUCCESS = "FETCH_REGIONPOST_SUCCESS";
export const FETCH_REGIONPOST_FAILURE = "FETCH_REGIONPOST_FAILURE";

export const fetchRegionPostRequest = () => ({
  type: FETCH_REGIONPOST_REQUEST,
});

export const fetchRegionPostSuccess = (regionpost) => ({
  type: FETCH_REGIONPOST_SUCCESS,
  payload: regionpost,
});

export const fetchRegionPostFailure = (error) => ({
  type: FETCH_REGIONPOST_FAILURE,
  payload: error,
});

// Async action
// get posts
export const fetchRegionPosts = (region) => {
  return async (dispatch) => {
    try {
      dispatch(fetchRegionPostRequest());

      const router = useRouter();

      if (region) {
        router.push(`/infinitescroll?region=${region}`);
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/infinitescroll?region=${region}`
      );
      dispatch(fetchRegionPostSuccess(response.data));
    } catch (error) {
      dispatch(fetchRegionPostFailure(error.message));
    }
  };
};

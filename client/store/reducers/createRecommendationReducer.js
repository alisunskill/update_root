import {
  FETCH_REGIONPOST_REQUEST,
  FETCH_REGIONPOST_SUCCESS,
  FETCH_REGIONPOST_FAILURE,
} from "../actions/createRecommendation";

const initialState = {
  regionPost: [],
  loading: false,
  error: null,
};

const createRecommendationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REGIONPOST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_REGIONPOST_SUCCESS:
      return {
        ...state,
        regionpost: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_REGIONPOST_FAILURE:
      return {
        ...state,
        savePost: [],
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default createRecommendationReducer;

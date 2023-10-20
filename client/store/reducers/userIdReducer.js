import {
  FETCH_USERID_REQUEST,
  FETCH_USERID_SUCCESS,
  FETCH_USERID_FAILURE,
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  DELETE_PROFILE_FAILURE,
} from "../actions/userAction";

const initialState = {
  userId: null,
  loading: false,
  error: null,
};

const userIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USERID_SUCCESS:
      return {
        ...state,
        userId: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_USERID_FAILURE:
      return {
        ...state,
        userId: [],
        loading: false,
        error: action.payload,
      };
    case DELETE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case DELETE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userIdReducer;

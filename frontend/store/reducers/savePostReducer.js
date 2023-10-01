import {
  FETCH_SAVEPOST_REQUEST,
  FETCH_SAVEPOST_SUCCESS,
  FETCH_SAVEPOST_FAILURE,
  DELETE_SAVEPOST_REQUEST,
  DELETE_SAVEPOST_SUCCESS,
  DELETE_SAVEPOST_FAILURE,
} from "../actions/savePostAction";

const initialState = {
  savePost: [],
  loading: false,
  error: null,
};

const savePostReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SAVEPOST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SAVEPOST_SUCCESS:
      return {
        ...state,
        savepost: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_SAVEPOST_FAILURE:
      return {
        ...state,
        savePost: [],
        loading: false,
        error: action.payload,
      };
    case DELETE_SAVEPOST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_SAVEPOST_SUCCESS:
      return {
        ...state,
        deletePost: action.payload,
        loading: false,
        error: null,
      };
    case DELETE_SAVEPOST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default savePostReducer;

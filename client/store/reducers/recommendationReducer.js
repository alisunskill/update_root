// store/reducers/recommendationReducer.js
import {
  FETCH_RECOMMENDATIONS_REQUEST,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_FAILURE,
  FETCH_CREATERECOMMENDATIONS_REQUEST,
  FETCH_CREATERECOMMENDATIONS_SUCCESS,
  FETCH_CREATERECOMMENDATIONS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
} from "../actions/recommendationActions";
import * as actionTypes from "../../store/actions/recommendationActions";

import {
  SET_USER_ID,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
} from "../actions/recommendationActions";

import { DATA_LIST, USER_ID } from "../actions/recommendationActions";

const initialState = {
  // recommendations: [],
  recommendations: [],
  createRecommendation: [],
  favPosts: [],
  userID: null,
  email: "",
  token: "",
  email: "",
  data: [],
  userData: null,
  loading: false,
  error: null,
};

const recommendationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECOMMENDATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        recommendations: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_RECOMMENDATIONS_FAILURE:
      return {
        ...state,
        recommendations: [],
        loading: false,
        error: action.payload,
      };

    case FETCH_CREATERECOMMENDATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CREATERECOMMENDATIONS_SUCCESS:
      return {
        ...state,
        createRecommendation: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_CREATERECOMMENDATIONS_FAILURE:
      return {
        ...state,
        createRecommendation: [],
        loading: false,
        error: action.payload,
      };

    case DATA_LIST:
      return {
        ...state,
        loading: false,
        getSearchData: action.payload,
      };
    case USER_ID:
      return {
        ...state,
        userID: action.payload.userID,
        email: action.payload.email,
      };
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        favPosts: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        favPosts: [],
        loading: false,
        error: action.payload,
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userID: action.payload.userID,
        email: action.payload.email,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default recommendationReducer;

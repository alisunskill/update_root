import {
  FETCH_GET_SINGLE_TRIP_REQUEST,
  FETCH_GET_SINGLE_TRIP_SUCCESS,
  FETCH_GET_SINGLE_TRIP_FAILURE,
} from "../actions/singleTripAction";


const initialState = {
  singleTrip: null,
  
};

const singleTripReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GET_SINGLE_TRIP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_GET_SINGLE_TRIP_SUCCESS:
      return {
        ...state,
        singleTrip: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_GET_SINGLE_TRIP_FAILURE:
      return {
        ...state,
        singleTrip: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default singleTripReducer;

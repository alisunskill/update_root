import {
  UPDATE_TRIP_REQUEST,
  UPDATE_TRIP_SUCCESS,
  UPDATE_TRIP_FAILURE,
  REMOVE_TRIP_REQUEST,
  REMOVE_TRIP_SUCCESS,
  REMOVE_TRIP_FAILURE,
} from "../actions/updateTripAction";

const initialState = {
  updatedTrip: null,
  removedTripId: null,
  loading: false,
  error: null,
};

const updateTripReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRIP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_TRIP_SUCCESS:
      return {
        ...state,
        updatedTrip: action.payload,
        loading: false,
        error: null,
      };
    case UPDATE_TRIP_FAILURE:
      return {
        ...state,
        updatedTrip: null,
        loading: false,
        error: action.payload,
      };
    case REMOVE_TRIP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case REMOVE_TRIP_SUCCESS:
      return {
        ...state,
        removedTripId: action.payload,
        loading: false,
        error: null,
      };
    case REMOVE_TRIP_FAILURE:
      return {
        ...state,
        removedTripId: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default updateTripReducer;

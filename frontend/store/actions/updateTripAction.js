import axios from "axios";

// Action types
export const UPDATE_TRIP_REQUEST = "UPDATE_TRIP_REQUEST";
export const UPDATE_TRIP_SUCCESS = "UPDATE_TRIP_SUCCESS";
export const UPDATE_TRIP_FAILURE = "UPDATE_TRIP_FAILURE";

// remove trips
export const REMOVE_TRIP_REQUEST = "REMOVE_TRIP_REQUEST";
export const REMOVE_TRIP_SUCCESS = "REMOVE_TRIP_SUCCESS";
export const REMOVE_TRIP_FAILURE = "REMOVE_TRIP_FAILURE";

// Action creators
export const updateTripRequest = () => ({
  type: UPDATE_TRIP_REQUEST,
});

export const updateTripSuccess = (updatedTrip) => ({
  type: UPDATE_TRIP_SUCCESS,
  payload: updatedTrip,
});

export const updateTripFailure = (error) => ({
  type: UPDATE_TRIP_FAILURE,
  payload: error,
});

// remove trips
export const removeTripRequest = () => ({
  type: REMOVE_TRIP_REQUEST,
});

export const removeTripSuccess = (tripId) => ({
  type: REMOVE_TRIP_SUCCESS,
  payload: tripId,
});

export const removeTripFailure = (error) => ({
  type: REMOVE_TRIP_FAILURE,
  payload: error,
});

// Thunk action for updating a trip
export const updateTripAction = (updateTripData) => async (dispatch) => {
  dispatch(updateTripRequest());
  try {
    const response = await axios.put(
      `http://localhost:8000/api/trips/${updateTripData.id}`,
      {
        image: updateTripData.image,
        title: updateTripData.title,
        region: updateTripData.region,
        sdate: updateTripData.sdate,
        edate: updateTripData.edate,
      }
    );
    dispatch(updateTripSuccess(response.data));
  } catch (error) {
    dispatch(updateTripFailure(error.message));
  }
};

// remove trip
export const removeTripAction = (tripId) => async (dispatch) => {
  dispatch(removeTripRequest());
  try {
    await axios.delete(`http://localhost:8000/api/trips/${tripId}`);
    dispatch(removeTripSuccess(tripId));
  } catch (error) {
    dispatch(removeTripFailure(error.message));
  }
};

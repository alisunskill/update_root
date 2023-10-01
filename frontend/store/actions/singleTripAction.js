// single trips
export const FETCH_GET_SINGLE_TRIP_REQUEST = "FETCH_GET_SINGLE_TRIP_REQUEST";
export const FETCH_GET_SINGLE_TRIP_SUCCESS = "FETCH_GET_SINGLE_TRIP_SUCCESS";
export const FETCH_GET_SINGLE_TRIP_FAILURE = "FETCH_GET_SINGLE_TRIP_FAILURE";

export const fetchSignleTripRequest = () => ({
  type: FETCH_GET_SINGLE_TRIP_REQUEST,
});

export const fetchSignleTripSuccess = (singleTrip) => ({
  type: FETCH_GET_SINGLE_TRIP_SUCCESS,
  payload: singleTrip,
});

export const fetchSignleTripFailure = (error) => ({
  type: FETCH_GET_SINGLE_TRIP_FAILURE,
  payload: error,
});

export const fetchSingleTrip = (singletripId) => async (dispatch) => {
  dispatch(fetchSignleTripRequest());
  try {
    const response = await axios.get(
      `http://localhost:8000/api/trips/${singletripId}`
    );
    dispatch(fetchSignleTripSuccess(response.data));
  } catch (error) {
    dispatch(fetchSignleTripFailure(error.message));
  }
};

// store/index.js
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import recommendationReducer from "./reducers/recommendationReducer";
import savePostReducer from "./reducers/savePostReducer";
import createRecommendation from "./reducers/createRecommendationReducer";
import tripIdSaveReducer from "./reducers/tripReducer";
import singleTripReducer from "./reducers/singleTripReducer";
import updateTripReducer from "./reducers/updateTripReducer";
import userIdReducer from "./reducers/userIdReducer";

const store = configureStore({
  reducer: {
    recommendation: recommendationReducer,
    saveposts: savePostReducer,
    createRecommendation: createRecommendation,
    tripIdSave: tripIdSaveReducer,
    singleTrip: singleTripReducer,
    updateTrip: updateTripReducer,
    userId: userIdReducer,
  },
  middleware: [thunkMiddleware],
});

export default store;

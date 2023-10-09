const express = require("express");
const router = express.Router();

const {
  createTripsPost,
  deleteTripPost,
  getTripsPost,
  updateTripPost,
  userVisitedCountriesRegions
} = require("../controllers/trips");

router.route("/").post(createTripsPost);

router.route("/userVisitedCountriesRegions").post(userVisitedCountriesRegions);

router.route("/").get(getTripsPost);

router.route("/:tripId").delete(deleteTripPost);

router.route("/:tripId").put(updateTripPost);

module.exports = router;

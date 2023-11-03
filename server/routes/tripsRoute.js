const express = require("express");
const router = express.Router();

const {
  createTripsPost,
  deleteTripPost,
  getTripsPost,
  updateTripPost,
  userVisitedCountriesRegions,
  addPostToTrip,
  addEventToSpecificDateInPlans,
  updateTrip
} = require("../controllers/trips");

router.route("/").post(createTripsPost);
router.route("/addPostToTrip").post(addPostToTrip);
router.route("/addEventToSpecificDateInPlans").post(addEventToSpecificDateInPlans);
router.route("/updateTrip").post(updateTrip);

router.route("/userVisitedCountriesRegions").post(userVisitedCountriesRegions);

router.route("/").get(getTripsPost);

router.route("/:tripId").delete(deleteTripPost);

router.route("/:tripId").put(updateTripPost);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
    addTripPlan, getATripPlan, deleteTripPlan,tripPlans
} = require("../controllers/TripPlans");

router.route("/").get(tripPlans);
router.route("/addTripPlan").post(addTripPlan);
router.route("/getATripPlan").post(getATripPlan);
router.route("/deleteTripPlan").post(deleteTripPlan);

module.exports = router;

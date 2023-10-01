const express = require("express");
const router = express.Router();
const {
  saveAllTrips,
  getSaveTrips,
  deleteSaveTrip,
} = require("../controllers/saveTrips");

router.route("/").post(saveAllTrips);
router.route("/").get(getSaveTrips);
router.route("/:tripId").delete(deleteSaveTrip);

module.exports = router;

const express = require("express");
const router = express.Router();
const postController = require("../controllers/itinerary");

router.post("/", postController.createItineraryPost);

module.exports = router;

const express = require("express");
const router = express.Router();
const postController = require("../controllers/itinerary");

router.post("/createItineraryPost", postController.createItineraryPost);
router.post("/itneraryDetail", postController.itneraryDetail);
router.post("/addItneraryLike", postController.addItneraryLike);
router.post("/userLikedItinerary", postController.userLikedItinerary);

module.exports = router;

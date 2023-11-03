const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const multer = require("multer");
const Recommendation = require("../models/recommendation");

// const jwtKey = process.env.JWT_SECRET;
// const upload = require("../upload");

const {
  getAllRecommendations,
  getAllRecommendationsTesting,
  deleteRecommendation,
  updateRecommendation,
  likeRecommendation,
  getTotalLikes,
  UserTotalRecommendations,
  recommendationDetail,
  updateLikes,
  isRecommendationAlreadyLiked,
} = require("../controllers/recommendations");

router.route("/").get(getAllRecommendations);
router.route("/updateLikes").post(updateLikes);
router.route("/isRecommendationAlreadyLiked").post(isRecommendationAlreadyLiked);

router.route("/UserTotalRecommendations").post(UserTotalRecommendations);
router.route("/testing").get(getAllRecommendationsTesting);

router.route("/:recommendationId").delete(deleteRecommendation);

router.route("/:recommendationId").put(updateRecommendation);

// like post route
router.route("/:recommendationId/like").post(likeRecommendation);

// total likes
router.route("/:recommendationId").get(getTotalLikes);

router.post('/createrecommendation', upload.array('images'), async (req, res) => {
  const {
    userID,
    title,
    cost,
    currency,
    hours,
    experience,
    description,
    location,
    descriptors,
    region,
    links,
    longitude,
    latitude,
    isItenrary
  } = req.body;

  try {
    // Check for missing required fields
    if (!userID || !title  ) {
      return res.status(400).json({ error: "Missing required fields in the request." });
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    // Process uploaded files
    const files = req.files; // This will contain an array of uploaded files

    // Your logic to store and process the files (e.g., save to disk, database, etc.)
    // For simplicity, let's assume you save them to a folder
    const fileUrls = [];
    for (const file of files) {
      fileUrls.push(`/uploads/${file.filename}`);
    }

    // Create a new recommendation with the file URLs
    const newRecommendation = await Recommendation.create({
      userID,
      title,
      images: fileUrls, // Store the file URLs
      cost,
      currency,
      hours,
      experience,
      description,
      location,
      descriptors,
      region,
      links,
      longitude,
      latitude,
      isItenrary
    });

    console.log("New Recommendation:", newRecommendation);

    res.status(201).json(newRecommendation);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create recommendation. " + error.message });
  }
});

router.post('/updatecommendation', upload.array('newImages'), async (req, res) => {
  const {
    recommendationId,
    oldImages,
    userID,
    title,
    cost,
    currency,
    hours,
    experience,
    description,
    location,
    descriptors,
    region,
    links,
    longitude,
    latitude,
    isItenrary,
  } = req.body;

  console.log(typeof oldImages);

  try {
    // Check for missing required fields
    if (!userID || !title) {
      res.status(400).json({ status: false, message: "Missing title or user" });
      return; // Return early to prevent further code execution
    }

    // Find the existing recommendation by ID
    const existingRecommendation = await Recommendation.findById(recommendationId);

    if (!existingRecommendation) {
      res.status(404).json({ status: false, message: "Recommendation not exists" });
      return; // Return early to prevent further code execution
    }

    // Process uploaded new images (if any)
    let newImages = oldImages; // Initialize with oldImages

    if (req.files && req.files.length > 0) {
      // Update the "images" field with new image URLs
      const newFileUrls = req.files.map((file) => `/uploads/${file.filename}`);
      newImages = oldImages.concat(newFileUrls);
    }
    console.log(newImages)

    // Update the recommendation fields
    existingRecommendation.userID = userID;
    existingRecommendation.title = title;
    existingRecommendation.images = newImages;
    existingRecommendation.cost = cost;
    existingRecommendation.currency = currency;
    existingRecommendation.hours = hours;
    existingRecommendation.experience = experience;
    existingRecommendation.description = description;
    existingRecommendation.location = location;
    existingRecommendation.descriptors = descriptors;
    existingRecommendation.region = region;
    existingRecommendation.links = links;
    existingRecommendation.longitude = longitude;
    existingRecommendation.latitude = latitude;
    existingRecommendation.isItenrary = isItenrary;

    // Save the updated recommendation
    const updatedRecommendation = await existingRecommendation.save();

    res.status(201).json({ status: true, message: "Recommendation updated successfully", data: updatedRecommendation });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Failed to update recommendation. " + error.message });
  }
});



router.route("/recommendationDetail").post(recommendationDetail);

// router.route("/").post(
//   (req, res, next) => {
//     if (!req.body.descriptor) {
//       req.body.descriptor = "food";
//     }
//     next();
//   },
//   middleware,
//   createRecommendation
// );

module.exports = router;

const Recommendation = require("../models/recommendation");

const getAllRecommendations = async (req, res) => {
  const { title, region, descriptors, sort, select } = req.query;
  const queryObject = {};

  if (title) {
    queryObject.title = { $regex: title, $options: "i" };
  }

  if (region) {
    queryObject.region = region;
  }

  if (descriptors) {
    if (typeof descriptors === "string") {
      queryObject.descriptor = descriptors;
    }
  }
  let apiData = Recommendation.find(queryObject);

  if (sort) {
    let sortFix = sort.split(",").join(" ");
    apiData = apiData.sort(sortFix);
  }

  if (select) {
    let selectFix = select.split(",").join(" ");
    apiData = apiData.select(selectFix);
  }

  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 100;

  let skip = (page - 1) * limit;

  apiData = apiData.skip(skip).limit(limit);

  const Recommendations = await apiData;
  res.status(200).json({ Recommendations });
};

const getAllRecommendationsTesting = async (req, res) => {
  res.status(200).json({ msg: "I am getAllRecommendationsTesting" });
};

const createRecommendation = async (req, res) => {
  const {
    title,
    images,
    hours,
    cost,
    experience,
    description,
    location,
    descriptors,
    region,
    links,
  } = req.body;

  try {
    // const creator = req.user.email;
    console.log("Request Body:", req.body);
    if (
      !title ||
      !hours ||
      !images ||
      !cost ||
      !experience ||
      !description ||
      !location ||
      !descriptors ||
      !region ||
      !links
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in the request." });
    }

    if (
      !location.type ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        error:
          "Invalid location format. Please provide valid location coordinates.",
      });
    }

    const newRecommendation = await Recommendation.create({
      title,
      images,
      hours,
      cost,
      experience,
      description,
      location,
      descriptors,
      region,
      links,
    });

    console.log("New Recommendation:", newRecommendation);

    res.status(201).json(newRecommendation);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to create recommendation. " + error.message });
  }
};

const deleteRecommendation = async (req, res) => {
  const recommendationId = req.params.recommendationId;
  console.log(recommendationId, "1");
  try {
    const deletedRecommendation = await Recommendation.findByIdAndDelete(
      recommendationId
    );

    if (!deletedRecommendation) {
      return res.status(404).json({ error: "Recommendation not found." });
    }

    res.status(200).json({ message: "Recommendation deleted successfully." });
    console.log("Recommendation deleted successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to delete recommendation. " + error.message,
    });
  }
};

const updateRecommendation = async (req, res) => {
  const recommendationId = req.params.recommendationId;
  const {
    title,
    images,
    hours,
    cost,
    experience,
    description,
    location,
    descriptors,
    region,
    links,
  } = req.body;

  try {
    // Check if the recommendation exists
    const existingRecommendation = await Recommendation.findById(
      recommendationId
    );

    if (!existingRecommendation) {
      return res.status(404).json({ error: "Recommendation not found." });
    }

    if (title) existingRecommendation.title = title;
    // if (images) existingRecommendation.images = images;
    if (hours) existingRecommendation.hours = hours;
    if (cost) existingRecommendation.cost = cost;
    if (experience) existingRecommendation.experience = experience;
    if (description) existingRecommendation.description = description;
    if (location) existingRecommendation.location = location;
    if (descriptors) existingRecommendation.descriptors = descriptors;
    if (region) existingRecommendation.region = region;
    if (links) existingRecommendation.links = links;

    // Save the updated recommendation
    const updatedRecommendation = await existingRecommendation.save();

    res.status(200).json(updatedRecommendation);
    console.log("Recommendation updated successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to update recommendation. " + error.message,
    });
  }
};

// like post
const likeRecommendation = async (req, res) => {
  const recommendationId = req.params.recommendationId;

  try {
    const existingRecommendation = await Recommendation.findById(
      recommendationId
    );

    if (!existingRecommendation) {
      return res.status(404).json({ error: "Recommendation not found." });
    }

    existingRecommendation.likes += 1;

    const updatedRecommendation = await existingRecommendation.save();

    res.status(200).json(updatedRecommendation);
    console.log("Recommendation liked successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to like recommendation. " + error.message,
    });
  }
};

// total likes
const getTotalLikes = async (req, res) => {
  const recommendationId = req.params.recommendationId;

  try {
    const existingRecommendation = await Recommendation.findById(
      recommendationId
    );

    if (!existingRecommendation) {
      return res.status(404).json({ error: "Recommendation not found." });
    }

    const totalLikes = existingRecommendation.likes;

    res.status(200).json({ totalLikes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to fetch total likes. " + error.message,
    });
  }
};

const UserTotalRecommendations = async (req, res) => {
  try {
    const { userID } = req.body;
    console.log(userID);

    const count = await Recommendation.countDocuments({ userID: userID });

    res
      .status(200)
      .json({
        status: true,
        message: "successfully",
        totalRecommendations: count,
      });
  } catch (error) {
    console.error("Error getting total recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRecommendations,
  getAllRecommendationsTesting,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  likeRecommendation,
  getTotalLikes,
  UserTotalRecommendations,
};

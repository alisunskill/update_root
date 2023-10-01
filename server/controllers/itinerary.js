const Itinerary = require("../models/itinerary");

// itneraryPost
const createItineraryPost = async (req, res) => {
  try {
    const {
      title,
      images,
      cost,
      hours,
      experience,
      descriptor,
      location,
      region,
      description,
    } = req.body;
    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid location format" });
    }
    const itinerary = await Itinerary.create({
      title,
      images,
      cost,
      hours,
      experience,
      descriptor,
      location,
      region,
      description,
    });
    res.status(201).json(itinerary);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.status(400).json({ error: errorMessages });
    } else {
      res.status(500).json({ error: "Unable to create the itinerary" });
    }
  }
};

module.exports = {
  createItineraryPost,
};

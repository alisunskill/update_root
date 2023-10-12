const Itinerary = require("../models/itinerary");

// itneraryPost
const createItineraryPost = async (req, res) => {
  try {
    const {
      userID,
      posts,
    } = req.body;
    
    const itinerary = await Itinerary.create({
      userID,
      posts,
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
const itneraryDetail = async (req, res) => {
  const {
    id,
  } = req.body;

  try {
    // You can use the objectId to create an itinerary
    const itinerary = await Itinerary.findOne({ _id: id });

    res.status(201).json({ status: true, message: 'Successful', data: itinerary });
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
  itneraryDetail
};

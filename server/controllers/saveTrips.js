const SaveTrips = require("../models/saveTrips");

const saveAllTrips = async (req, res) => {
  const { tripId, userID } = req.body;
  console.log(tripId, "tripId");
  console.log(userID, "userID");

  try {
    if (!tripId || !Array.isArray(tripId) || tripId.length === 0) {
      return res.status(400).json({ error: "Invalid tripId data." });
    }

    const newTripsPosts = await SaveTrips.insertMany(
      tripId.map((id) => ({ tripId: id, userID: userID }))
    );

    console.log("newTripsPosts:", newTripsPosts);
    res.status(201).json(newTripsPosts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create save trips." });
  }
};

const getSaveTrips = async (req, res) => {
  // console.log('This is working');
  const { userID, tripId } = req.query;
  console.log(tripId, "nbn");
  try {
    if (!tripId && !userID) {
      const allTrips = await SaveTrips.find({});
      return res.status(200).json({ tripsPosts: allTrips });
    }

    let query = {};
    if (tripId) query.tripId = tripId;
    if (userID) query.userID = userID;

    console.log("Query:", query);
    const tripsPosts = await SaveTrips.find(query);
    console.log(tripsPosts, "tripsPosts");
    res.status(200).json({ tripsPosts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch save posts." });
  }
};

// delete
const deleteSaveTrip = async (req, res) => {
  const tripId = req.params.tripId;
  console.log(tripId, "klkl");
  try {
    const deletedPost = await SaveTrips.findOneAndDelete({ tripId });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete save post." });
  }
};

module.exports = { saveAllTrips, getSaveTrips, deleteSaveTrip };

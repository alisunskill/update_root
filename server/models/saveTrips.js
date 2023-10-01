const mongoose = require("mongoose");

const saveTripsSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
});

const SaveTrips = mongoose.model("SaveTrips", saveTripsSchema);

module.exports = SaveTrips;

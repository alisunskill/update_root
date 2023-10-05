const mongoose = require("mongoose");

const { Schema } = mongoose;
const itinerarySchema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, "User must be provided"],
  },
  posts:Array

});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;

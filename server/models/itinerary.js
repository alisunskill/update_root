const mongoose = require("mongoose");

const { Schema } = mongoose;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const itinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: [String],
  cost: {
    type: Number,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  descriptor: {
    type: String,
    default: "food",
  },
  location: {
    type: pointSchema,
    index: "2dsphere",
  },
  region: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;

const mongoose = require("mongoose");
const recommendationSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, "User must be provided"],
  },
  title: {
    type: String,
    required: [true, "Title must be provided"],
  },

  images: {
    type: [String],
    required: true,
  },

  description: {
    type: String,
    default: "you can provide a description",
  },

  hours: {
    type: String,
    required: true,
    default: "9:00 am",
  },

  cost: {
    type: Number,
    required: [true, "Cost must be provided"],
  },
  experience: {
    type: String,
    required: true,
    default: "2 year",
  },
  descriptors: {
    type: [String],
    required: true,
  },

  region: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  location: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  links: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation;
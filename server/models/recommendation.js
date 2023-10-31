const mongoose = require("mongoose");
const recommendationSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, "User must be provided"],
  },
  title: {
    type: String,
    required: [true, "Title must be provided"],
    required: true,
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
  },

  cost: {
    type: Number,
  },
  currency: {
    type: String,
    default: "USD",
  },
  experience: {
    type: String,
  },
  descriptors: {
    type: [String],
  },

  region: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  location: {
    type: String,
  },
  location: {
    type: String,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
  links: {
    type: String,
  },
  likes: {
    type: Array,
  },
  isItenrary:{
    type: Boolean,
    default:false,
  }
}, {
  timestamps: true
});

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation;
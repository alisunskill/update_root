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
  experience: {
    type: String,
  },
  descriptors: {
    type: [String],
    required: true,
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
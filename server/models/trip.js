const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  recommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation",
    },
  ],
  posts:Array,
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;

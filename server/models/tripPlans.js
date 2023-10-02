const mongoose = require("mongoose");

const tripPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  tripId: {
    type: String,
    required: true,
  },
  plans: Array,
}, {
    timestamps: true
});

const TripPlan = mongoose.model("TripPlans", tripPlanSchema);

module.exports = TripPlan;

const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  region: {
    type: String,
    // required: true,
  },

  email: {
    type: String,
    // required: true,
  },
  sdate: {
    type: String,
    // required: true,
  },
  edate: {
    type: String,
    // required: true,
  },
  note: String, 
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;

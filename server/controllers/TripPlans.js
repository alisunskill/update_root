const TripPlan = require("../models/tripPlans")
const Trips = require("../models/trips");
const addTripPlan = async (req, res) => {
  try {
    const { userId, tripId, plans } = req.body;

    // Check if a trip plan with the same userId and tripId exists
    let tripPlan = await TripPlan.findOne({ userId, tripId });

    if (!tripPlan) {
      // If a trip plan does not exist, create a new one
      tripPlan = new TripPlan({
        userId,
        tripId,
        plans,
      });
    } else {
      // If a trip plan exists, update its plans field
      tripPlan.plans = plans;
    }

    // Save the updated or new TripPlan to the database
    await tripPlan.save();

    const response = {
      status: true,
      message: "Trip Plan added or updated successfully",
      tripPlan: tripPlan,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    const response = {
      status: false,
      message: "An error occurred while adding or updating the TripPlan",
    };
    res.status(500).json(response);
  }
};
const getATripPlan = async (req, res) => {
  try {
    const { tripId } = req.body;
    console.log(tripId)

    if (!tripId) {
      // Return a bad request status if tripId is missing in the request body
      return res.status(400).json({ status: false, message: "tripId is required in the request body" });
    }

    // Use the find method to find trip details by tripId
    const trip = await Trips.findOne({ _id: tripId });

   

    // Use the find method to find trip plans by tripId
    const tripPlans = await TripPlan.find({ tripId });
    if (tripPlans.length==0) {
      return res.status(404).json({ status: true,hasPlans:false,trip, message: "No trip details found for the given tripId" });
    }

    res.status(200).json({
      status: true,
      hasPlans:true,
      message: "Trip details and plans found successfully",
      trip,
      tripPlans
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "An error occurred while finding trip details and plans" });
  }
};
const deleteTripPlan = async (req, res) => {
    try {
        const { id } = req.body;
    
        if (!id) {
          // Return a bad request status if ID is missing in the request body
          return res.status(400).json({ status: false, message: "ID is required in the request body" });
        }
    
        // Use findByIdAndDelete to find and delete the TripPlan by its ID
        const deletedTripPlan = await TripPlan.findByIdAndDelete(id);
    
        if (!deletedTripPlan) {
          // If the TripPlan with the given ID doesn't exist, return an error
          return res.status(404).json({ status: false, message: "TripPlan not found" });
        }
    
        res.status(200).json({ status: true, message: "TripPlan deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred while deleting the TripPlan" });
      }
};

const tripPlans = async (req, res) => {
  try {
    // Use the find method to retrieve all trip plans
    const allTripPlans = await TripPlan.find();

    res.status(200).json({ status: true, message: "All trip plans retrieved successfully", tripPlans: allTripPlans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "An error occurred while retrieving trip plans" });
  }
};
module.exports = { addTripPlan, getATripPlan, deleteTripPlan,tripPlans };

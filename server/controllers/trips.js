const Trips = require("../models/trips");

// create itneraryPost
// const createTripsPost = async (req, res) => {
//   try {
//     const { title, region, email, sdate, edate, note } = req.body;
//     console.log(title, region, email, sdate, edate, note, "allfields");
//     if (!title || !region || !email || !sdate || !edate || !note) {
//       return res
//         .status(400)
//         .json({ error: "Missing required fields in the trip request." });
//     }

//     const itinerary = await Trips.create({
//       title,
//       region,
//       email,
//       sdate,
//       edate,
//       note,
//     });
//     res.status(201).json(itinerary);
//   } catch (err) {
//     if (err.name === "ValidationError") {
//       const errorMessages = Object.values(err.errors).map(
//         (error) => error.messageUnable to create the itinerary
//       );
//       res.status(400).json({ error: errorMessages });
//     } else {
//       res.status(500).json({ error: "Unable to create the itinerary" });
//     }
//   }
// };
const createTripsPost = async (req, res) => {
  try {
    const { title, region, email, sdate, edate, note, userID } = req.body;
    console.log(title, region, email, sdate, edate, note, userID, "allfields");

    const itinerary = await Trips.create({
      title,
      region,
      email,
      sdate,
      edate,
      note,
      userID,
    });
    res.status(201).json(itinerary);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.status(400).json({ error: errorMessages });
    } else {
      res.status(500).json({ error: "Unable to create the itinerary" });
    }
  }
};

// Get Trips
const getTripsPost = async (req, res) => {
  const { title, region, email, edate, sdate, userID } = req.query;

  const query = {};

  if (title) {
    query.title = title;
  }

  if (region) {
    query.region = region;
  }

  if (email) {
    query.email = email;
  }

  if (edate) {
    query.edate = edate;
  }

  if (sdate) {
    query.sdate = sdate;
  }

  if (userID) {
    query.userID = userID;
  }

  try {
    const trips = await Trips.find(query);
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch trips." });
  }
};

// delete
const deleteTripPost = async (req, res) => {
  const tripId = req.params.tripId;
  try {
    const deletedTrip = await Trips.findByIdAndDelete(tripId);

    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    res.status(200).json({ message: "Trip deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Unable to delete the trip." });
  }
};

// Update Trip
const updateTripPost = async (req, res) => {
  const tripId = req.params.tripId;
  const { title, region, email, sdate, edate } = req.body;

  try {
    const updatedTrip = await Trips.findByIdAndUpdate(
      tripId,
      {
        title,
        region,
        email,
        sdate,
        edate,
      },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.status(400).json({ error: errorMessages });
    } else {
      res.status(500).json({ error: "Unable to update the trip." });
    }
  }
};

module.exports = {
  createTripsPost,
  deleteTripPost,
  getTripsPost,
  updateTripPost,
};

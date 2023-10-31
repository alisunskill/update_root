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

    // Check if there is an existing trip with the same userID and overlapping date range
    const existingTrip = await Trips.findOne({
      userID,
      $or: [
        {
          $and: [
            { sdate: { $lte: edate } }, // New trip start date is before or on the end date of existing trip
            { edate: { $gte: sdate } }, // New trip end date is after or on the start date of existing trip
          ],
        },
      ],
    });

    if (existingTrip) {
      return res.status(201).json({ status: false, message: "A trip already exists for this date range." });
    }

    const itinerary = await Trips.create({
      title,
      region,
      email,
      sdate,
      edate,
      note,
      userID,
    });

    return res.status(201).json({ status: true, message: "Trip added succesfully",itinerary });
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

const userVisitedCountriesRegions = async (req, res) => {
  try {
    const { userID } = req.body;
    //console.log(userID);

    // Find all trips for the given userID
    const userTrips = await Trips.find({ userID });
    console.log(userTrips);

    if (userTrips.length === 0) {
      // If the user has no records, send zero for both cities and countries
      res.json({
        totalSimilarCities: 0,
        totalSimilarCountries: 0,
      });
    } else {
      // Extract unique countries and cities from the regions
      const uniqueData = userTrips.map((trip) => {
        let [city, country] = trip.region.split(',').map((component) => component.trim());
        
        // If there's no comma, consider the whole string as the country
        if (!country) {
          country = city;
          city = '';
        }

        return {
          city,
          country,
        };
      });

      // Create sets to store unique cities and countries
      const uniqueCities = new Set();
      const uniqueCountries = new Set();

      // Count the total number of similar cities and countries
      uniqueData.forEach((data) => {
        const { city, country } = data;
        if (city) {
          uniqueCities.add(city);
        }
        if (country) {
          uniqueCountries.add(country);
        }
      });

      // Get the total counts
      const totalSimilarCities = uniqueCities.size;
      const totalSimilarCountries = uniqueCountries.size;

      // Return the total counts to the client
      res.json({
        totalSimilarCities,
        totalSimilarCountries,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errorMessages = Object.values(err.errors).map(
        (error) => error.message
      );
      res.status(400).json({ error: errorMessages });
    } else {
      res.status(500).json({ error: 'Unable to fetch user data' });
    }
  }
};

const addPostToTrip = async (req, res) => {
  try {
    const { tripIDs, post } = req.body; // Assuming you have 'tripIDs' and 'post' in your request

    const addedTrips = [];
    const existingTrips = [];

    for (const tripID of tripIDs) {
      // Find each trip by ID
      const trip = await Trips.findById(tripID);

      if (!trip) {
        // Handle the case where a trip is not found
        return res.status(404).json({ error: `Trip with ID ${tripID} not found` });
      }

      // Make sure 'posts' is an array before using indexOf
      if (!Array.isArray(trip.posts)) {
        trip.posts = [];
      }

      // Check if the post is not already in the 'posts' array
      if (trip.posts.indexOf(post) === -1) {
        // If the post is not in the array, add it
        trip.posts.push(post);

        // Save the trip with the updated 'posts' array
        await trip.save();

        addedTrips.push(tripID);
      } else {
        existingTrips.push(tripID);
      }
    }

    if (addedTrips.length > 0) {
      return res.status(201).json({
        status: true,
        message: `Post added in the following trips: ${addedTrips.join(', ')}`,
      });
    } else if (existingTrips.length === tripIDs.length) {
      return res.status(201).json({
        status: true,
        message: `Post already exists in all specified trips: ${existingTrips.join(', ')}`,
      });
    } else {
      return res.status(201).json({
        status: true,
        message: `Post already exists in some of the specified trips: ${existingTrips.join(', ')}`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};






module.exports = {
  createTripsPost,
  deleteTripPost,
  getTripsPost,
  updateTripPost,
  userVisitedCountriesRegions,
  addPostToTrip
};

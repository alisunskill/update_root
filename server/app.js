require("dotenv").config();
const express = require("express");
const staticItems = require("./models/staticData");
const connectDB = require("./db/connect");

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use(express.json());

var cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 8000;

const recommendations_routes = require("./routes/recommendations");

const trips_routes = require("./routes/tripsRoute");

const savePostRoute = require("./routes/savePostRoute");

const saveTripRoute = require("./routes/saveTripsRoute");

const userRoutes = require("./routes/userRoutes");

const itineraryPost = require("./routes/itinerary");

const creacreateRecommendation = require("./routes/recommendations");
const SaveTrips = require("./models/saveTrips");

app.get("/", (req, res) => {
  res.send("Hi, This is API Developed by Sunny");
});

// staticData
// GET /items - Get all items
app.get("/staticdata", (req, res) => {
  try {
    res.json(staticItems);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//Recommendations
app.use("/api/recommendations", recommendations_routes);

// Trips
app.use("/api/trips", trips_routes);

// User routes
app.use("/api/users", userRoutes);

// create Recommendation
app.use("/api/createrecommendation", creacreateRecommendation);

// itinerary posts
app.use("/api/itineraryposts", itineraryPost);

// saveposts
app.use("/api/savepost", savePostRoute);

// SaveTrips
app.use("/api/savetrip", saveTripRoute);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`${PORT} Yes, I'm connected`);
    });
  } catch {
    console.log(error);
  }
};

start();

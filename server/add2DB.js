require("dotenv").config();

const connectDB = require("./db/connect");

const Recommendation = require("./models/recommendation");

const sampleData = require("./sample_data.json");

const createRecommendation = async (data) => {
  try {
    const recommendation = await Recommendation.create(data);
    return recommendation;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create recommendation.");
  }
};

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    for (const data of Recommendation) {
      await createRecommendation(data);
    }
    console.log("Success");
  } catch (error) {
    console.log(error);
  }
};

start();

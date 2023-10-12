const Recommendation = require("../models/recommendation");
const Itinerary = require("../models/itinerary");

const getAllRecommendations = async (req, res) => {
  try {
    // Find all recommendations and itineraries
    const allRecommendations = await Recommendation.find({ isItenrary: false });
    //console.log(allRecommendations)
    const allItineraries = await Itinerary.find();

    // Iterate through all Itinerary records and add posts[0] record detail to each one
    const mergedData = allItineraries.map((itinerary) => {
      const itineraryCopy = { ...itinerary._doc }; // Create a copy of the itinerary object
      if (itineraryCopy.posts && itineraryCopy.posts.length > 0) {
        const firstPost = itineraryCopy.posts[0];
        firstPost.isItinerary = true; // Set isItinerary to true for the post
        return { ...itineraryCopy, ...firstPost };
      }
      return itineraryCopy;
    });

    // Merge the modified itineraries with recommendations
    const resData = [...allRecommendations, ...mergedData];

   // mergedData.push(...allRecommendations);

    // Sort the merged data by createdAt in descending order
    resData.sort((a, b) => b.createdAt - a.createdAt);

    if (resData.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No data exists",
      });
    }

    return res.status(200).json({
      status: true,
      message: "All data retrieved and merged successfully",
      Recommendations: resData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong in the backend",
      error: error.message,
    });
  }
};
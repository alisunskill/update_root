const SavePosts = require("../models/saveposts");
const Recommendation = require("../models/recommendation");
const Itinerary = require("../models/itinerary");
const saveAllPost = async (req, res) => {
  const { postId, userID } = req.body;
  console.log("Post to save: ",postId)

  try {
    if (!postId || !Array.isArray(postId) || postId.length === 0) {
      return res.status(400).json({ error: "Invalid postId data." });
    }

    // Iterate through the postId array
    for (const id of postId) {
      // Check if a record already exists with the same postId and userID
      const existingSavePost = await SavePosts.findOne({ postId: id, userID });

      if (!existingSavePost) {
        // If it doesn't exist, create a new SavePosts entry
        await SavePosts.create({ postId: id, userID });
      }
    }

    // Respond with success
    res.status(201).json({ message: "Save posts created successfully." });
  } catch (error) {
   // console.error("Error:", error);
    res.status(500).json({ error: "Failed to create save posts." });
  }
};


const getSavePosts = async (req, res) => {
  // console.log('This is working');
  const { postId, userID } = req.query;

  try {
    if (!postId && !userID) {
      return res.status(400).json({ error: "Invalid query parameters." });
    }

    let query = {};
    if (postId) query.postId = postId;
    if (userID) query.userID = userID;
    console.log(postId, "postId");
    const savePosts = await SavePosts.find(query);
    console.log(savePosts, "savePosts");
    res.status(200).json({ savePosts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch save posts." });
  }
};

const isAlreadySave = async (req, res) => {
  const { postId, userID } = req.body;
  console.log(userID)
  try {
   

    // Check if a record already exists with the specified postId and userID
    const existingSavePost = await SavePosts.findOne({ postId, userID });

    if (existingSavePost) {
      res.status(200).json({ status: true, message: "Post is already saved." });
    } else {
      res.status(200).json({ status: false, message: "Post is not saved." });
    }
  } catch (error) {
   // console.error("Error:", error);
    res.status(500).json({ error: "Failed to check if the post is saved." });
  }
};

// delete
const deleteSavePost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const deletedPost = await SavePosts.findOneAndDelete({ postId });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
   // console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete save post." });
  }
};

const getAllSavePosts = async (req, response) => {
  try {
      // Find all questions
      const posts = await SavePosts.find();

      if (posts.length === 0) {
          return response.status(200).json({
              status: false,
              message: "No Save Posts"
          });
      }

      return response.status(200).json({
          status: true,
          message: "All save posts are retrieved successfully",
          data: posts
      });
  } catch (error) {
      return response.status(500).json({
          status: false,
          message: "Something went wrong in the backend",
          error: error.message
      });
  }
};
const userSavedPosts = async (req, res) => {
  try {
    const { userID } = req.body;

    // Find distinct saved posts for the specified user
    const distinctSavedPosts = await SavePosts.distinct("postId", { userID: userID });

    if (!distinctSavedPosts || distinctSavedPosts.length === 0) {
      return res.status(404).json({ status: false, message: "You don't have any saved Posts" });
    }

    // Create arrays to store recommendations and itineraries
    const recommendations = [];
    const itineraries = [];

    // Fetch recommendations for the distinct saved posts
    await Promise.all(
      distinctSavedPosts.map(async (postId) => {
        const recommendation = await Recommendation.findById(postId).exec();
        if (recommendation) {
          recommendations.push(recommendation);
        }
      })
    );

    // Fetch itineraries for the distinct saved posts
    await Promise.all(
      distinctSavedPosts.map(async (postId) => {
        const itinerary = await Itinerary.findById(postId).exec();
        if (itinerary) {
          itineraries.push(itinerary);
        }
      })
    );

    const mergedDataItenraries = itineraries.map((itinerary) => {
      const itineraryCopy = { ...itinerary._doc }; // Create a copy of the itinerary object
      if (itineraryCopy.posts && itineraryCopy.posts.length > 0) {
        const firstPost = itineraryCopy.posts[0];
        delete firstPost.isItinerary;
        // Create a copy of the first post without its _id
        const firstPostWithoutId = { ...firstPost };
        delete firstPostWithoutId._id;
       // firstPostWithoutId.isItinerary = true; // Set isItinerary to true for the post
        return { ...itineraryCopy, ...firstPostWithoutId };
      }
      return itineraryCopy;
    });

    // Create a merged data object
    const mergedData = recommendations.concat(mergedDataItenraries);


    res.status(200).json({ status: true, message: "Data retrieved successfully!", data: mergedData });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { saveAllPost, getSavePosts, deleteSavePost,getAllSavePosts,userSavedPosts,isAlreadySave };

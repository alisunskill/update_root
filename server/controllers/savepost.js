const SavePosts = require("../models/saveposts");

const saveAllPost = async (req, res) => {
  const { postId, userID } = req.body;
  console.log(postId, "postId");
  console.log(userID, "userID");

  try {
    if (!postId || !Array.isArray(postId) || postId.length === 0) {
      return res.status(400).json({ error: "Invalid postId data." });
    }

    const newSavePosts = await SavePosts.insertMany(
      postId.map((id) => ({ postId: id, userID: userID }))
    );

    console.log("newSavePosts:", newSavePosts);
    res.status(201).json(newSavePosts);
  } catch (error) {
    console.error("Error:", error);
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
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete save post." });
  }
};

module.exports = { saveAllPost, getSavePosts, deleteSavePost };

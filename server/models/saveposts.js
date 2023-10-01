const mongoose = require("mongoose");

const savePostsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
});

const SavePosts = mongoose.model("SavePosts", savePostsSchema);

module.exports = SavePosts;

const express = require("express");
const router = express.Router();
const {
  saveAllPost,
  getSavePosts,
  deleteSavePost,
} = require("../controllers/savepost");

router.route("/").post(saveAllPost);
router.route("/").get(getSavePosts);
router.route("/:postId").delete(deleteSavePost);

// router.route("/").post(saveAllPost).get(getSavePosts).delete(deleteSavePost);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  saveAllPost,
  getSavePosts,
  deleteSavePost,
  getAllSavePosts
} = require("../controllers/savepost");

router.route("/").post(saveAllPost);
router.route("/").get(getSavePosts);
router.route("/:postId").delete(deleteSavePost);

router.route("/All").get(getAllSavePosts);

// router.route("/").post(saveAllPost).get(getSavePosts).delete(deleteSavePost);

module.exports = router;

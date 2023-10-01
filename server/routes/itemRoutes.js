// itemRoutes.js

const express = require("express");
const {
  getAllItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemControllers");

const router = express.Router();

router.get("/", getAllItems);
router.post("/", createItem);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;

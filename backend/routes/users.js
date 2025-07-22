const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get("/stats", getUserStats);
router.get("/:id", getUser);
router.put("/:id", updateUser);

// Admin only routes
router.get("/", authorize("admin"), getUsers);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
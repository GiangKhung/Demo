const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/auth");
const { generalLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

// Protected routes
router.get("/stats", protect, getUserStats);
router.get("/:id", protect, getUser);
router.put("/:id", protect, updateUser);

// Admin only routes
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;

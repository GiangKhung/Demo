const express = require("express");
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  registerValidator,
  loginValidator,
  updateDetailsValidator,
  updatePasswordValidator,
} = require("../validators/authValidator");

const router = express.Router();

// Public routes
router.post("/register", authLimiter, registerValidator, register);
router.post("/login", authLimiter, loginValidator, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetailsValidator, updateDetails);
router.put("/updatepassword", protect, updatePasswordValidator, updatePassword);

module.exports = router;
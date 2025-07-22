const rateLimit = require("express-rate-limit");

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: "Quá nhiều requests, vui lòng thử lại sau",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Document upload limiter
const documentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    error: "Quá nhiều uploads, vui lòng thử lại sau 1 giờ",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    error: "Quá nhiều attempts đăng nhập, vui lòng thử lại sau",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 uploads per hour
  message: {
    success: false,
    error: "Quá nhiều file uploads, vui lòng thử lại sau",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  documentLimiter,
  authLimiter,
  uploadLimiter,
};

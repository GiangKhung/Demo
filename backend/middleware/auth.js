const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Không tìm thấy user với token này",
        });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({
        success: false,
        error: "Token không hợp lệ",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Không có token, truy cập bị từ chối",
    });
  }
};

// Optional auth - không bắt buộc đăng nhập
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Ignore auth errors for optional auth
      console.log("Optional auth failed:", error.message);
    }
  }

  next();
};

// Admin only
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: "Chỉ admin mới có quyền truy cập",
    });
  }
};

module.exports = {
  protect,
  optionalAuth,
  admin,
};

const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://demo-production-151d.up.railway.app",
    /\.vercel\.app$/,
    /\.netlify\.app$/,
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "Pragma",
  ],
  exposedHeaders: ["X-Total-Count", "X-Page-Count"],
  maxAge: 86400, // 24 hours
};

module.exports = cors(corsOptions);

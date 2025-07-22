const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const { specs, swaggerUi, swaggerOptions } = require("./config/swagger");

// Load env vars
dotenv.config();

// Connect to database
const connectDB = require("./config/database");
connectDB();

const app = express();

// Import middleware
const corsMiddleware = require("./middleware/cors");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const {
  securityHeaders,
  suspiciousActivityDetector,
} = require("./middleware/security");
const { sanitizeInput } = require("./middleware/validation");
const { requestLogger } = require("./utils/logger");
const { createUploadDirs } = require("./utils/fileUtils");

// Import routes
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");
const userRoutes = require("./routes/users");

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(securityHeaders);
app.use(suspiciousActivityDetector);

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://demo-production-151d.up.railway.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

app.use(cors(corsOptions));
// CORS configuration
app.use(corsMiddleware);

// Rate limiting
app.use(generalLimiter);

// Compression
app.use(compression());

// Request logging
app.use(requestLogger);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization
app.use(sanitizeInput);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Create upload directories
createUploadDirs();

// Serve static files (uploaded documents)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    timestamp: new Date().toISOString(),
  });
});

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route không tìm thấy",
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

module.exports = app;

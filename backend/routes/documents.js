const express = require("express");
const {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  bookmarkDocument,
  getBookmarkedDocuments,
} = require("../controllers/documentController");

const { protect, optionalAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { documentLimiter } = require("../middleware/rateLimiter");
const {
  createDocumentValidator,
  updateDocumentValidator,
} = require("../validators/documentValidator");

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getDocuments);
router.get("/:id", optionalAuth, getDocument);
router.get("/:id/download", downloadDocument);

// Protected routes
router.post("/", protect, documentLimiter, upload.single("file"), createDocumentValidator, createDocument);
router.put("/:id", protect, updateDocumentValidator, updateDocument);
router.delete("/:id", protect, deleteDocument);
router.post("/:id/bookmark", protect, bookmarkDocument);
router.get("/bookmarks/my", protect, getBookmarkedDocuments);

module.exports = router;
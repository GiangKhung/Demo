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

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Public routes
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.get("/:id/download", downloadDocument);

// Protected routes
router.post("/", protect, upload.single("file"), createDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);
router.post("/:id/bookmark", protect, bookmarkDocument);
router.get("/bookmarks/my", protect, getBookmarkedDocuments);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management and file operations
 */

const express = require("express");
const {
  getPublicDocuments,
  getMyDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  viewDocument,
} = require("../controllers/documentController");

const { protect, optionalAuth } = require("../middleware/auth");
const { uploadDocument: uploadMiddleware } = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimiter");
const {
  uploadDocumentValidator,
  updateDocumentValidator,
} = require("../validators/documentValidator");

const router = express.Router();

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get public documents with search and pagination
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, description, or subject
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject/category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of documents per page
 *     responses:
 *       200:
 *         description: List of public documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of documents returned
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 */
router.get("/", getPublicDocuments);

/**
 * @swagger
 * /api/documents/my/documents:
 *   get:
 *     summary: Get current user's documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of documents per page
 *     responses:
 *       200:
 *         description: User's documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/my/documents", protect, getMyDocuments);

/**
 * @swagger
 * /api/documents/{id}/view:
 *   get:
 *     summary: View document file with CORS headers for external viewers
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: File content with CORS headers
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/view", (req, res) => {
  res.json({ message: "View endpoint working", id: req.params.id });
});

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", optionalAuth, getDocument);

/**
 * @swagger
 * /api/documents/{id}/download:
 *   get:
 *     summary: Download document file
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: File download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Document or file not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/download", optionalAuth, downloadDocument);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Upload a new document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - file
 *             properties:
 *               title:
 *                 type: string
 *                 description: Document title
 *               description:
 *                 type: string
 *                 description: Document description
 *               subject:
 *                 type: string
 *                 description: Document subject/category
 *               ispublic:
 *                 type: boolean
 *                 default: false
 *                 description: Whether document is public
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Document file (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX)
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Validation error or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Test CORS endpoint
router.get("/test-cors", (req, res) => {
  console.log("CORS test request received");
  console.log("Origin:", req.headers.origin);
  console.log("Headers:", req.headers);

  res.json({
    success: true,
    message: "CORS test thành công",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// Test upload endpoint (không cần auth)
router.post("/test-upload", uploadMiddleware, (req, res) => {
  try {
    console.log("Upload test request received");
    console.log("Origin:", req.headers.origin);
    console.log("File:", req.file ? req.file.originalname : "No file");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Không có file được upload",
      });
    }

    res.json({
      success: true,
      message: "Upload test thành công",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
      },
    });
  } catch (error) {
    console.error("Upload test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post(
  "/",
  protect,
  uploadLimiter,
  uploadMiddleware,
  uploadDocumentValidator,
  uploadDocument
);
/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Update document details
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Document title
 *               description:
 *                 type: string
 *                 description: Document description
 *               subject:
 *                 type: string
 *                 description: Document subject/category
 *               ispublic:
 *                 type: boolean
 *                 description: Whether document is public
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Document'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized to update this document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Document deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized to delete this document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", protect, updateDocumentValidator, updateDocument);
router.delete("/:id", protect, deleteDocument);

module.exports = router;

const Document = require("../models/Document");
const DocumentStats = require("../models/DocumentStats");
const UserActivity = require("../models/UserActivity");
const User = require("../models/User");
const { getFileInfo, deleteFile } = require("../middleware/upload");
const { validationResult } = require("express-validator");
const path = require("path");

// @desc    Get all public documents
// @route   GET /api/documents
// @access  Public
const getPublicDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const filetype = req.query.filetype || "";
    const subject = req.query.subject || "";

    // Build query
    let query = { ispublic: true, isDeleted: false };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { keywords: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Add filetype filter
    if (filetype) {
      query.filetype = filetype;
    }

    // Add subject filter
    if (subject) {
      query.subject = { $regex: subject, $options: "i" };
    }

    const documents = await Document.find(query)
      .populate("userid", "name email")
      .sort({ createdat: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's documents
// @route   GET /api/documents/my
// @access  Private
const getMyDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const documents = await Document.find({
      userid: req.user.id,
      isDeleted: false,
    })
      .sort({ createdat: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments({
      userid: req.user.id,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Public/Private
const getDocument = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "ID tài liệu không hợp lệ",
      });
    }

    const document = await Document.findById(req.params.id).populate(
      "userid",
      "name email"
    );

    if (!document || document.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "Tài liệu không tìm thấy",
      });
    }

    // Check if document is private and user is not owner
    if (
      !document.ispublic &&
      (!req.user || req.user.id !== document.userid._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền truy cập tài liệu này",
      });
    }

    // Increment view count
    document.viewCount += 1;
    await document.save();

    // Update document stats
    await updateDocumentStats(document._id, "view");

    // Log activity if user is logged in
    if (req.user) {
      await UserActivity.create({
        userid: req.user.id,
        activityType: "view",
        documentid: document._id,
        description: `Đã xem tài liệu "${document.title}"`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        document,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Dữ liệu không hợp lệ",
        details: errors.array(),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng chọn file để upload",
      });
    }

    const fileInfo = getFileInfo(req.file);
    const { title, description, subject, ispublic, keywords, tags } = req.body;

    // Check user storage limit
    const user = await User.findById(req.user.id);
    if (user.storageUsed + fileInfo.fileSize > user.storageLimit) {
      // Delete uploaded file
      deleteFile(path.join(__dirname, "../uploads", fileInfo.filename));

      return res.status(400).json({
        success: false,
        error: "Vượt quá giới hạn dung lượng lưu trữ",
      });
    }

    // Create document
    const document = await Document.create({
      title,
      description,
      fileurl: fileInfo.fileUrl,
      originalFileName: fileInfo.originalName,
      filetype: fileInfo.fileType,
      filesize: fileInfo.fileSize,
      subject,
      ispublic: ispublic === "true",
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      userid: req.user.id,
    });

    // Update user storage
    user.storageUsed += fileInfo.fileSize;
    await user.save();

    // Create document stats
    await DocumentStats.create({
      documentId: document._id,
    });

    // Log activity
    await UserActivity.create({
      userid: req.user.id,
      activityType: "upload",
      documentid: document._id,
      description: `Đã tải lên tài liệu "${document.title}"`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    const populatedDocument = await Document.findById(document._id).populate(
      "userid",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Upload tài liệu thành công",
      data: {
        document: populatedDocument,
      },
    });
  } catch (error) {
    // Delete uploaded file if document creation fails
    if (req.file) {
      deleteFile(path.join(__dirname, "../uploads", req.file.filename));
    }
    next(error);
  }
};

// Helper function to update document stats
const updateDocumentStats = async (documentId, action) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let updateQuery = {};
    let dailyUpdateQuery = {};

    switch (action) {
      case "view":
        updateQuery = { $inc: { views: 1 } };
        dailyUpdateQuery = { $inc: { "dailyStats.$.views": 1 } };
        break;
      case "download":
        updateQuery = { $inc: { downloads: 1 } };
        dailyUpdateQuery = { $inc: { "dailyStats.$.downloads": 1 } };
        break;
      case "share":
        updateQuery = { $inc: { shares: 1 } };
        dailyUpdateQuery = { $inc: { "dailyStats.$.shares": 1 } };
        break;
    }

    // Update overall stats
    await DocumentStats.findOneAndUpdate({ documentId }, updateQuery, {
      upsert: true,
    });

    // Update daily stats
    const stats = await DocumentStats.findOne({ documentId });
    const todayStats = stats.dailyStats.find(
      (stat) => stat.date.toDateString() === today.toDateString()
    );

    if (todayStats) {
      await DocumentStats.updateOne(
        { documentId, "dailyStats.date": today },
        dailyUpdateQuery
      );
    } else {
      await DocumentStats.updateOne(
        { documentId },
        {
          $push: {
            dailyStats: {
              date: today,
              views: action === "view" ? 1 : 0,
              downloads: action === "download" ? 1 : 0,
              shares: action === "share" ? 1 : 0,
            },
          },
        }
      );
    }
  } catch (error) {
    console.error("Error updating document stats:", error);
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "Tài liệu không tìm thấy",
      });
    }

    // Check ownership
    if (document.userid.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền chỉnh sửa tài liệu này",
      });
    }

    const { title, description, subject, ispublic, keywords, tags } = req.body;

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        subject,
        ispublic,
        keywords: keywords
          ? keywords.split(",").map((k) => k.trim())
          : document.keywords,
        tags: tags ? tags.split(",").map((t) => t.trim()) : document.tags,
      },
      { new: true, runValidators: true }
    ).populate("userid", "name email");

    res.status(200).json({
      success: true,
      message: "Cập nhật tài liệu thành công",
      data: {
        document: updatedDocument,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "Tài liệu không tìm thấy",
      });
    }

    // Check ownership
    if (document.userid.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền xóa tài liệu này",
      });
    }

    // Soft delete
    document.isDeleted = true;
    document.deletedAt = new Date();
    await document.save();

    // Update user storage
    const user = await User.findById(req.user.id);
    user.storageUsed = Math.max(0, user.storageUsed - document.filesize);
    await user.save();

    // Log activity
    await UserActivity.create({
      userid: req.user.id,
      activityType: "delete",
      documentid: document._id,
      description: `Đã xóa tài liệu "${document.title}"`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(200).json({
      success: true,
      message: "Xóa tài liệu thành công",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Public/Private
const downloadDocument = async (req, res, next) => {
  try {
    // Validate ObjectId format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "ID tài liệu không hợp lệ",
      });
    }

    const document = await Document.findById(req.params.id);

    if (!document || document.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "Tài liệu không tìm thấy",
      });
    }

    // Check if document is private and user is not owner
    if (
      !document.ispublic &&
      (!req.user || req.user.id !== document.userid.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền tải xuống tài liệu này",
      });
    }

    // Increment download count
    document.downloadCount += 1;
    await document.save();

    // Update document stats
    await updateDocumentStats(document._id, "download");

    // Log activity if user is logged in
    if (req.user) {
      await UserActivity.create({
        userid: req.user.id,
        activityType: "download",
        documentid: document._id,
        description: `Đã tải xuống tài liệu "${document.title}"`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(document.fileurl)
    );

    res.download(filePath, document.originalFileName, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(404).json({
          success: false,
          error: "File không tồn tại",
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View document with CORS headers for external viewers
// @route   GET /api/documents/:id/view
// @access  Public/Private (depends on document visibility)
const viewDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document || document.isDeleted) {
      return res.status(404).json({
        success: false,
        error: "Tài liệu không tồn tại",
      });
    }

    // Check if user can access this document
    if (
      !document.ispublic &&
      (!req.user || req.user.id !== document.userid.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: "Bạn không có quyền truy cập tài liệu này",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(document.fileurl)
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "File không tồn tại trên server",
      });
    }

    // Update view count
    await DocumentStats.findOneAndUpdate(
      { documentId: document._id },
      { $inc: { views: 1 } },
      { upsert: true }
    );

    // Log activity if user is logged in
    if (req.user) {
      await UserActivity.create({
        userid: req.user.id,
        activityType: "view",
        documentid: document._id,
        description: `Đã xem tài liệu "${document.title}"`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    }

    // Set CORS headers for external viewers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

    // Set content type based on file extension
    const mimeTypes = require("mime-types");
    const mimeType = mimeTypes.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.originalFileName}"`
    );

    // Send file
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicDocuments,
  getMyDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  viewDocument,
  updateDocumentStats,
};

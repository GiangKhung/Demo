const Document = require("../models/Document");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");

// @desc    Get all documents (public)
// @route   GET /api/documents
// @access  Public
const getDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: "approved" };

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { keywords: { $in: [new RegExp(req.query.search, "i")] } },
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by file type
    if (req.query.filetype) {
      query.filetype = req.query.filetype;
    }

    // Sort
    let sortBy = { createdAt: -1 };
    if (req.query.sort === "popular") {
      sortBy = { downloadCount: -1 };
    } else if (req.query.sort === "title") {
      sortBy = { title: 1 };
    }

    const documents = await Document.find(query)
      .populate("uploadedBy", "name")
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalDocuments: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Public
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài liệu",
      });
    }

    // Increment view count
    document.viewCount += 1;
    await document.save();

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Create new document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res) => {
  try {
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

    const { title, description, category, keywords } = req.body;

    // Create document
    const document = await Document.create({
      title,
      description,
      category,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
      fileurl: `/uploads/${req.file.filename}`,
      originalFileName: req.file.originalname,
      filetype: path.extname(req.file.originalname).toLowerCase().slice(1),
      filesize: req.file.size,
      uploadedBy: req.user.id,
    });

    await document.populate("uploadedBy", "name");

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài liệu",
      });
    }

    // Check ownership
    if (
      document.uploadedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền chỉnh sửa tài liệu này",
      });
    }

    const { title, description, category, keywords } = req.body;

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        keywords: keywords
          ? keywords.split(",").map((k) => k.trim())
          : document.keywords,
      },
      { new: true, runValidators: true }
    ).populate("uploadedBy", "name");

    res.json({
      success: true,
      data: updatedDocument,
    });
  } catch (error) {
    console.error("Update document error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài liệu",
      });
    }

    // Check ownership
    if (
      document.uploadedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Không có quyền xóa tài liệu này",
      });
    }

    // Delete file from filesystem
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(document.fileurl)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Đã xóa tài liệu thành công",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Public
const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài liệu",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(document.fileurl)
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: "File không tồn tại",
      });
    }

    // Increment download count
    document.downloadCount += 1;
    await document.save();

    res.download(filePath, document.originalFileName);
  } catch (error) {
    console.error("Download document error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Bookmark document
// @route   POST /api/documents/:id/bookmark
// @access  Private
const bookmarkDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy tài liệu",
      });
    }

    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarks.includes(req.params.id);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== req.params.id
      );
    } else {
      user.bookmarks.push(req.params.id);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !isBookmarked,
      message: isBookmarked ? "Đã bỏ bookmark" : "Đã bookmark",
    });
  } catch (error) {
    console.error("Bookmark document error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

// @desc    Get bookmarked documents
// @route   GET /api/documents/bookmarks/my
// @access  Private
const getBookmarkedDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "bookmarks",
      populate: {
        path: "uploadedBy",
        select: "name",
      },
    });

    res.json({
      success: true,
      data: user.bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarked documents error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  bookmarkDocument,
  getBookmarkedDocuments,
};

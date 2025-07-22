const User = require('../models/User');
const Document = require('../models/Document');
const Bookmark = require('../models/Bookmark');
const UserActivity = require('../models/UserActivity');
const DocumentStats = require('../models/DocumentStats');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get document counts
    const totalDocuments = await Document.countDocuments({ 
      userid: userId, 
      isDeleted: false 
    });
    
    const uploadedDocuments = totalDocuments;
    
    const savedDocuments = await Bookmark.countDocuments({ userid: userId });

    // Get user info for storage
    const user = await User.findById(userId);

    // Get documents by type
    const documentsByType = await Document.aggregate([
      { 
        $match: { 
          userid: user._id, 
          isDeleted: false 
        } 
      },
      {
        $group: {
          _id: '$filetype',
          count: { $sum: 1 }
        }
      }
    ]);

    const documentTypeMap = {};
    documentsByType.forEach(item => {
      documentTypeMap[item._id] = item.count;
    });

    // Get recent activities
    const recentActivities = await UserActivity.find({ userid: userId })
      .populate('documentid', 'title')
      .sort({ createdat: -1 })
      .limit(10);

    const stats = {
      totalDocuments,
      savedDocuments,
      uploadedDocuments,
      totalStorage: user.storageLimit,
      usedStorage: user.storageUsed,
      documentsByType: documentTypeMap,
      recentActivities
    };

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activities
// @route   GET /api/users/activities
// @access  Private
const getUserActivities = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const activities = await UserActivity.find({ userid: req.user.id })
      .populate('documentid', 'title')
      .sort({ createdat: -1 })
      .skip(skip)
      .limit(limit);

    const total = await UserActivity.countDocuments({ userid: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
const getUserBookmarks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ userid: req.user.id })
      .populate({
        path: 'documentid',
        populate: {
          path: 'userid',
          select: 'name email'
        }
      })
      .sort({ createdat: -1 })
      .skip(skip)
      .limit(limit);

    // Filter out bookmarks with deleted documents
    const validBookmarks = bookmarks.filter(bookmark => 
      bookmark.documentid && !bookmark.documentid.isDeleted
    );

    const total = await Bookmark.countDocuments({ userid: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        bookmarks: validBookmarks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add bookmark
// @route   POST /api/users/bookmarks/:documentId
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { note } = req.body;

    // Check if document exists and is accessible
    const document = await Document.findById(documentId);
    
    if (!document || document.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Tài liệu không tìm thấy'
      });
    }

    // Check if document is public or user is owner
    if (!document.ispublic && document.userid.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Không có quyền bookmark tài liệu này'
      });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      userid: req.user.id,
      documentid: documentId
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        error: 'Tài liệu đã được bookmark'
      });
    }

    // Create bookmark
    const bookmark = await Bookmark.create({
      userid: req.user.id,
      documentid: documentId,
      note
    });

    // Log activity
    await UserActivity.create({
      userid: req.user.id,
      activityType: 'save',
      documentid: documentId,
      description: `Đã lưu tài liệu "${document.title}"`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const populatedBookmark = await Bookmark.findById(bookmark._id)
      .populate({
        path: 'documentid',
        populate: {
          path: 'userid',
          select: 'name email'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Đã thêm bookmark thành công',
      data: {
        bookmark: populatedBookmark
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/users/bookmarks/:documentId
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      userid: req.user.id,
      documentid: documentId
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        error: 'Bookmark không tìm thấy'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Đã xóa bookmark thành công'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getUserStats,
  getUserActivities,
  getUserBookmarks,
  addBookmark,
  removeBookmark
};

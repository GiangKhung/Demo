const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'
  ];
  
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Loại file .${ext} không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1 // Only allow 1 file per upload
  },
  fileFilter: fileFilter
});

// Middleware to handle upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File quá lớn. Kích thước tối đa cho phép là 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Chỉ được upload 1 file tại một thời điểm'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Field name không hợp lệ'
      });
    }
  }
  
  if (err.message.includes('không được hỗ trợ')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  next(err);
};

// Single file upload middleware
const uploadSingle = upload.single('file');

// Wrapper to handle upload with error handling
const uploadDocument = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res, next);
    }
    next();
  });
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file info
const getFileInfo = (file) => {
  if (!file) return null;
  
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const fileUrl = `/uploads/${file.filename}`;
  
  return {
    originalName: file.originalname,
    filename: file.filename,
    fileUrl: fileUrl,
    fileType: ext,
    fileSize: file.size,
    mimetype: file.mimetype
  };
};

module.exports = {
  uploadDocument,
  handleUploadError,
  deleteFile,
  getFileInfo,
  uploadDir
};

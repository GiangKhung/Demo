const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/thumbnails'),
    path.join(__dirname, '../uploads/temp')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Format file size to human readable
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file extension
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase().slice(1);
};

// Check if file type is allowed
const isAllowedFileType = (filename) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'
  ];
  
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
};

// Generate thumbnail for documents (placeholder for now)
const generateThumbnail = async (filePath, outputPath) => {
  try {
    // For now, create a simple placeholder thumbnail
    // In production, you might want to use libraries like pdf2pic for PDF thumbnails
    const placeholderBuffer = Buffer.from(
      `<svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="250" fill="#f3f4f6"/>
        <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">
          Document
        </text>
      </svg>`
    );

    await sharp(placeholderBuffer)
      .png()
      .resize(200, 250)
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return false;
  }
};

// Clean up old files (for maintenance)
const cleanupOldFiles = async (daysOld = 30) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile() && stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }

    console.log(`Cleaned up ${deletedCount} old files`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return 0;
  }
};

// Validate file integrity
const validateFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      modified: stats.mtime,
      isValid: stats.size > 0
    };
  } catch (error) {
    return {
      exists: false,
      isValid: false
    };
  }
};

// Get MIME type from file extension
const getMimeType = (filename) => {
  const ext = getFileExtension(filename);
  const mimeTypes = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  return mimeTypes[ext] || 'application/octet-stream';
};

module.exports = {
  createUploadDirs,
  formatFileSize,
  getFileExtension,
  isAllowedFileType,
  generateThumbnail,
  cleanupOldFiles,
  validateFile,
  getMimeType
};

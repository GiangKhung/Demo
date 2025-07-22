const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề tài liệu'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Mô tả không được quá 1000 ký tự']
  },
  fileurl: {
    type: String,
    required: [true, 'File URL là bắt buộc']
  },
  originalFileName: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  filetype: {
    type: String,
    required: [true, 'Loại file là bắt buộc'],
    enum: ['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx']
  },
  filesize: {
    type: Number,
    required: [true, 'Kích thước file là bắt buộc'],
    min: 0
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Chủ đề không được quá 100 ký tự']
  },
  ispublic: {
    type: Boolean,
    default: false
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: String,
    trim: true,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  shareCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' }
});

// Indexes for better performance
documentSchema.index({ userid: 1, createdat: -1 });
documentSchema.index({ ispublic: 1, createdat: -1 });
documentSchema.index({ title: 'text', description: 'text', subject: 'text' });
documentSchema.index({ keywords: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ filetype: 1 });
documentSchema.index({ isDeleted: 1 });

// Virtual for file size in human readable format
documentSchema.virtual('filesizeFormatted').get(function() {
  const bytes = this.filesize;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Pre-save middleware to update keywords from title and description
documentSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('description')) {
    const text = `${this.title} ${this.description || ''}`.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    
    // Extract meaningful keywords (length > 2)
    const meaningfulWords = words.filter(word => word.length > 2);
    this.keywords = [...new Set([...this.keywords, ...meaningfulWords])];
  }
  next();
});

// Transform output
documentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Document', documentSchema);

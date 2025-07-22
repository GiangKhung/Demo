const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['upload', 'download', 'view', 'share', 'save', 'delete', 'login', 'register']
  },
  documentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Mô tả không được quá 500 ký tự']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'createdat', updatedAt: false }
});

// Indexes for better performance
userActivitySchema.index({ userid: 1, createdat: -1 });
userActivitySchema.index({ activityType: 1, createdat: -1 });
userActivitySchema.index({ documentid: 1, createdat: -1 });
userActivitySchema.index({ createdat: -1 });

// Transform output
userActivitySchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('UserActivity', userActivitySchema);

const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  note: {
    type: String,
    trim: true,
    maxlength: [500, 'Ghi chú không được quá 500 ký tự']
  }
}, {
  timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' }
});

// Compound index to ensure unique bookmark per user per document
bookmarkSchema.index({ userid: 1, documentid: 1 }, { unique: true });
bookmarkSchema.index({ userid: 1, createdat: -1 });

// Transform output
bookmarkSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);

const mongoose = require('mongoose');

const documentStatsSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  downloads: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  uniqueViewers: [{
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewCount: {
      type: Number,
      default: 1
    },
    lastViewed: {
      type: Date,
      default: Date.now
    }
  }],
  dailyStats: [{
    date: {
      type: Date,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' }
});

// Indexes
documentStatsSchema.index({ documentId: 1 });
documentStatsSchema.index({ 'dailyStats.date': -1 });

// Transform output
documentStatsSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('DocumentStats', documentStatsSchema);

const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề"],
      trim: true,
      maxlength: [200, "Tiêu đề không được quá 200 ký tự"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Mô tả không được quá 1000 ký tự"],
    },
    category: {
      type: String,
      trim: true,
      default: "Khác",
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    fileurl: {
      type: String,
      required: [true, "File URL là bắt buộc"],
    },
    originalFileName: {
      type: String,
      required: [true, "Tên file gốc là bắt buộc"],
    },
    filetype: {
      type: String,
      required: [true, "Loại file là bắt buộc"],
    },
    filesize: {
      type: Number,
      required: [true, "Kích thước file là bắt buộc"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
documentSchema.index({ title: "text", description: "text", keywords: "text" });

module.exports = mongoose.model("Document", documentSchema);

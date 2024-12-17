import mongoose from "mongoose";

const FeedBackSchema = new mongoose.Schema(
  {
    feedBackBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với model User
      required: true,
    },
    postTitle: {
      type: String, // Tiêu đề của bài viết (không bắt buộc)
      trim: true,
    },
    content: {
      type: String,
      required: true, // Nội dung báo cáo là bắt buộc
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Chỉ lưu `createdAt`
  }
);

export default mongoose.model("FeedBack", FeedBackSchema);

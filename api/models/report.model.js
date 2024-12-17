import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId, // Người report
      ref: "User", // Liên kết với model User
      required: true,
    },
    reportedListing: {
      type: mongoose.Schema.Types.ObjectId, // Listing bị report
      ref: "Listing", // Liên kết với model Listing
      required: true,
    },
    content: {
      type: String, // Nội dung report
      required: true,
      trim: true, // Xóa khoảng trắng thừa
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

export default mongoose.model("Report", ReportSchema);

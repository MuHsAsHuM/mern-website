import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from 'bcryptjs'
import FeedBack from "../models/feedback.model.js";
import Report from "../models/report.model.js";
import mongoose from "mongoose";

export const fetchUser = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const skip = (page - 1) * limit;

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createAt";
    const order = req.query.order || "desc";
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
      isAdmin: false,
    })
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalUsers = await User.countDocuments(
      { username: { $regex: searchTerm, $options: "i" }, isAdmin: false } // Trường hợp isAdmin = false
    );

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    next(error);
  }
}; // code như get Listings giống trong listing.route.js nhưng thêm param page và skip đến số page đấy
//limit = 5

export const updateListingStatus = async (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    return res.json({ success: true, data: updatedListing });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};



export const fetchListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * limit;

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .populate({
        path: "userRef", 
        select: "email", 
        model: User,    
      });

    const totalListing = await Listing.countDocuments({
      name: { $regex: searchTerm, $options: "i" },
    });

    return res.status(200).json({ listings, totalListing });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isBanned: status } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    return res.status(200).json("User deleted");
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    return res.status(200).json("Listing deleted");
  } catch (error) {
    next(error);
  }
}

export const permanentDeleteListing = async (req, res, next) => {
  try {
    //add isDeleted to listing model and update later
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    return res.status(200).json("Listing deleted");
  } catch (error) {
    next(error);
  }
};

export const update = async () => {
  try {
    const result = await User.updateMany(
      { silverCard: { $exists: false } },
      { $set: { silverCard: 10 } }
    );
    const result2 = await User.updateMany(
      { goldCard: { $exists: false } },
      { $set: { goldCard: 3 } }
    );
    console.log(`${result.nModified} documents were updated.`);
  } catch (err) {
    console.error("Error updating documents:", err);
  }
};


export const createAdmin = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isAdmin: true,
  });
  try {
    await newUser.save();
    res.status(201).json("Admin created successfully!");
  } catch (error) {
    next(error);
  }

};

export const getUserStatisticsByDate = async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 }, // Đếm số lượng người dùng cho mỗi ngày
        },
      },
      {
        $sort: { _id: -1 }, // Sắp xếp theo ngày giảm
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const getListingStatisticsByDate = async (req, res, next) => {
  try {
    const stats = await Listing.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 }, // Đếm số lượng người dùng cho mỗi ngày
        },
      },
      {
        $sort: { _id: -1 }, // Sắp xếp theo ngày giảm
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const getOrderStatisticsByDate = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalIncome: { $sum: "$price" }, // Tổng doanh thu cho mỗi ngày
        },
      },
      {
        $sort: { _id: -1 }, // Sắp xếp theo ngày giảm dần
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    // Lấy danh sách tất cả các report, kèm thông tin chi tiết
    const reports = await Report.find()
      .populate("reportedBy", "username email") // Lấy `name` và `email` của người report
      .populate("reportedListing", "title description"); // Lấy `title` và `description` của listing bị report

    // Trả về danh sách các report
    res.status(200).json({
      message: "Lấy danh sách report thành công.",
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedBacks = async (req, res, next) => {
  try {
    // Lấy danh sách tất cả feedbacks, kèm thông tin chi tiết về người gửi (nếu cần)
    const feedbacks = await FeedBack.find().populate(
      "feedBackBy",
      "username email"
    ); // Lấy `name` và `email` của người gửi feedback

    // Trả về danh sách feedbacks
    res.status(200).json({
      message: "Lấy danh sách feedback thành công.",
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Lấy ID từ URL

    // Kiểm tra tính hợp lệ của ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ." });
    }

    // Kiểm tra xem report có tồn tại hay không
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report không tồn tại." });
    }

    // Xóa report
    await Report.findByIdAndDelete(id);

    res.status(200).json({ message: "Xóa report thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa report:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình xóa report.",
      error: error.message,
    });
  }
};

export const deleteFeedBack = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ URL params

    // Kiểm tra xem feedback có tồn tại không
    const feedback = await FeedBack.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback không tồn tại." });
    }

    // Xóa feedback
    await FeedBack.findByIdAndDelete(id);

    res.status(200).json({ message: "Xóa feedback thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa feedback:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình xóa feedback.",
      error: error.message,
    });
  }
};




import { errorHandler } from "../utils/errorHandler.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import FeedBack from "../models/feedback.model.js";
import Report from "../models/report.model.js";
import Order from "../models/order.model.js";
export const test = (req, res) => {
  res.json({
    message: "Hello minh",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only delete own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("user have been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const createFeedBack = async (req, res, next) => {
  try {
    const { feedBackBy, postTitle, content } = req.body; // Dữ liệu từ frontend

    if (!feedBackBy || !content) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }

    // Tạo report mới
    const newFeedBack = await FeedBack.create({
      feedBackBy,
      postTitle,
      content,
    });

    res.status(201).json(newFeedBack); // Trả về báo cáo vừa được tạo
  } catch (error) {
    next(error); // Xử lý lỗi
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { reportedBy, reportedListing, content } = req.body; // Lấy dữ liệu từ frontend

    // Kiểm tra dữ liệu bắt buộc
    if (!reportedBy || !reportedListing || !content) {
      return res.status(400).json({
        message:
          "Thiếu thông tin bắt buộc (reportedBy, reportedListing hoặc content).",
      });
    }

    // Tạo report mới
    const newReport = await Report.create({
      reportedBy,
      reportedListing,
      content,
    });

    // Trả về report vừa được tạo
    res.status(201).json({
      message: "Tạo report thành công.",
      data: newReport,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { userRef, bundle, quantity, price, orderID } = req.body;
    if (!userRef || !bundle || !quantity || !price || !orderID) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc (userRef, bundle, quantity, price).",
      });
    }

    const newOrder = await Order.create({
      userRef,
      bundle,
      quantity,
      price,
      orderID,
    });

    if (bundle === "silver") {
      // Cộng thêm số lượng vào silverCard
      await User.findByIdAndUpdate(userRef, {
        $inc: { silverCard: quantity }, // $inc dùng để tăng giá trị
      });
      console.log("Updated silverCard");
    } else if (bundle === "gold") {
      // Cộng thêm số lượng vào goldCard
      await User.findByIdAndUpdate(userRef, {
        $inc: { goldCard: quantity }, // $inc dùng để tăng giá trị
      });
      console.log("Updated goldCard");
    } else {
      console.log("Invalid bundle type");
    }

    res.status(201).json({
      message: "Tạo order thành công.",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
}
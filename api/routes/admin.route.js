import express from "express";

import {
  fetchUser,
  fetchListing,
  createAdmin,
  getUserStatisticsByDate,
  getReports,
  getFeedBacks,
  deleteReport,
  deleteFeedBack,
  getListingStatisticsByDate,
  banUser,
  update,
  updateListingStatus,
  deleteUser,
  deleteListing,
  getOrderStatisticsByDate
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", fetchUser);









router.post("/update", update);

router.get("/users/stats", getUserStatisticsByDate);

router.put("/users/ban/:id", banUser);
router.delete("/users/delete/:id", deleteUser);
router.get("/listings", fetchListing);
router.get("/listings/stats", getListingStatisticsByDate);
router.put("/listings/status/:id", updateListingStatus);
router.delete("/listings/delete/:id", deleteListing);
router.get("/orders/stats", getOrderStatisticsByDate);
router.get("/getFeedBacks", getFeedBacks);
router.post('/createAdmin', createAdmin)
router.delete("/deleteFeedBack/:id", deleteFeedBack);
router.get("/getReports", getReports);
router.delete("/deleteReport/:id", deleteReport);

export default router;


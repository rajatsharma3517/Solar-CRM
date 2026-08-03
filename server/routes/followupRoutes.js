const express = require("express");
const router = express.Router();

const {
  getAllFollowUps,
  addFollowUp,
  getFollowUpsByCustomer,
  getOverdueFollowUps,
  updateFollowUp,
  getTodayFollowups,
  deleteFollowUp,
} = require("../controllers/followupController");

router.get("/", getAllFollowUps);

router.get("/overdue", getOverdueFollowUps);

router.post("/", addFollowUp);

router.get("/customer/:id", getFollowUpsByCustomer);

router.get("/today", getTodayFollowups);

router.put("/:id", updateFollowUp);

router.delete("/:id", deleteFollowUp);

module.exports = router;
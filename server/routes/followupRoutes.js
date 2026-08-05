const express = require("express");
const router = express.Router();

// 🔐 Authentication middleware
const verifyToken = require("../middleware/authMiddleware");

const {
  getAllFollowUps,
  addFollowUp,
  getFollowUpsByCustomer,
  getOverdueFollowUps,
  updateFollowUp,
  getTodayFollowups,
  deleteFollowUp,
} = require("../controllers/followupController");


// ==========================================
// FROM HERE ALL FOLLOW-UP ROUTES NEED LOGIN
// ==========================================

router.use(verifyToken);


// GET ALL FOLLOW-UPS
router.get("/", getAllFollowUps);


// GET OVERDUE FOLLOW-UPS
router.get("/overdue", getOverdueFollowUps);


// ADD FOLLOW-UP
router.post("/", addFollowUp);


// GET FOLLOW-UPS OF CUSTOMER
router.get("/customer/:id", getFollowUpsByCustomer);


// GET TODAY FOLLOW-UPS
router.get("/today", getTodayFollowups);


// UPDATE FOLLOW-UP
router.put("/:id", updateFollowUp);


// DELETE FOLLOW-UP
router.delete("/:id", deleteFollowUp);


module.exports = router;
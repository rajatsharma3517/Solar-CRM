const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminOnly =
  require("../middleware/adminMiddleware");

const {
  getUsers,
  addUser,
  updateUserStatus,
  resetUserPassword,
  updateUser,
  getUserAssignmentSummary,
  reassignAndDeleteUser,
} = require("../controllers/userController");


// Every route below requires:
// 1. Valid login
// 2. Admin role

router.use(verifyToken);
router.use(adminOnly);


// GET ALL USERS
router.get("/", getUsers);


// ADD NEW USER
router.post("/", addUser);

// ENABLE / DISABLE EMPLOYEE
router.patch("/:id/status", updateUserStatus);

// RESET EMPLOYEE PASSWORD
router.patch("/:id/reset-password", resetUserPassword);

// EDIT EMPLOYEE
router.put("/:id", updateUser);

// GET EMPLOYEE ASSIGNED LEADS / CUSTOMERS COUNT
router.get("/:id/assignment-summary", getUserAssignmentSummary);

// REASSIGN RECORDS AND DELETE EMPLOYEE
router.delete("/:id/reassign", reassignAndDeleteUser);

module.exports = router;
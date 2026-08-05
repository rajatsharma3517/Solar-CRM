const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

// 🔐 Authentication middleware
const verifyToken = require("../middleware/authMiddleware");

// 👑 Admin authorization middleware
const adminOnly = require("../middleware/adminMiddleware");

const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  convertToCustomer,
  getCustomerById,
  uploadDocument,
  getRecentLeads,
  assignCustomer,
} = require("../controllers/customerController");


// 🔐 From here onwards, every route requires login
router.use(verifyToken);


// GET ALL CUSTOMERS
router.get("/", getCustomers);


// ADD CUSTOMER
router.post("/", addCustomer);


// GET RECENT LEADS
router.get("/recent", getRecentLeads);


// GET CUSTOMER BY ID
router.get("/:id", getCustomerById);

// 👑 ADMIN ONLY - ASSIGN LEAD TO EMPLOYEE
router.put(
  "/:id/assign",
  adminOnly,
  assignCustomer
);


// UPLOAD CUSTOMER DOCUMENT
router.post(
  "/:id/upload/:documentType",
  upload.single("file"),
  uploadDocument
);


// UPDATE CUSTOMER
router.put("/:id", updateCustomer);


// CONVERT LEAD TO CUSTOMER
router.put("/:id/convert", convertToCustomer);


// DELETE CUSTOMER
router.delete("/:id", deleteCustomer);


module.exports = router;
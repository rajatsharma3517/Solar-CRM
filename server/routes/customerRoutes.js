const express = require("express");

const router = express.Router();
const upload = require("../middleware/upload");

const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  convertToCustomer,
  getCustomerById,
  uploadDocument,
  getRecentLeads,
} = require("../controllers/customerController");


// GET ALL CUSTOMERS
router.get("/", getCustomers);

// ADD CUSTOMER
router.post("/", addCustomer);

router.get("/recent", getRecentLeads)

router.get("/:id", getCustomerById);

router.post(
  "/:id/upload/:documentType",
  upload.single("file"),
  uploadDocument
);


// UPDATE CUSTOMER
router.put("/:id", updateCustomer);

router.put("/:id/convert", convertToCustomer);

// DELETE CUSTOMER
router.delete("/:id", deleteCustomer);

module.exports = router;
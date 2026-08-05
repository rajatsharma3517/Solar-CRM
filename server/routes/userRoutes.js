const express = require("express");

const router = express.Router();

const verifyToken =
  require("../middleware/authMiddleware");

const adminOnly =
  require("../middleware/adminMiddleware");

const {
  getUsers,
  addUser,
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


module.exports = router;
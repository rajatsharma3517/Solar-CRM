const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const followupRoutes = require("./routes/followupRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();


// ================= MIDDLEWARE =================

app.use(cors());

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// ================= ROUTES =================

// Login / Authentication
app.use("/api/auth", authRoutes);

// Admin - Manage Users
app.use("/api/users", userRoutes);

// Customers & Leads
app.use("/customers", customerRoutes);

// Follow Ups
app.use("/followups", followupRoutes);

// Recent Activities
app.use("/activities", activityRoutes);


// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
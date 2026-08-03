const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const followupRoutes = require("./routes/followupRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Routes
app.use("/customers", customerRoutes);
app.use("/followups", followupRoutes);
app.use("/activities", activityRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
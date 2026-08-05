const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error("Login DB Error:", err);

        return res.status(500).json({
          message: "Server error",
        });
      }

      // User not found
      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const user = results[0];

      console.log("USER FOUND:", user.username);
      console.log("DB PASSWORD:", user.password);

      // Check whether account is disabled
      if (
        user.status &&
        user.status.toLowerCase() === "disabled"
      ) {
        return res.status(403).json({
          message: "Your account has been disabled",
        });
      }

      // Compare entered password with hashed password
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      console.log("ENTERED PASSWORD:", password);
      console.log("PASSWORD MATCH:", passwordMatch);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }



      // Create JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET || "solarcrmsecret",
        {
          expiresIn: "1d",
        }
      );

      // Login successful
      return res.status(200).json({
        message: "Login successful",

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
      });
    });
  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  login,
};
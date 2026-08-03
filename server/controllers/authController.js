const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(401).json({
          message: "Invalid Username",
        });
      }

      const user = results[0];

      // Temporary plain password check
      if (password !== user.password) {
        return res.status(401).json({
          message: "Invalid Password",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        "solarcrmsecret",
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  login,
};
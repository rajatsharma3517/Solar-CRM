const db = require("../config/db");
const bcrypt = require("bcryptjs");


// ==========================================
// GET ALL USERS
// Admin can see all employees
// ==========================================

const getUsers = (req, res) => {

  const sql = `
    SELECT 
      id,
      name,
      email,
      username,
      phone,
      role,
      status,
      created_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error("Get Users Error:", err);

      return res.status(500).json({
        message: "Failed to fetch users",
      });
    }

    return res.status(200).json(results);

  });
};


// ==========================================
// ADD NEW USER
// Only Admin can create employees
// ==========================================

const addUser = async (req, res) => {

  try {

    const {
      name,
      email,
      username,
      password,
      phone,
    } = req.body;


    // Check required fields
    if (!name || !email || !username || !password) {

      return res.status(400).json({
        message:
          "Name, email, username and password are required",
      });

    }


    // Check username or email already exists
    const checkSql = `
      SELECT id
      FROM users
      WHERE username = ? OR email = ?
    `;

    db.query(
      checkSql,
      [username, email],
      async (err, results) => {

        if (err) {

          console.error("Check User Error:", err);

          return res.status(500).json({
            message: "Server error",
          });

        }


        // Duplicate user
        if (results.length > 0) {

          return res.status(409).json({
            message:
              "Username or email already exists",
          });

        }


        // Hash employee password
        const hashedPassword =
          await bcrypt.hash(password, 10);


        // New employees are ALWAYS users
        const role = "User";

        // Account active by default
        const status = "Active";


        const insertSql = `
          INSERT INTO users
          (
            name,
            email,
            username,
            password,
            phone,
            role,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        db.query(
          insertSql,
          [
            name,
            email,
            username,
            hashedPassword,
            phone || null,
            role,
            status,
          ],
          (err, result) => {

            if (err) {

              console.error(
                "Create User Error:",
                err
              );

              return res.status(500).json({
                message:
                  "Failed to create user",
              });

            }


            return res.status(201).json({

              message:
                "Employee created successfully",

              user: {
                id: result.insertId,
                name,
                email,
                username,
                phone: phone || null,
                role,
                status,
              },

            });

          }
        );

      }
    );

  } catch (error) {

    console.error(
      "Add User Error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });

  }

};


module.exports = {
  getUsers,
  addUser,
};
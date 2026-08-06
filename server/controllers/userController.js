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

// ==========================================
// ENABLE / DISABLE USER
// Only Admin can change employee status
// ==========================================

const updateUserStatus = (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  // Only these two values are allowed
  if (!["Active", "Disabled"].includes(status)) {
    return res.status(400).json({
      message: "Status must be Active or Disabled",
    });
  }

  // Admin cannot disable their own account
  if (Number(userId) === Number(req.user.id)) {
    return res.status(400).json({
      message: "You cannot change your own account status",
    });
  }

  const sql = `
    UPDATE users
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, userId], (err, result) => {
    if (err) {
      console.error("Update User Status Error:", err);

      return res.status(500).json({
        message: "Failed to update user status",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: `Employee ${status.toLowerCase()} successfully`,
      status,
    });
  });
};

// ==========================================
// RESET USER PASSWORD
// Only Admin can reset employee password
// ==========================================

const resetUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    // Password required
    if (!password) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    // Minimum password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Prevent admin from resetting own password here
    if (Number(userId) === Number(req.user.id)) {
      return res.status(400).json({
        message: "You cannot reset your own password from Manage Users",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      UPDATE users
      SET password = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [hashedPassword, userId],
      (err, result) => {
        if (err) {
          console.error("Reset Password Error:", err);

          return res.status(500).json({
            message: "Failed to reset password",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        return res.status(200).json({
          message: "Employee password reset successfully",
        });
      }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// EDIT USER
// Only Admin can edit employee details
// ==========================================

const updateUser = (req, res) => {
  const userId = req.params.id;

  const {
    name,
    email,
    username,
    phone,
  } = req.body;

  // Required fields
  if (!name || !email || !username) {
    return res.status(400).json({
      message: "Name, email and username are required",
    });
  }

  // Prevent editing Admin from Manage Users
  if (Number(userId) === Number(req.user.id)) {
    return res.status(400).json({
      message: "You cannot edit your own Admin account here",
    });
  }

  // Check whether another user already has
  // the same username or email
  const checkSql = `
    SELECT id
    FROM users
    WHERE (username = ? OR email = ?)
    AND id != ?
  `;

  db.query(
    checkSql,
    [username, email, userId],
    (err, results) => {

      if (err) {
        console.error("Check Edit User Error:", err);

        return res.status(500).json({
          message: "Server error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "Username or email already exists",
        });
      }

      const updateSql = `
        UPDATE users
        SET
          name = ?,
          email = ?,
          username = ?,
          phone = ?
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [
          name,
          email,
          username,
          phone || null,
          userId,
        ],
        (err, result) => {

          if (err) {
            console.error("Update User Error:", err);

            return res.status(500).json({
              message: "Failed to update employee",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "User not found",
            });
          }

          return res.status(200).json({
            message: "Employee updated successfully",
          });
        }
      );
    }
  );
};

// ==========================================
// GET USER ASSIGNMENT SUMMARY
// Before deleting an employee, Admin can see
// how many Leads / Customers are assigned
// ==========================================

const getUserAssignmentSummary = (req, res) => {

  const userId = req.params.id;

  // Admin cannot be handled through employee delete flow
  if (Number(userId) === Number(req.user.id)) {
    return res.status(400).json({
      message: "Admin account cannot be deleted from Manage Users",
    });
  }

  // First check employee exists
  const userSql = `
    SELECT id, name, username, role
    FROM users
    WHERE id = ?
  `;

  db.query(userSql, [userId], (err, users) => {

    if (err) {
      console.error("Delete Summary User Check Error:", err);

      return res.status(500).json({
        message: "Failed to check employee",
      });
    }

    if (users.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const employee = users[0];

    // Extra protection
    if (employee.role?.toLowerCase() === "admin") {
      return res.status(400).json({
        message: "Admin account cannot be deleted",
      });
    }

    // Count assigned Leads and Customers
    const countSql = `
      SELECT
        SUM(
          CASE
            WHEN customer_type = 'Lead' THEN 1
            ELSE 0
          END
        ) AS leads,

        SUM(
          CASE
            WHEN customer_type = 'Customer' THEN 1
            ELSE 0
          END
        ) AS customers,

        COUNT(*) AS total

      FROM customers
      WHERE assigned_to = ?
    `;

    db.query(countSql, [userId], (err, results) => {

      if (err) {
        console.error("Assignment Summary Error:", err);

        return res.status(500).json({
          message: "Failed to fetch assigned records",
        });
      }

      const summary = results[0];

      return res.status(200).json({

        employee: {
          id: employee.id,
          name: employee.name,
          username: employee.username,
        },

        assignments: {
          leads: Number(summary.leads || 0),
          customers: Number(summary.customers || 0),
          total: Number(summary.total || 0),
        },

      });

    });

  });

};

// ==========================================
// REASSIGN DATA AND DELETE USER
// Transfers all assigned Leads / Customers
// to another employee before deletion
// ==========================================

const reassignAndDeleteUser = (req, res) => {

  const userId = Number(req.params.id);
  const { reassignTo } = req.body;

  const targetUserId = Number(reassignTo);

  // Target employee required
  if (!targetUserId) {
    return res.status(400).json({
      message: "Please select an employee to reassign records to",
    });
  }

  // Cannot transfer records to same employee
  if (userId === targetUserId) {
    return res.status(400).json({
      message: "Cannot reassign records to the same employee",
    });
  }

  // Admin cannot delete own account
  if (userId === Number(req.user.id)) {
    return res.status(400).json({
      message: "You cannot delete your own Admin account",
    });
  }

  // Check employee being deleted
  const checkUserSql = `
    SELECT id, name, role
    FROM users
    WHERE id = ?
  `;

  db.query(checkUserSql, [userId], (err, users) => {

    if (err) {
      console.error("Delete User Check Error:", err);

      return res.status(500).json({
        message: "Failed to check employee",
      });
    }

    if (users.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const employeeToDelete = users[0];

    // Do not allow Admin deletion
    if (employeeToDelete.role?.toLowerCase() === "admin") {
      return res.status(400).json({
        message: "Admin account cannot be deleted",
      });
    }

    // Check target employee
    const checkTargetSql = `
      SELECT id, name, role, status
      FROM users
      WHERE id = ?
    `;

    db.query(
      checkTargetSql,
      [targetUserId],
      (err, targets) => {

        if (err) {
          console.error("Target Employee Check Error:", err);

          return res.status(500).json({
            message: "Failed to check target employee",
          });
        }

        if (targets.length === 0) {
          return res.status(404).json({
            message: "Selected employee not found",
          });
        }

        const targetEmployee = targets[0];

        // Target should be a normal employee
        if (targetEmployee.role?.toLowerCase() === "admin") {
          return res.status(400).json({
            message: "Records must be reassigned to an employee",
          });
        }

        // Don't transfer new work to disabled employee
        if (
          targetEmployee.status?.toLowerCase() !== "active"
        ) {
          return res.status(400).json({
            message: "Records can only be reassigned to an active employee",
          });
        }


        // =====================================
        // START DATABASE TRANSACTION
        // =====================================

        db.beginTransaction((err) => {

          if (err) {
            console.error("Transaction Start Error:", err);

            return res.status(500).json({
              message: "Failed to start deletion process",
            });
          }


          // Transfer all Leads + Customers
          const transferSql = `
            UPDATE customers
            SET assigned_to = ?
            WHERE assigned_to = ?
          `;

          db.query(
            transferSql,
            [targetUserId, userId],
            (err, transferResult) => {

              if (err) {

                return db.rollback(() => {

                  console.error(
                    "Reassign Records Error:",
                    err
                  );

                  return res.status(500).json({
                    message:
                      "Failed to reassign employee records",
                  });

                });
              }


              // Delete old employee
              const deleteSql = `
                DELETE FROM users
                WHERE id = ?
              `;

              db.query(
                deleteSql,
                [userId],
                (err, deleteResult) => {

                  if (err) {

                    return db.rollback(() => {

                      console.error(
                        "Delete Employee Error:",
                        err
                      );

                      return res.status(500).json({
                        message:
                          "Failed to delete employee",
                      });

                    });
                  }


                  if (deleteResult.affectedRows === 0) {

                    return db.rollback(() => {

                      return res.status(404).json({
                        message: "Employee not found",
                      });

                    });
                  }


                  // Everything successful
                  db.commit((err) => {

                    if (err) {

                      return db.rollback(() => {

                        console.error(
                          "Transaction Commit Error:",
                          err
                        );

                        return res.status(500).json({
                          message:
                            "Failed to complete deletion",
                        });

                      });
                    }


                    return res.status(200).json({

                      message:
                        "Employee deleted and records reassigned successfully",

                      deletedEmployee: {
                        id: employeeToDelete.id,
                        name: employeeToDelete.name,
                      },

                      reassignedTo: {
                        id: targetEmployee.id,
                        name: targetEmployee.name,
                      },

                      transferredRecords:
                        transferResult.affectedRows,

                    });

                  });

                }
              );

            }
          );

        });

      }
    );

  });

};

module.exports = {
  getUsers,
  addUser,
  updateUserStatus,
  resetUserPassword,
  updateUser,
  getUserAssignmentSummary,
  reassignAndDeleteUser,
};
const db = require("../config/db");

// GET ALL CUSTOMERS / LEADS
const getCustomers = (req, res) => {

    const { type, assignedTo } = req.query;

    const loggedInUser = req.user;

    /*
    ============================================
    BASE QUERY

    LEFT JOIN isliye:
    assigned_to ke through employee ka naam bhi
    response mein milega.
    ============================================
    */

    let sql = `
        SELECT 
            customers.*,
            users.name AS assigned_user_name
        FROM customers
        LEFT JOIN users
            ON customers.assigned_to = users.id
        WHERE 1 = 1
    `;

    const values = [];


    // ==========================================
    // LEAD / CUSTOMER FILTER
    // ==========================================

    if (type) {
        sql += " AND customers.customer_type = ?";
        values.push(type);
    }


    // ==========================================
    // NORMAL USER
    // Sirf apna assigned data dekh sakta hai
    // ==========================================

    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += " AND customers.assigned_to = ?";
        values.push(loggedInUser.id);

    }


    // ==========================================
    // ADMIN
    // All data ya selected employee ka data
    // ==========================================

    else if (
        loggedInUser.role?.toLowerCase() === "admin" &&
        assignedTo
    ) {

        sql += " AND customers.assigned_to = ?";
        values.push(assignedTo);

    }


    // ==========================================
    // LATEST FIRST
    // ==========================================

    sql += " ORDER BY customers.id DESC";


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("Fetch customers error:", err);

            return res.status(500).json({
                message: "Failed to fetch customers"
            });

        }

        res.status(200).json(result);

    });

};

// ADD CUSTOMER
const addCustomer = (req, res) => {

    const {
        name,
        phone,
        email,
        location,
        pincode,
        required_watts,
        house_size,
        notes,
        customer_type
    } = req.body;


    // ==========================================
    // AUTOMATIC LEAD OWNERSHIP
    // ==========================================

    let assignedTo = null;

    // Agar normal User lead create kar raha hai,
    // lead automatically usi employee ko assign hogi
    if (req.user.role?.toLowerCase() === "user") {
        assignedTo = req.user.id;
    }

    // Agar Admin lead create karta hai,
    // initially lead Unassigned rahegi
    // assignedTo = null


    const sql = `
        INSERT INTO customers
        (
            name,
            phone,
            email,
            location,
            pincode,
            required_watts,
            house_size,
            notes,
            customer_type,
            assigned_to
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            name,
            phone,
            email,
            location,
            pincode,
            required_watts,
            house_size,
            notes,
            customer_type || "Lead",
            assignedTo
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Failed to save customer"
                });

            }

            res.status(201).json({
                message: "Customer saved successfully",
                customerId: result.insertId
            });

        }
    );
};

// ==========================================
// UPDATE CUSTOMER - OWNERSHIP SECURED
// ==========================================

const updateCustomer = (req, res) => {

    const id = req.params.id;
    const loggedInUser = req.user;

    const {
        name,
        phone,
        email,
        location,
        pincode,
        required_watts,
        house_size,
        notes,
        status
    } = req.body;


    let sql = `
        UPDATE customers
        SET
            name = ?,
            phone = ?,
            email = ?,
            location = ?,
            pincode = ?,
            required_watts = ?,
            house_size = ?,
            notes = ?,
            status = ?
        WHERE id = ?
    `;


    const values = [
        name,
        phone,
        email,
        location,
        pincode,
        required_watts,
        house_size,
        notes,
        status,
        id
    ];


    // Normal User can update only their own record
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("Update customer error:", err);

            return res.status(500).json({
                message: "Failed to update customer"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Customer not found or you do not have permission"
            });
        }


        res.status(200).json({
            message: "Customer updated successfully"
        });

    });

};



// ==========================================
// DELETE CUSTOMER - OWNERSHIP SECURED
// ==========================================

const deleteCustomer = (req, res) => {

    const id = req.params.id;
    const loggedInUser = req.user;


    let sql = `
        DELETE FROM customers
        WHERE id = ?
    `;


    const values = [id];


    // Normal User can delete only their own record
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("Delete customer error:", err);

            return res.status(500).json({
                message: "Failed to delete customer"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Customer not found or you do not have permission"
            });
        }


        res.status(200).json({
            message: "Customer deleted successfully"
        });

    });

};
// CONVERT LEAD TO CUSTOMER
const convertToCustomer = (req, res) => {

    const id = req.params.id;
    const loggedInUser = req.user;

    let sql = `
        UPDATE customers
        SET customer_type = 'Customer'
        WHERE id = ?
        AND customer_type = 'Lead'
    `;

    const values = [id];


    // ==========================================
    // NORMAL USER
    // Sirf apni lead convert kar sakta hai
    // ==========================================

    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    // ==========================================
    // ADMIN
    // Admin kisi bhi lead ko convert kar sakta hai
    // ==========================================


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("Convert lead error:", err);

            return res.status(500).json({
                message: "Failed to convert lead"
            });
        }


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Lead not found or you do not have permission"
            });
        }


        res.status(200).json({
            message: "Lead converted to customer successfully"
        });

    });

};

// ==========================================
// GET CUSTOMER BY ID - OWNERSHIP SECURED
// ==========================================

const getCustomerById = (req, res) => {

    const { id } = req.params;

    const loggedInUser = req.user;

    let sql = `
        SELECT 
            customers.*,
            users.name AS assigned_user_name
        FROM customers
        LEFT JOIN users
            ON customers.assigned_to = users.id
        WHERE customers.id = ?
    `;

    const values = [id];


    // ==========================================
    // NORMAL USER
    // Sirf apna customer/lead dekh sakta hai
    // ==========================================

    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += `
            AND customers.assigned_to = ?
        `;

        values.push(loggedInUser.id);
    }


    // ==========================================
    // ADMIN
    // Kisi bhi customer/lead ko dekh sakta hai
    // ==========================================


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(
                "Get customer by ID error:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch customer",
            });

        }


        if (result.length === 0) {

            return res.status(404).json({
                message:
                    "Customer not found or you do not have permission",
            });

        }


        res.status(200).json(result[0]);

    });

};

// ==========================================
// UPLOAD DOCUMENT - OWNERSHIP SECURED
// ==========================================

const uploadDocument = (req, res) => {

    const { id } = req.params;
    const documentType = req.params.documentType;

    const loggedInUser = req.user;


    // ==========================================
    // FILE CHECK
    // ==========================================

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded",
        });
    }


    // ==========================================
    // DOCUMENT TYPE → DATABASE COLUMN
    // ==========================================

    const allowedColumns = {
        aadhaar: "aadhaar_path",
        pan: "pan_path",
        registry: "registry_path",
        quotation: "quotation_path",
        roof: "roof_image_path",
    };


    const column = allowedColumns[documentType];


    if (!column) {
        return res.status(400).json({
            message: "Invalid document type",
        });
    }


    // ==========================================
    // FILE PATH
    // ==========================================

    const filePath =
        `uploads/${documentType}/${req.file.filename}`;


    // ==========================================
    // UPDATE QUERY
    // ==========================================

    let sql = `
        UPDATE customers
        SET ${column} = ?
        WHERE id = ?
    `;


    const values = [
        filePath,
        id
    ];


    // ==========================================
    // NORMAL USER
    // Sirf apne customer par upload kar sakta hai
    // ==========================================

    if (
        loggedInUser.role?.toLowerCase() === "user"
    ) {

        sql += ` AND assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    // ==========================================
    // ADMIN
    // Kisi bhi customer par upload kar sakta hai
    // ==========================================


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.log(
                    "Upload document error:",
                    err
                );

                return res.status(500).json({
                    message: "Upload failed",
                });

            }


            // Customer doesn't exist
            // OR user doesn't own this customer
            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Customer not found or you do not have permission",
                });

            }


            res.status(200).json({
                message:
                    "Document uploaded successfully",

                filePath,
            });

        }
    );

};
const getRecentLeads = (req, res) => {

    const sql = `
    SELECT *
    FROM customers
    WHERE customer_type = 'Lead'
    ORDER BY id DESC
    LIMIT 5
  `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

// ================= ASSIGN LEAD TO USER =================

const assignCustomer = (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({
            message: "User ID is required",
        });
    }

    // First check whether employee exists and is active
    const checkUserSql = `
    SELECT id, name, username, role, status
    FROM users
    WHERE id = ?
  `;

    db.query(checkUserSql, [userId], (err, users) => {
        if (err) {
            console.error("Check user error:", err);

            return res.status(500).json({
                message: "Server error",
            });
        }

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const user = users[0];

        if (user.status?.toLowerCase() !== "active") {
            return res.status(400).json({
                message: "Cannot assign lead to an inactive user",
            });
        }

        // Assign customer/lead to employee
        const assignSql = `
      UPDATE customers
      SET assigned_to = ?
      WHERE id = ?
    `;

        db.query(assignSql, [userId, id], (err, result) => {
            if (err) {
                console.error("Assign customer error:", err);

                return res.status(500).json({
                    message: "Failed to assign lead",
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Lead not found",
                });
            }

            return res.status(200).json({
                message: `Lead assigned to ${user.name || user.username
                    } successfully`,
                assignedTo: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                },
            });
        });
    });
};

module.exports = {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    convertToCustomer,
    getCustomerById,
    uploadDocument,
    getRecentLeads,
    assignCustomer
};
const db = require("../config/db");

// GET ALL CUSTOMERS
const getCustomers = (req, res) => {

    const { type } = req.query;

    let sql = "SELECT * FROM customers";
    let values = [];

    if (type) {
        sql += " WHERE customer_type = ?";
        values.push(type);
    }

    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

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
        notes
    } = req.body;

    const sql = `
    INSERT INTO customers
    (name, phone, email, location, pincode, required_watts, house_size, notes, customer_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
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
            "Lead"
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

// UPDATE CUSTOMER
const updateCustomer = (req, res) => {

    const id = req.params.id;

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

    const sql = `
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

    db.query(
        sql,
        [
            [
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
            ]
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Failed to update customer"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Customer not found"
                });

            }

            res.status(200).json({
                message: "Customer updated successfully"
            });

        }
    );
};

// DELETE CUSTOMER
const deleteCustomer = (req, res) => {

    const id = req.params.id;

    const sql = `
    DELETE FROM customers
    WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Failed to delete customer"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Customer not found"
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

    const sql = `
    UPDATE customers
    SET customer_type = 'Customer'
    WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Failed to convert lead"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Lead not found"
            });

        }

        res.status(200).json({
            message: "Lead converted to customer successfully"
        });

    });

};

const getCustomerById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM customers WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch customer",
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        res.status(200).json(result[0]);
    });
};

const uploadDocument = (req, res) => {
    const { id } = req.params;
    const documentType = req.params.documentType;

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded",
        });
    }

    const filePath = `uploads/${documentType}/${req.file.filename}`;

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

    const sql = `
    UPDATE customers
    SET ${column} = ?
    WHERE id = ?
  `;

    db.query(sql, [filePath, id], (err, result) => {
        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Upload failed",
            });
        }

        res.status(200).json({
            message: "Document uploaded successfully",
            filePath,
        });
    });
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

module.exports = {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    convertToCustomer,
    getCustomerById,
    uploadDocument,
    getRecentLeads,
};
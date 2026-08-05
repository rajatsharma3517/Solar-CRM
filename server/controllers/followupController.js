const db = require("../config/db");


// =====================================================
// ADD FOLLOW-UP - OWNERSHIP SECURED
// =====================================================

const addFollowUp = (req, res) => {

    const {
        customer_id,
        followup_date,
        followup_time,
        notes,
    } = req.body;

    const loggedInUser = req.user;


    // First verify that this user can access this customer
    let checkSql = `
        SELECT id
        FROM customers
        WHERE id = ?
    `;

    const checkValues = [customer_id];


    // Normal user can add follow-up only to own customer/lead
    if (loggedInUser.role?.toLowerCase() === "user") {

        checkSql += ` AND assigned_to = ?`;

        checkValues.push(loggedInUser.id);
    }


    db.query(
        checkSql,
        checkValues,
        (checkErr, customerResult) => {

            if (checkErr) {

                console.log("FOLLOW-UP CUSTOMER CHECK ERROR:", checkErr);

                return res.status(500).json({
                    message: "Failed to verify customer",
                });
            }


            if (customerResult.length === 0) {

                return res.status(404).json({
                    message:
                        "Customer not found or you do not have permission",
                });
            }


            // Existing insert functionality
            const sql = `
                INSERT INTO follow_ups
                (customer_id, followup_date, followup_time, notes)
                VALUES (?, ?, ?, ?)
            `;


            db.query(
                sql,
                [
                    customer_id,
                    followup_date,
                    followup_time,
                    notes,
                ],
                (err, result) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            message: "Failed to add follow-up",
                        });
                    }


                    res.status(201).json({
                        message: "Follow-up added successfully",
                    });

                }
            );

        }
    );

};



// =====================================================
// GET FOLLOW-UPS OF CUSTOMER - OWNERSHIP SECURED
// =====================================================

const getFollowUpsByCustomer = (req, res) => {

    const customerId = req.params.id;

    const loggedInUser = req.user;


    let sql = `
        SELECT follow_ups.*
        FROM follow_ups

        JOIN customers
            ON follow_ups.customer_id = customers.id

        WHERE follow_ups.customer_id = ?
    `;


    const values = [customerId];


    // Normal user can see only own customer's follow-ups
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND customers.assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    sql += `
        ORDER BY
            follow_ups.followup_date ASC,
            follow_ups.followup_time ASC
    `;


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch follow-ups",
            });

        }


        res.status(200).json(result);

    });

};



// =====================================================
// UPDATE FOLLOW-UP - OWNERSHIP SECURED
// =====================================================

const updateFollowUp = (req, res) => {

    const id = req.params.id;

    const loggedInUser = req.user;

    const {
        followup_date,
        followup_time,
        status,
        notes,
    } = req.body;


    let sql = `
        UPDATE follow_ups
        SET
            followup_date = ?,
            followup_time = ?,
            status = ?,
            notes = ?
        WHERE id = ?
    `;


    const values = [
        followup_date,
        followup_time,
        status,
        notes,
        id,
    ];


    // Normal user can update follow-up only if
    // its customer belongs to that user
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += `
            AND customer_id IN (
                SELECT id
                FROM customers
                WHERE assigned_to = ?
            )
        `;

        values.push(loggedInUser.id);
    }


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.log("UPDATE ERROR:", err);

                return res.status(500).json({
                    message: err.message,
                    error: err,
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Follow-up not found or you do not have permission",
                });

            }


            res.status(200).json({
                message: "Follow-up updated",
            });

        }
    );

};



// =====================================================
// DELETE FOLLOW-UP - OWNERSHIP SECURED
// =====================================================

const deleteFollowUp = (req, res) => {

    const id = req.params.id;

    const loggedInUser = req.user;


    let sql = `
        DELETE FROM follow_ups
        WHERE id = ?
    `;


    const values = [id];


    // Normal user can delete only own customer's follow-up
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += `
            AND customer_id IN (
                SELECT id
                FROM customers
                WHERE assigned_to = ?
            )
        `;

        values.push(loggedInUser.id);
    }


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Delete failed",
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Follow-up not found or you do not have permission",
                });

            }


            res.status(200).json({
                message: "Follow-up deleted",
            });

        }
    );

};



// =====================================================
// GET ALL FOLLOW-UPS - OWNERSHIP SECURED
// =====================================================

const getAllFollowUps = (req, res) => {

    const loggedInUser = req.user;


    let sql = `
        SELECT
            f.*,
            c.name,
            c.phone,
            c.email
        FROM follow_ups f

        JOIN customers c
            ON f.customer_id = c.id

        WHERE 1 = 1
    `;


    const values = [];


    // Normal user sees only own customers' follow-ups
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND c.assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    sql += `
        ORDER BY
            f.followup_date ASC,
            f.followup_time ASC
    `;


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }


        res.json(result);

    });

};



// =====================================================
// GET OVERDUE FOLLOW-UPS - OWNERSHIP SECURED
// =====================================================

const getOverdueFollowUps = (req, res) => {

    const loggedInUser = req.user;


    let sql = `
        SELECT
            follow_ups.*,
            customers.name,
            customers.phone

        FROM follow_ups

        JOIN customers
            ON follow_ups.customer_id = customers.id

        WHERE
            follow_ups.status != 'Completed'

            AND (
                followup_date < CURDATE()

                OR (
                    followup_date = CURDATE()
                    AND followup_time < CURTIME()
                )
            )
    `;


    const values = [];


    // Normal user sees only own overdue follow-ups
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND customers.assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    sql += `
        ORDER BY
            followup_date ASC,
            followup_time ASC
    `;


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }


        res.json(result);

    });

};



// =====================================================
// GET TODAY FOLLOW-UPS - OWNERSHIP SECURED
// =====================================================

const getTodayFollowups = (req, res) => {

    const loggedInUser = req.user;


    let sql = `
        SELECT
            follow_ups.*,
            customers.name,
            customers.phone

        FROM follow_ups

        JOIN customers
            ON follow_ups.customer_id = customers.id

        WHERE
            followup_date = CURDATE()

            AND follow_ups.status != 'Completed'
    `;


    const values = [];


    // Normal user sees only own today's follow-ups
    if (loggedInUser.role?.toLowerCase() === "user") {

        sql += ` AND customers.assigned_to = ?`;

        values.push(loggedInUser.id);
    }


    sql += `
        ORDER BY followup_time ASC
    `;


    db.query(sql, values, (err, result) => {

        if (err) {

            return res.status(500).json(err);

        }


        res.json(result);

    });

};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    getAllFollowUps,
    addFollowUp,
    getFollowUpsByCustomer,
    getOverdueFollowUps,
    updateFollowUp,
    deleteFollowUp,
    getTodayFollowups,
};
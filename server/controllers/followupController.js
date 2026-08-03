const db = require("../config/db");

// ADD FOLLOW-UP
const addFollowUp = (req, res) => {

    const {
        customer_id,
        followup_date,
        followup_time,
        notes,
    } = req.body;

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
};

// GET FOLLOW-UPS OF CUSTOMER
const getFollowUpsByCustomer = (req, res) => {

    const customerId = req.params.id;

    const sql = `
        SELECT *
        FROM follow_ups
        WHERE customer_id = ?
        ORDER BY followup_date ASC, followup_time ASC
    `;

    db.query(sql, [customerId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Failed to fetch follow-ups",
            });

        }

        res.status(200).json(result);

    });

};

// UPDATE FOLLOW-UP
const updateFollowUp = (req, res) => {

    const id = req.params.id;

    const {
        followup_date,
        followup_time,
        status,
        notes,
    } = req.body;

    const sql = `
        UPDATE follow_ups
        SET
            followup_date=?,
            followup_time=?,
            status=?,
            notes=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            followup_date,
            followup_time,
            status,
            notes,
            id,
        ],
        (err) => {

            if (err) {

                console.log("UPDATE ERROR:", err);

                return res.status(500).json({
                    message: err.message,
                    error: err,
                });

            }

            res.status(200).json({
                message: "Follow-up updated",
            });

        }
    );

};

// DELETE FOLLOW-UP
const deleteFollowUp = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM follow_ups WHERE id=?",
        [id],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: "Delete failed",
                });

            }

            res.status(200).json({
                message: "Follow-up deleted",
            });

        }
    );

};

const getAllFollowUps = (req, res) => {
    const sql = `
    SELECT
      f.*,
      c.name,
      c.phone,
      c.email
    FROM follow_ups f
    JOIN customers c
      ON f.customer_id = c.id
    ORDER BY
      f.followup_date ASC,
      f.followup_time ASC
  `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

const getOverdueFollowUps = (req, res) => {

    const sql = `
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
        ORDER BY followup_date ASC, followup_time ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

const getTodayFollowups = (req, res) => {

    const sql = `
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

        ORDER BY followup_time ASC
    `;

    db.query(sql, (err, result) => {

        if (err)
            return res.status(500).json(err);

        res.json(result);

    });

};



module.exports = {
    getAllFollowUps,
    addFollowUp,
    getFollowUpsByCustomer,
    getOverdueFollowUps,
    updateFollowUp,
    deleteFollowUp,
    getTodayFollowups,
};
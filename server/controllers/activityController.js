const db = require("../config/db");

const getRecentActivities = (req, res) => {

  const sql = `
    SELECT
      a.id,
      a.activity,
      a.created_at,
      c.name
    FROM activities a
    LEFT JOIN customers c
      ON a.customer_id = c.id
    ORDER BY a.created_at DESC
    LIMIT 10
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
  getRecentActivities,
};
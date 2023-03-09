const { db } = require("../database");
const bcrypt = require("bcrypt");

module.exports = {
  getData: (req, res) => {
    let { email } = req.query;
    let scriptQuery = `SELECT * from user where uid = ${db.escape(uid)}`;
    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  addData: (req, res) => {
    let { first_name, last_name, email, role, is_verified } = req.body;
    let insertQuery = `INSERT INTO user VALUES (null, ${db.escape(
      first_name
    )}, ${db.escape(last_name)}, ${db.escape(email)}, null, null, ${db.escape(
      role
    )}, null, null, ${db.escape(is_verified)})`;
    console.log(insertQuery);
    db.query(insertQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  inputPassword: async (req, res) => {
    let { password } = req.body;
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let updateQuery = `UPDATE user SET password = ${db.escape(
      hashedPassword
    )}, is_verified=1 WHERE id = ${req.params.id}`;
    db.query(updateQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};

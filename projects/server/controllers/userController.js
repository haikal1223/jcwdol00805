const { db } = require("../database");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getData: (req, res) => {
    let { uid } = req.query;
    let scriptQuery = `SELECT * from user where uid = ${db.escape(uid)}`;
    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  addData: (req, res) => {
    let { first_name, last_name, email, role } = req.body;
    let insertQuery = `INSERT INTO user VALUES (null, ${db.escape(
      first_name
    )}, ${db.escape(last_name)}, ${db.escape(email)}, null, null, ${db.escape(
      role
    )}, null, null, 0, ${db.escape(uuidv4())})`;
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
    )}, is_verified=1 WHERE uid = ${db.escape(req.params.uid)}`;
    db.query(updateQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};

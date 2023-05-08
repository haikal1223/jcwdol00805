const mysql = require("mysql2");

// create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",

  password: "ot3ra1han12",

  database: "db_test1",


  port: 8000,
});

db.connect((err) => {
  if (err) return console.log("Error " + err.message);
  else console.log("MySQL Connected");
});

module.exports = db;

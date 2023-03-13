const mysql2 = require("mysql2");

// db connection
const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "db_warehouse",
  port: 3306,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    return console.error(`error: ${err.message}`);
  }
  console.log(`Connected to MySQL Server`);
});

module.exports = { db };

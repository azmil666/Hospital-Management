const mysql = require("mysql2");

const db = mysql.createConnection({
  socketPath: "/tmp/mysql.sock",
  user: "root",
  password: "Password",
  database: "hospital_db"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;
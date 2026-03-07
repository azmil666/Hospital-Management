const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hospital Management API Running");
});

app.get("/doctors", (req, res) => {
  db.query("SELECT * FROM doctor", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
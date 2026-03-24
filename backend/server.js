const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- ROOT ---------------- */

app.get("/", (req, res) => {
  res.send("Hospital Management API Running");
});

/* ---------------- DOCTORS ---------------- */

app.get("/doctors", (req, res) => {

  const query = `
  SELECT d.doctor_id, d.doctor_name, d.specialization, d.department_id, dep.department_name
  FROM doctor d
  LEFT JOIN department dep
  ON d.department_id = dep.department_id
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);

  });

});

app.post("/doctors", (req, res) => {

  const { doctor_name, specialization, department_id } = req.body;

  const query = `
  INSERT INTO doctor (doctor_name, specialization, department_id)
  VALUES (?, ?, ?)
  `;

  db.query(query, [doctor_name, specialization, department_id], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Doctor insert failed" });
    }

    res.json({ message: "Doctor added", id: results.insertId });

  });

});

/* ---------------- PATIENTS ---------------- */

app.get("/patients", (req, res) => {

  db.query("SELECT * FROM patient", (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);

  });

});

app.post("/patients", (req, res) => {

  const { patient_name, age, gender, phone } = req.body;

  if (!patient_name || !age || !gender || !phone) {
    return res.status(400).json({ error: "All fields required" });
  }

  const query = `
  INSERT INTO patient (patient_name, age, gender, phone)
  VALUES (?, ?, ?, ?)
  `;

  db.query(query, [patient_name, age, gender, phone], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.json({ message: "Patient added", id: results.insertId });

  });

});

/* ---------------- APPOINTMENTS ---------------- */

app.get("/appointments", (req, res) => {

  const query = `
  SELECT 
    a.appointment_id,
    p.patient_name,
    d.doctor_name,
    a.appointment_date,
    a.status
  FROM appointment a
  JOIN patient p ON a.patient_id = p.patient_id
  JOIN doctor d ON a.doctor_id = d.doctor_id
  ORDER BY a.appointment_date DESC
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);

  });

});

app.post("/appointments", (req, res) => {

  const { patient_id, doctor_id, appointment_date } = req.body;

  const query = `
  INSERT INTO appointment (patient_id, doctor_id, appointment_date)
  VALUES (?, ?, ?)
  `;

  db.query(query, [patient_id, doctor_id, appointment_date], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.json({ message: "Appointment added", id: results.insertId });

  });

});

/* ---------------- BILLS ---------------- */

app.get("/bills", (req, res) => {

  const query = `
  SELECT 
    b.bill_id,
    p.patient_name,
    b.amount,
    b.bill_date
  FROM bill b
  JOIN patient p ON b.patient_id = p.patient_id
  ORDER BY b.bill_date DESC
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }

    res.json(results);

  });

});

app.post("/bills", (req, res) => {

const { appointment_id, amount, bill_date } = req.body;

const query = `
INSERT INTO bill (appointment_id, patient_id, amount, bill_date)
SELECT ?, patient_id, ?, ?
FROM appointment
WHERE appointment_id = ?
`;

db.query(query, [appointment_id, amount, bill_date, appointment_id], (err, results) => {

if (err) {
console.error(err);
return res.status(500).json({ error: "Bill creation failed" });
}

res.json({ message: "Bill created", id: results.insertId });

});

});

/* ---------------- DASHBOARD ---------------- */

app.get("/dashboard", (req, res) => {

  const dashboardQuery = `
  SELECT
    (SELECT COUNT(*) FROM doctor) AS doctors,
    (SELECT COUNT(*) FROM patient) AS patients,
    (SELECT COUNT(*) FROM appointment) AS appointments,
    (SELECT IFNULL(SUM(amount),0) FROM bill) AS revenue
  `;

  db.query(dashboardQuery, (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Dashboard query failed" });
    }

    res.json(results[0]);

  });

});

app.get("/departments", (req, res) => {

db.query("SELECT * FROM department", (err, results) => {

if (err) {
return res.status(500).json({ error: "Database query failed" });
}

res.json(results);

});

});
app.post("/departments", (req, res) => {

const { department_name } = req.body;

db.query(
"INSERT INTO department (department_name) VALUES (?)",
[department_name],
(err, results) => {

if (err) {
return res.status(500).json({ error: "Insert failed" });
}

res.json({
message: "Department created",
id: results.insertId
});

});

});


app.get("/analytics/appointments", (req, res) => {

const query = `
SELECT appointment_date, COUNT(*) as total
FROM appointment
GROUP BY appointment_date
ORDER BY appointment_date
`;

db.query(query, (err, results) => {

if (err) return res.status(500).json(err);

res.json(results);

});

});

app.get("/analytics/revenue", (req, res) => {

const query = `
SELECT bill_date, SUM(amount) as total
FROM bill
GROUP BY bill_date
ORDER BY bill_date
`;

db.query(query, (err, results) => {

if (err) return res.status(500).json(err);

res.json(results);

});

});

/* ---------------- SERVER ---------------- */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
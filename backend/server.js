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
  SELECT d.doctor_id, d.doctor_name, d.specialization, d.contact, d.status,
         dep.department_name, d.department_id
  FROM doctor d
  LEFT JOIN department dep ON d.department_id = dep.department_id
  `;

  db.query(query, (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Database query failed" }); }
    res.json(results);
  });

});

app.post("/doctors", (req, res) => {

  const { doctor_name, specialization, department_id, contact, status } = req.body;

  db.query(
    "INSERT INTO doctor (doctor_name, specialization, department_id, contact, status) VALUES (?, ?, ?, ?, ?)",
    [doctor_name, specialization, department_id, contact, status || 'active'],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Doctor insert failed" }); }
      res.json({ message: "Doctor added", id: results.insertId });
    }
  );

});

app.put("/doctors/:id", (req, res) => {

  const { id } = req.params;
  const { doctor_name, specialization, department_id, contact, status } = req.body;

  db.query(
    "UPDATE doctor SET doctor_name=?, specialization=?, department_id=?, contact=?, status=? WHERE doctor_id=?",
    [doctor_name, specialization, department_id, contact, status, id],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Doctor update failed" }); }
      if (results.affectedRows === 0) return res.status(404).json({ error: "Doctor not found" });
      res.json({ message: "Doctor updated" });
    }
  );

});

/* ---------------- PATIENTS ---------------- */

app.get("/patients", (req, res) => {

  db.query("SELECT * FROM patient", (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Database query failed" }); }
    res.json(results);
  });

});

app.post("/patients", (req, res) => {

  const { patient_name, age, gender, phone } = req.body;

  if (!patient_name || !age || !gender || !phone) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query(
    "INSERT INTO patient (patient_name, age, gender, phone) VALUES (?, ?, ?, ?)",
    [patient_name, age, gender, phone],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Database insert failed" }); }
      res.json({ message: "Patient added", id: results.insertId });
    }
  );

});

/* ---------------- APPOINTMENTS ---------------- */

app.get("/appointments", (req, res) => {

  const query = `
  SELECT 
    a.appointment_id,
    p.patient_name,
    d.doctor_name,
    d.department_id,
    dep.department_name,
    a.appointment_date,
    a.status
  FROM appointment a
  JOIN patient p ON a.patient_id = p.patient_id
  JOIN doctor d ON a.doctor_id = d.doctor_id
  LEFT JOIN department dep ON d.department_id = dep.department_id
  ORDER BY a.appointment_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Database query failed" }); }
    res.json(results);
  });

});

app.post("/appointments", (req, res) => {

  const { patient_id, doctor_id, appointment_date } = req.body;

  db.query(
    "INSERT INTO appointment (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
    [patient_id, doctor_id, appointment_date],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Database insert failed" }); }
      res.json({ message: "Appointment added", id: results.insertId });
    }
  );

});
app.put("/appointments/:id", (req, res) => {

  const { id } = req.params;
  const { patient_id, doctor_id, appointment_date, status } = req.body;

  db.query(
    "UPDATE appointment SET patient_id=?, doctor_id=?, appointment_date=?, status=? WHERE appointment_id=?",
    [patient_id, doctor_id, appointment_date, status, id],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Appointment update failed" }); }
      if (results.affectedRows === 0) return res.status(404).json({ error: "Appointment not found" });
      res.json({ message: "Appointment updated" });
    }
  );

});

/* ---------------- BILLS ---------------- */

app.get("/bills", (req, res) => {

  const query = `
  SELECT b.bill_id, p.patient_name, b.amount, b.bill_date
  FROM bill b
  JOIN patient p ON b.patient_id = p.patient_id
  ORDER BY b.bill_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Database query failed" }); }
    res.json(results);
  });

});

app.post("/bills", (req, res) => {

  const { appointment_id, amount, bill_date } = req.body;

  db.query(
    "INSERT INTO bill (appointment_id, patient_id, amount, bill_date) SELECT ?, patient_id, ?, ? FROM appointment WHERE appointment_id = ?",
    [appointment_id, amount, bill_date, appointment_id],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Bill creation failed" }); }
      res.json({ message: "Bill created", id: results.insertId });
    }
  );

});

/* ---------------- DASHBOARD ---------------- */

app.get("/dashboard", (req, res) => {

  const query = `
  SELECT
    (SELECT COUNT(*) FROM doctor) AS doctors,
    (SELECT COUNT(*) FROM patient) AS patients,
    (SELECT COUNT(*) FROM appointment) AS appointments,
    (SELECT IFNULL(SUM(amount),0) FROM bill) AS revenue
  `;

  db.query(query, (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Dashboard query failed" }); }
    res.json(results[0]);
  });

});

/* ---------------- DEPARTMENTS ---------------- */

app.get("/departments", (req, res) => {

  db.query("SELECT * FROM department", (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Database query failed" }); }
    res.json(results);
  });

});

app.post("/departments", (req, res) => {

  const { department_name, department_head } = req.body;

  if (!department_name) {
    return res.status(400).json({ error: "Department name is required" });
  }

  db.query(
    "INSERT INTO department (department_name, department_head) VALUES (?, ?)",
    [department_name, department_head || null],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Insert failed" }); }
      res.json({ message: "Department created", id: results.insertId });
    }
  );

});

app.put("/departments/:id", (req, res) => {

  const { id } = req.params;
  const { department_name, department_head } = req.body;

  if (!department_name) {
    return res.status(400).json({ error: "Department name is required" });
  }

  db.query(
    "UPDATE department SET department_name=?, department_head=? WHERE department_id=?",
    [department_name, department_head || null, id],
    (err, results) => {
      if (err) { console.error(err); return res.status(500).json({ error: "Update failed" }); }
      if (results.affectedRows === 0) return res.status(404).json({ error: "Department not found" });
      res.json({ message: "Department updated" });
    }
  );

});

/* ---------------- ANALYTICS ---------------- */

app.get("/analytics/appointments", (req, res) => {

  db.query(
    "SELECT appointment_date, COUNT(*) as total FROM appointment GROUP BY appointment_date ORDER BY appointment_date",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );

});

app.get("/analytics/revenue", (req, res) => {

  db.query(
    "SELECT bill_date, SUM(amount) as total FROM bill GROUP BY bill_date ORDER BY bill_date",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );

});


/* ---------------- DELETE ROUTES ---------------- */

app.delete("/doctors/:id", (req, res) => {
  db.query("DELETE FROM doctor WHERE doctor_id = ?", [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Delete failed" }); }
    if (results.affectedRows === 0) return res.status(404).json({ error: "Doctor not found" });
    res.json({ message: "Doctor deleted" });
  });
});

app.delete("/patients/:id", (req, res) => {
  db.query("DELETE FROM patient WHERE patient_id = ?", [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Delete failed" }); }
    if (results.affectedRows === 0) return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Patient deleted" });
  });
});

app.delete("/appointments/:id", (req, res) => {
  db.query("DELETE FROM appointment WHERE appointment_id = ?", [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Delete failed" }); }
    if (results.affectedRows === 0) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  });
});

app.delete("/departments/:id", (req, res) => {
  db.query("DELETE FROM department WHERE department_id = ?", [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Delete failed. Make sure no doctors are assigned to this department." }); }
    if (results.affectedRows === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department deleted" });
  });
});

app.delete("/bills/:id", (req, res) => {
  db.query("DELETE FROM bill WHERE bill_id = ?", [req.params.id], (err, results) => {
    if (err) { console.error(err); return res.status(500).json({ error: "Delete failed" }); }
    if (results.affectedRows === 0) return res.status(404).json({ error: "Bill not found" });
    res.json({ message: "Bill deleted" });
  });
});

/* ---------------- SERVER ---------------- */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
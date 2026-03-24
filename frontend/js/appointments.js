const API = "http://localhost:5000";

let allDoctors = [];

/* -------- HELPERS -------- */

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day   = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year  = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

function toInputDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day   = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year  = d.getUTCFullYear();
  return `${year}-${month}-${day}`;
}

function getStatusBadge(status) {
  const map = {
    approved:  '<span class="badge badge-success">Approved</span>',
    pending:   '<span class="badge badge-warning">Pending</span>',
    cancelled: '<span class="badge badge-error">Cancelled</span>',
  };
  return map[status?.toLowerCase()] || `<span class="badge">${status || "—"}</span>`;
}

/* -------- LOAD PATIENTS -------- */

async function loadPatients() {
  try {
    const res = await fetch(API + "/patients");
    const patients = await res.json();
    ["patientSelect", "editPatientSelect"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = `<option value="" disabled selected>Select Patient</option>`;
      patients.forEach(p => {
        el.innerHTML += `<option value="${p.patient_id}">${p.patient_name}</option>`;
      });
    });
  } catch (err) { console.error("loadPatients error:", err); }
}

/* -------- LOAD DEPARTMENTS -------- */

async function loadDepartments() {
  try {
    const res = await fetch(API + "/departments");
    const departments = await res.json();
    ["departmentSelect", "editDepartmentSelect"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = `<option value="" disabled selected>Select Department</option>`;
      departments.forEach(dep => {
        el.innerHTML += `<option value="${dep.department_id}">${dep.department_name}</option>`;
      });
    });
  } catch (err) { console.error("loadDepartments error:", err); }
}

/* -------- LOAD DOCTORS INTO MEMORY -------- */

async function loadDoctors() {
  try {
    const res = await fetch(API + '/doctors');
    allDoctors = await res.json();

    console.log("Doctors loaded:", allDoctors); // DEBUG

  } catch(err) { 
    console.error('loadDoctors:', err); 
  }
}

/* -------- FILTER DOCTORS BY DEPARTMENT -------- */

function filterDoctors(targetId) {
  if (allDoctors.length === 0) {
    console.log("Doctors not loaded yet");
    return;
  }

  const srcId  = targetId === 'doctorSelect' ? 'departmentSelect' : 'editDepartmentSelect';
  const deptId = document.getElementById(srcId).value;
  const dd     = document.getElementById(targetId);

  const deptName = document.getElementById(srcId).selectedOptions[0].text;

  const filtered = allDoctors.filter(d => 
    d.department_name === deptName
  );

  dd.disabled = false;
  dd.innerHTML = `<option value="" disabled selected>Select Doctor</option>`;

  if (filtered.length === 0) {
    dd.innerHTML += `<option disabled>No doctors found</option>`;
    return;
  }

  filtered.forEach(d => {
    dd.innerHTML += `<option value="${d.doctor_id}">
      ${d.doctor_name} — ${d.specialization}
    </option>`;
  });
}

/* -------- LOAD APPOINTMENTS -------- */

async function loadAppointments() {
  try {
    const res = await fetch(API + "/appointments");
    const data = await res.json();
    const table = document.getElementById("appointmentTable");
    table.innerHTML = "";

    if (data.length === 0) {
      table.innerHTML = `<tr><td colspan="7" class="text-center text-gray-400 py-6">No appointments yet.</td></tr>`;
      return;
    }

    data.forEach(a => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a.appointment_id}</td>
        <td>${a.patient_name}</td>
        <td>${a.department_name || "—"}</td>
        <td>${a.doctor_name}</td>
        <td>${formatDate(a.appointment_date)}</td>
        <td>${getStatusBadge(a.status)}</td>
        <td class="flex gap-2">
          <button onclick="openEditModal(${a.appointment_id}, ${a.patient_id}, ${a.department_id}, ${a.doctor_id}, '${toInputDate(a.appointment_date)}', '${a.status}')"
            class="btn btn-sm btn-outline btn-primary">Edit</button>
          <button onclick="deleteAppointment(${a.appointment_id})"
            class="btn btn-sm btn-outline btn-error">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });

  } catch (err) { console.error("loadAppointments error:", err); }
}

/* -------- CREATE APPOINTMENT -------- */

async function createAppointment() {
  const patient_id       = document.getElementById("patientSelect").value;
  const department_id    = document.getElementById("departmentSelect").value;
  const doctor_id        = document.getElementById("doctorSelect").value;
  const appointment_date = document.getElementById("appointmentDate").value;

  if (!patient_id)       { alert("Please select a patient.");    return; }
  if (!department_id)    { alert("Please select a department."); return; }
  if (!doctor_id)        { alert("Please select a doctor.");     return; }
  if (!appointment_date) { alert("Please select a date.");       return; }

  try {
    const res = await fetch(API + "/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id, doctor_id, appointment_date })
    });
    const data = await res.json();
    if (!res.ok) { alert("Error: " + (data.error || "Unknown error")); return; }

    document.getElementById("patientSelect").selectedIndex = 0;
    document.getElementById("departmentSelect").selectedIndex = 0;
    document.getElementById("doctorSelect").innerHTML = `<option value="" disabled selected>Select Department First</option>`;
    document.getElementById("appointmentDate").value = "";

    loadAppointments();
  } catch (err) {
    console.error("createAppointment error:", err);
    alert("Failed to create appointment.");
  }
}

/* -------- OPEN EDIT MODAL -------- */

function openEditModal(id, patient_id, department_id, doctor_id, date, status) {
  document.getElementById("editAppointmentId").value    = id;
  document.getElementById("editAppointmentDate").value  = date;
  document.getElementById("editStatus").value           = status;
  document.getElementById("editPatientSelect").value    = patient_id;
  document.getElementById("editDepartmentSelect").value = department_id;

  filterDoctors("editDoctorSelect");
  setTimeout(() => {
    document.getElementById("editDoctorSelect").value = doctor_id;
  }, 50);

  document.getElementById("editModal").showModal();
}

/* -------- SAVE EDIT -------- */

async function saveEdit() {
  const id               = document.getElementById("editAppointmentId").value;
  const patient_id       = document.getElementById("editPatientSelect").value;
  const doctor_id        = document.getElementById("editDoctorSelect").value;
  const appointment_date = document.getElementById("editAppointmentDate").value;
  const status           = document.getElementById("editStatus").value;

  if (!patient_id || !doctor_id || !appointment_date) { alert("Please fill in all fields."); return; }

  try {
    const res = await fetch(`${API}/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient_id, doctor_id, appointment_date, status })
    });
    const data = await res.json();
    if (!res.ok) { alert("Update failed: " + (data.error || "Unknown error")); return; }
    document.getElementById("editModal").close();
    loadAppointments();
  } catch (err) {
    console.error("saveEdit error:", err);
    alert("Failed to update appointment.");
  }
}

/* -------- DELETE APPOINTMENT -------- */

async function deleteAppointment(id) {
  if (!confirm(`Are you sure you want to delete appointment #${id}?`)) return;
  try {
    const res = await fetch(`${API}/appointments/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert("Delete failed: " + (data.error || "Unknown error")); return; }
    loadAppointments();
  } catch (err) {
    console.error("deleteAppointment error:", err);
    alert("Failed to delete appointment.");
  }
}

/* -------- INIT -------- */

loadPatients();
loadDepartments();
loadDoctors();
loadAppointments();
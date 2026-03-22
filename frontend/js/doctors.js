const API = "http://localhost:5000";

/* -------- HELPERS -------- */

function escapeQuotes(str) {
  return String(str || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function getStatusBadge(status) {
  const map = {
    active:     '<span class="badge badge-success">Active</span>',
    inactive:   '<span class="badge badge-error">Inactive</span>',
    "on leave": '<span class="badge badge-warning">On Leave</span>',
  };
  return map[status?.toLowerCase()] || `<span class="badge">${status || "—"}</span>`;
}

/* -------- LOAD DOCTORS -------- */

async function loadDoctors() {
  try {
    const res = await fetch(API + "/doctors");
    const doctors = await res.json();
    const table = document.getElementById("doctorTable");
    table.innerHTML = "";

    if (doctors.length === 0) {
      table.innerHTML = `<tr><td colspan="7" class="text-center text-gray-400 py-6">No doctors found. Add one above.</td></tr>`;
      return;
    }

    doctors.forEach(doc => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${doc.doctor_id}</td>
        <td>${doc.doctor_name}</td>
        <td>${doc.specialization}</td>
        <td>${doc.department_name || "—"}</td>
        <td>${doc.contact || "—"}</td>
        <td>${getStatusBadge(doc.status)}</td>
        <td class="flex gap-2">
          <button onclick="openEditModal(${doc.doctor_id}, '${escapeQuotes(doc.doctor_name)}', '${escapeQuotes(doc.specialization)}', ${doc.department_id}, '${escapeQuotes(doc.contact)}', '${doc.status}')"
            class="btn btn-sm btn-outline btn-primary">Edit</button>
          <button onclick="deleteDoctor(${doc.doctor_id}, '${escapeQuotes(doc.doctor_name)}')"
            class="btn btn-sm btn-outline btn-error">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });

  } catch (err) {
    console.error("loadDoctors error:", err);
    alert("Could not load doctors. Is the backend running on port 5000?");
  }
}

/* -------- LOAD DEPARTMENTS -------- */

async function loadDepartments() {
  try {
    const res = await fetch(API + "/departments");
    const departments = await res.json();

    ["departmentSelect", "editDepartmentSelect"].forEach(id => {
      const dropdown = document.getElementById(id);
      if (!dropdown) return;
      dropdown.innerHTML = `<option value="" disabled selected>Select Department</option>`;
      departments.forEach(dep => {
        dropdown.innerHTML += `<option value="${dep.department_id}">${dep.department_name}</option>`;
      });
    });

  } catch (err) {
    console.error("loadDepartments error:", err);
  }
}

/* -------- ADD DOCTOR -------- */

async function addDoctor() {
  const doctor_name    = document.getElementById("doctorName").value.trim();
  const specialization = document.getElementById("specialization").value.trim();
  const department_id  = document.getElementById("departmentSelect").value;
  const contact        = document.getElementById("contact").value.trim();
  const status         = document.getElementById("statusSelect").value;

  if (!doctor_name)    { alert("Please enter doctor name.");    return; }
  if (!specialization) { alert("Please enter specialization."); return; }
  if (!department_id || department_id === "Select Department") { alert("Please select a department."); return; }
  if (!contact)        { alert("Please enter contact number."); return; }

  try {
    const res = await fetch(API + "/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_name, specialization, department_id: parseInt(department_id), contact, status })
    });
    const data = await res.json();
    if (!res.ok) { alert("Error: " + (data.error || "Unknown error")); return; }

    document.getElementById("doctorName").value = "";
    document.getElementById("specialization").value = "";
    document.getElementById("contact").value = "";
    document.getElementById("departmentSelect").selectedIndex = 0;
    document.getElementById("statusSelect").selectedIndex = 0;

    loadDoctors();
  } catch (err) {
    console.error("addDoctor error:", err);
    alert("Failed to add doctor.");
  }
}

/* -------- OPEN EDIT MODAL -------- */

function openEditModal(id, name, specialization, department_id, contact, status) {
  document.getElementById("editDoctorId").value       = id;
  document.getElementById("editDoctorName").value     = name;
  document.getElementById("editSpecialization").value = specialization;
  document.getElementById("editContact").value        = contact;
  document.getElementById("editDepartmentSelect").value = department_id;
  document.getElementById("editStatusSelect").value   = status;
  document.getElementById("editModal").showModal();
}

/* -------- SAVE EDIT -------- */

async function saveEdit() {
  const id             = document.getElementById("editDoctorId").value;
  const doctor_name    = document.getElementById("editDoctorName").value.trim();
  const specialization = document.getElementById("editSpecialization").value.trim();
  const department_id  = document.getElementById("editDepartmentSelect").value;
  const contact        = document.getElementById("editContact").value.trim();
  const status         = document.getElementById("editStatusSelect").value;

  if (!doctor_name || !specialization) { alert("Name and specialization are required."); return; }

  try {
    const res = await fetch(`${API}/doctors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_name, specialization, department_id: parseInt(department_id), contact, status })
    });
    const data = await res.json();
    if (!res.ok) { alert("Update failed: " + (data.error || "Unknown error")); return; }
    document.getElementById("editModal").close();
    loadDoctors();
  } catch (err) {
    console.error("saveEdit error:", err);
    alert("Failed to update doctor.");
  }
}

/* -------- DELETE DOCTOR -------- */

async function deleteDoctor(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
  try {
    const res = await fetch(`${API}/doctors/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert("Delete failed: " + (data.error || "Unknown error")); return; }
    loadDoctors();
  } catch (err) {
    console.error("deleteDoctor error:", err);
    alert("Failed to delete doctor.");
  }
}

/* -------- INIT -------- */

loadDoctors();
loadDepartments();
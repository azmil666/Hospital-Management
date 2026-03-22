const API = "http://localhost:5000";

/* -------- HELPERS -------- */

function escapeQuotes(str) {
  return String(str || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/* -------- LOAD DEPARTMENTS -------- */

async function loadDepartments() {
  try {
    const res = await fetch(API + "/departments");
    const data = await res.json();
    const table = document.getElementById("departmentTable");
    table.innerHTML = "";

    if (data.length === 0) {
      table.innerHTML = `<tr><td colspan="4" class="text-center text-gray-400 py-6">No departments yet. Add one above.</td></tr>`;
      return;
    }

    data.forEach(dep => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dep.department_id}</td>
        <td>${dep.department_name}</td>
        <td>${dep.department_head || "—"}</td>
        <td class="flex gap-2">
          <button onclick="openEditModal(${dep.department_id}, '${escapeQuotes(dep.department_name)}', '${escapeQuotes(dep.department_head)}')"
            class="btn btn-sm btn-outline btn-primary">Edit</button>
          <button onclick="deleteDepartment(${dep.department_id}, '${escapeQuotes(dep.department_name)}')"
            class="btn btn-sm btn-outline btn-error">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });

  } catch (err) {
    console.error("loadDepartments error:", err);
    alert("Could not load departments. Is the backend running on port 5000?");
  }
}

/* -------- ADD DEPARTMENT -------- */

async function addDepartment() {
  const department_name = document.getElementById("departmentName").value.trim();
  const department_head = document.getElementById("departmentHead").value.trim();

  if (!department_name) { alert("Please enter a department name."); return; }

  try {
    const res = await fetch(API + "/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department_name, department_head })
    });
    const data = await res.json();
    if (!res.ok) { alert("Error: " + (data.error || "Unknown error")); return; }

    document.getElementById("departmentName").value = "";
    document.getElementById("departmentHead").value = "";
    loadDepartments();
  } catch (err) {
    console.error("addDepartment error:", err);
    alert("Failed to add department. Is the backend running?");
  }
}

/* -------- OPEN EDIT MODAL -------- */

function openEditModal(id, name, head) {
  document.getElementById("editDepartmentId").value   = id;
  document.getElementById("editDepartmentName").value = name;
  document.getElementById("editDepartmentHead").value = head;
  document.getElementById("editModal").showModal();
}

/* -------- SAVE EDIT -------- */

async function saveEdit() {
  const id              = document.getElementById("editDepartmentId").value;
  const department_name = document.getElementById("editDepartmentName").value.trim();
  const department_head = document.getElementById("editDepartmentHead").value.trim();

  if (!department_name) { alert("Department name is required."); return; }

  try {
    const res = await fetch(`${API}/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department_name, department_head })
    });
    const data = await res.json();
    if (!res.ok) { alert("Update failed: " + (data.error || "Unknown error")); return; }
    document.getElementById("editModal").close();
    loadDepartments();
  } catch (err) {
    console.error("saveEdit error:", err);
    alert("Failed to update department.");
  }
}

/* -------- DELETE DEPARTMENT -------- */

async function deleteDepartment(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?\n\nNote: This will fail if doctors are still assigned to it.`)) return;
  try {
    const res = await fetch(`${API}/departments/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert("Delete failed: " + (data.error || "Unknown error")); return; }
    loadDepartments();
  } catch (err) {
    console.error("deleteDepartment error:", err);
    alert("Failed to delete department.");
  }
}

/* -------- INIT -------- */

loadDepartments();
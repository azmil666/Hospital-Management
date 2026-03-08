const API = "http://localhost:5000";

async function loadDepartments() {

const res = await fetch(API + "/departments");
const data = await res.json();

const table = document.getElementById("departmentTable");
table.innerHTML = "";

data.forEach(dep => {

table.innerHTML += `
<tr>
<td>${dep.department_id}</td>
<td>${dep.department_name}</td>
</tr>
`;

});

}

async function addDepartment() {

const department_name =
document.getElementById("departmentName").value;

await fetch(API + "/departments", {

method: "POST",
headers: { "Content-Type": "application/json" },

body: JSON.stringify({ department_name })

});

loadDepartments();

}

loadDepartments();
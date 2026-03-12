const API = "http://localhost:5000";

async function loadDoctors() {

const res = await fetch(API + "/doctors");
const doctors = await res.json();

const table = document.getElementById("doctorTable");
table.innerHTML = "";

doctors.forEach(doc => {

table.innerHTML += `
<tr>
<td>${doc.doctor_id}</td>
<td>${doc.doctor_name}</td>
<td>${doc.specialization}</td>
<td>${doc.department_name}</td>
</tr>
`;

});

}


async function loadDepartments() {

const res = await fetch(API + "/departments");
const departments = await res.json();

const dropdown = document.getElementById("departmentSelect");

dropdown.innerHTML = `<option disabled selected>Select Department</option>`;

departments.forEach(dep => {

dropdown.innerHTML += `
<option value="${dep.department_id}">
${dep.department_name}
</option>
`;

});

}

async function addDoctor() {

const doctor_name = document.getElementById("doctorName").value;
const specialization = document.getElementById("specialization").value;
const department_id = document.getElementById("departmentSelect").value;

await fetch(API + "/doctors", {

method: "POST",
headers: { "Content-Type": "application/json" },

body: JSON.stringify({
doctor_name,
specialization,
department_id
})

});

loadDoctors();

}




loadDoctors();
loadDepartments();
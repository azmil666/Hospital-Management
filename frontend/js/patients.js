const API = "http://localhost:5000";

/* LOAD PATIENTS */

async function loadPatients() {

const res = await fetch(API + "/patients");
const patients = await res.json();

const table = document.getElementById("patientTable");
table.innerHTML = "";

patients.forEach(p => {

table.innerHTML += `
<tr>
<td>${p.patient_id}</td>
<td>${p.patient_name}</td>
<td>${p.age}</td>
<td>${p.gender}</td>
<td>${p.phone}</td>
</tr>
`;

});

}

/* ADD PATIENT */

async function addPatient() {

const patient_name = document.getElementById("patientName").value;
const age = document.getElementById("patientAge").value;
const gender = document.getElementById("patientGender").value;
const phone = document.getElementById("patientPhone").value;

await fetch(API + "/patients", {

method: "POST",
headers: { "Content-Type": "application/json" },

body: JSON.stringify({
patient_name,
age,
gender,
phone
})

});

loadPatients();

}

/* INITIAL LOAD */

loadPatients();
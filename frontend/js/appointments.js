const API = "http://localhost:5000";

/* LOAD PATIENTS */

async function loadPatients() {

const res = await fetch(API + "/patients");
const patients = await res.json();

const dropdown = document.getElementById("patientSelect");

dropdown.innerHTML = `<option disabled selected>Select Patient</option>`;

patients.forEach(p => {

dropdown.innerHTML += `
<option value="${p.patient_id}">
${p.patient_name}
</option>
`;

});

}

/* LOAD DOCTORS */

async function loadDoctors() {

const res = await fetch(API + "/doctors");
const doctors = await res.json();

const dropdown = document.getElementById("doctorSelect");

dropdown.innerHTML = `<option disabled selected>Select Doctor</option>`;

doctors.forEach(d => {

dropdown.innerHTML += `
<option value="${d.doctor_id}">
${d.doctor_name}
</option>
`;

});

}

/* LOAD APPOINTMENTS */

async function loadAppointments() {

const res = await fetch(API + "/appointments");
const data = await res.json();

const table = document.getElementById("appointmentTable");
table.innerHTML = "";

data.forEach(a => {

table.innerHTML += `
<tr>
<td>${a.appointment_id}</td>
<td>${a.patient_name}</td>
<td>${a.doctor_name}</td>
<td>${a.appointment_date}</td>
<td>${a.status}</td>
</tr>
`;

});

}

/* CREATE APPOINTMENT */

async function createAppointment() {

const patient_id = document.getElementById("patientSelect").value;
const doctor_id = document.getElementById("doctorSelect").value;
const appointment_date = document.getElementById("appointmentDate").value;

await fetch(API + "/appointments", {

method: "POST",
headers: { "Content-Type": "application/json" },

body: JSON.stringify({
patient_id,
doctor_id,
appointment_date
})

});

loadAppointments();

}

/* INITIAL LOAD */

loadPatients();
loadDoctors();
loadAppointments();
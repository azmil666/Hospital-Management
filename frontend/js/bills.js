const API = "http://localhost:5000";

/* LOAD APPOINTMENTS */

async function loadAppointments() {

const res = await fetch(API + "/appointments");
const appointments = await res.json();

const dropdown = document.getElementById("appointmentSelect");

dropdown.innerHTML = `<option disabled selected>Select Appointment</option>`;

appointments.forEach(a => {

dropdown.innerHTML += `
<option value="${a.appointment_id}">
${a.patient_name} - ${a.doctor_name} (${a.appointment_date})
</option>
`;

});

}

/* LOAD BILLS */

async function loadBills() {

const res = await fetch(API + "/bills");
const bills = await res.json();

const table = document.getElementById("billTable");
table.innerHTML = "";

bills.forEach(b => {

table.innerHTML += `
<tr>
<td>${b.bill_id}</td>
<td>${b.patient_name}</td>
<td>₹${b.amount}</td>
<td>${b.bill_date}</td>
</tr>
`;

});

}

/* CREATE BILL */

async function createBill() {

const appointment_id = document.getElementById("appointmentSelect").value;
const amount = document.getElementById("billAmount").value;
const bill_date = document.getElementById("billDate").value;

await fetch(API + "/bills", {

method: "POST",
headers: { "Content-Type": "application/json" },

body: JSON.stringify({
appointment_id,
amount,
bill_date
})

});

loadBills();

}

/* INITIAL LOAD */

loadAppointments();
loadBills();
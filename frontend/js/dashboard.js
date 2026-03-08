const API = "http://localhost:5000";

/* DASHBOARD COUNTS */

async function loadDashboard() {

const res = await fetch(API + "/dashboard");
const data = await res.json();

document.getElementById("doctorCount").innerText = data.doctors;
document.getElementById("patientCount").innerText = data.patients;
document.getElementById("appointmentCount").innerText = data.appointments;
document.getElementById("revenueCount").innerText = "₹" + data.revenue;

}

/* APPOINTMENT CHART */

async function loadAppointmentChart() {

const res = await fetch(API + "/analytics/appointments");
const data = await res.json();

const labels = data.map(d => d.appointment_date);
const values = data.map(d => d.total);

const ctx = document.getElementById("appointmentChart");

new Chart(ctx, {

type: "line",

data: {
labels: labels,
datasets: [{
label: "Appointments",
data: values,
borderWidth: 2
}]
}

});

}

/* REVENUE CHART */

async function loadRevenueChart() {

const res = await fetch(API + "/analytics/revenue");
const data = await res.json();

const labels = data.map(d => d.bill_date);
const values = data.map(d => d.total);

const ctx = document.getElementById("revenueChart");

new Chart(ctx, {

type: "bar",

data: {
labels: labels,
datasets: [{
label: "Revenue",
data: values,
borderWidth: 1
}]
}

});

}

/* LOAD EVERYTHING */

loadDashboard();
loadAppointmentChart();
loadRevenueChart();
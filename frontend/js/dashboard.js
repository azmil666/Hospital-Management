const API = "http://localhost:5000";

function formatDate(dateStr) {

const date = new Date(dateStr);

return date.toLocaleDateString("en-IN", {
month: "short",
day: "numeric"
});

}

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

const labels = data.map(d => formatDate(d.appointment_date));
const values = data.map(d => d.total);

const ctx = document.getElementById("appointmentChart");

new Chart(ctx, {

type: "line",

data: {
labels: labels,

datasets: [{
label: "Appointments",

data: values,

borderColor: "#10b921",
backgroundColor: "rgba(99, 241, 158, 0.1)",

tension: 0.4,
fill: true,
pointRadius: 4,
pointBackgroundColor: "#7df163"
}]
},

options: {

responsive: true,

plugins: {
legend: {
display: true,
position: "top"
}
},

scales: {

y: {
beginAtZero: true,
grid: {
color: "rgba(0,0,0,0.05)"
}
},

x: {
grid: {
display: false
}
}

}

}

});

}

/* REVENUE CHART */

async function loadRevenueChart() {

const res = await fetch(API + "/analytics/revenue");
const data = await res.json();

const labels = data.map(d => formatDate(d.bill_date));
const values = data.map(d => d.total);

const ctx = document.getElementById("revenueChart");

new Chart(ctx, {

type: "bar",

data: {

labels: labels,

datasets: [{
label: "Revenue",

data: values,

backgroundColor: "#10b921",
borderRadius: 6,
barThickness: 40
}]

},

options: {

responsive: true,

plugins: {
legend: {
display: true,
position: "top"
}
},

scales: {

y: {
beginAtZero: true,
grid: {
color: "rgba(0,0,0,0.05)"
}
},

x: {
grid: {
display: false
}
}

}

}

});

}
/* LOAD EVERYTHING */

loadDashboard();
loadAppointmentChart();
loadRevenueChart();
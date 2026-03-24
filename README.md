# 🏥 MedCore – Hospital Management System

MedCore is a full-stack Hospital Management System designed to manage doctors, patients, appointments, and billing through a clean and modern admin dashboard.

---

## 🚀 Features

### 👨‍⚕️ Doctors

* Add, edit, delete doctors
* Assign department & specialization
* Track active/inactive status

### 🧑 Patients

* Register new patients
* Store age, gender, contact
* View all patient records

### 📅 Appointments

* Create appointments dynamically
* Department → Doctor filtering
* Track appointment status

### 💰 Billing

* Generate bills from appointments
* Store amount and date
* View billing history

### 📊 Dashboard

* Total doctors, patients, appointments, revenue
* Charts (appointments & revenue)
* Recent activity tracking

---

## 🛠️ Tech Stack

**Frontend**

* HTML
* CSS
* JavaScript (Vanilla JS)

**Backend**

* Node.js
* Express.js

**Database**

* MySQL

---

## 📁 Project Structure

```bash

HOSPITAL-MANAGEMENT/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── node_modules/
│
├── database/
│   └── db.sql
│
├── frontend/
│   ├── index.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── doctors.html
│   │   ├── patients.html
│   │   ├── appointments.html
│   │   ├── bills.html
│   │   └── departments.html
│   │
│   └── js/
│       ├── dashboard.js
│       ├── doctors.js
│       ├── patients.js
│       ├── appointments.js
│       ├── bills.js
│       └── departments.js
│
└── .gitignore


```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/azmil666/hospital-management.git
cd hospital-management
```

---

### 2. Setup MySQL Database

Open MySQL and run:

```sql
SOURCE database/db.sql;
```

This will:

* Create `hospital_db`
* Create all tables
* Insert sample data

---

### 3. Start Backend Server

```bash
cd backend
npm install
node server.js
```

Server runs on:

```
http://localhost:5000
```

---

### 4. Run Frontend

Open in browser or Live Server:

```bash
frontend/index.html
```

---

## 🔗 API Endpoints

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | /dashboard    | Dashboard stats    |
| GET    | /doctors      | Get doctors        |
| GET    | /patients     | Get patients       |
| GET    | /appointments | Get appointments   |
| GET    | /bills        | Get bills          |
| POST   | /appointments | Create appointment |
| POST   | /bills        | Generate bill      |

---

## 🧠 Key Concepts Used

* REST API integration
* Relational database (foreign keys)
* Dynamic dropdown filtering
* Async JavaScript (fetch API)
* DOM manipulation
* Modular file structure

---


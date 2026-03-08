DROP DATABASE IF EXISTS hospital_db;
CREATE DATABASE hospital_db;
USE hospital_db;

-- 1. Department Table
CREATE TABLE department (
department_id INT AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(50) NOT NULL
);

-- 2. Doctor Table
CREATE TABLE doctor (
doctor_id INT AUTO_INCREMENT PRIMARY KEY,
doctor_name VARCHAR(50) NOT NULL,
specialization VARCHAR(50),
department_id INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- 3. Patient Table
CREATE TABLE patient (
patient_id INT AUTO_INCREMENT PRIMARY KEY,
patient_name VARCHAR(50) NOT NULL,
age INT,
gender VARCHAR(10),
phone VARCHAR(15) UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointment Table
CREATE TABLE appointment (
appointment_id INT AUTO_INCREMENT PRIMARY KEY,
patient_id INT,
doctor_id INT,
appointment_date DATE,
status VARCHAR(20) DEFAULT 'pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);

-- 5. Bill Table
CREATE TABLE bill (
bill_id INT AUTO_INCREMENT PRIMARY KEY,
appointment_id INT,
patient_id INT,
amount DECIMAL(10,2),
bill_date DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id),
FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

-- Sample Departments
INSERT INTO department (department_name) VALUES
('Cardiology'),
('Neurology'),
('Orthopedics');

-- Sample Doctors
INSERT INTO doctor (doctor_name, specialization, department_id) VALUES
('Dr. Smith', 'Cardiologist', 1),
('Dr. Brown', 'Neurologist', 2);

-- Sample Patients
INSERT INTO patient (patient_name, age, gender, phone) VALUES
('John Doe', 30, 'Male', '9876543210'),
('Alice Johnson', 25, 'Female', '9876500000');

-- Sample Appointments
INSERT INTO appointment (patient_id, doctor_id, appointment_date, status) VALUES
(1, 1, '2026-03-10', 'approved'),
(2, 2, '2026-03-11', 'pending');

-- Sample Bills
INSERT INTO bill (appointment_id, patient_id, amount, bill_date) VALUES
(1, 1, 1500.00, '2026-03-10'),
(2, 2, 2000.00, '2026-03-11');

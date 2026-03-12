DROP DATABASE IF EXISTS hospital_db;
CREATE DATABASE hospital_db;
USE hospital_db;

-- 1. Department Table
CREATE TABLE department (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL,
  department_head VARCHAR(50)
);

-- 2. Doctor Table
CREATE TABLE doctor (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_name VARCHAR(50) NOT NULL,
  specialization VARCHAR(50),
  department_id INT,
  contact VARCHAR(15),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES department(department_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
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
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 5. Bill Table
CREATE TABLE bill (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT,
  patient_id INT,
  amount DECIMAL(10,2),
  bill_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SELECT * FROM department;
SELECT * FROM doctor;
SELECT * FROM patient;
SELECT * FROM appointment;
SELECT * FROM bill;
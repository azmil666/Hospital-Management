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


INSERT INTO department (department_name, department_head) VALUES
('Cardiology', 'Dr. Thomas'),
('Neurology', 'Dr. Adams'),
('Orthopedics', 'Dr. Wilson'),
('Pediatrics', 'Dr. Clara'),
('Dermatology', 'Dr. Meera');

INSERT INTO doctor (doctor_name, specialization, department_id, contact, status) VALUES
('Dr. John Smith', 'Cardiologist', 1, '9876543210', 'active'),
('Dr. Emily Brown', 'Neurologist', 2, '9876543211', 'active'),
('Dr. Raj Patel', 'Orthopedic', 3, '9876543212', 'active'),
('Dr. Sarah Lee', 'Pediatrician', 4, '9876543213', 'active'),
('Dr. Ahmed Khan', 'Dermatologist', 5, '9876543214', 'active'),
('Dr. David Miller', 'Cardiologist', 1, '9876543215', 'inactive'),
('Dr. Priya Nair', 'Neurologist', 2, '9876543216', 'active');

INSERT INTO patient (patient_name, age, gender, phone) VALUES
('Arjun Menon', 28, 'Male', '9000000001'),
('Neha Sharma', 24, 'Female', '9000000002'),
('Rahul Das', 35, 'Male', '9000000003'),
('Sneha Iyer', 30, 'Female', '9000000004'),
('Kiran Kumar', 45, 'Male', '9000000005'),
('Anjali Nair', 22, 'Female', '9000000006'),
('Vikram Singh', 50, 'Male', '9000000007'),
('Pooja Verma', 27, 'Female', '9000000008');

INSERT INTO appointment (patient_id, doctor_id, appointment_date, status) VALUES
(1, 1, '2026-03-20', 'approved'),
(2, 2, '2026-03-21', 'pending'),
(3, 3, '2026-03-21', 'approved'),
(4, 4, '2026-03-22', 'pending'),
(5, 5, '2026-03-22', 'approved'),
(6, 6, '2026-03-23', 'pending'),
(7, 7, '2026-03-23', 'approved'),
(8, 1, '2026-03-24', 'pending');

INSERT INTO bill (appointment_id, patient_id, amount, bill_date) VALUES
(1, 1, 1500.00, '2026-03-20'),
(2, 2, 2000.00, '2026-03-21'),
(3, 3, 1800.00, '2026-03-21'),
(4, 4, 1200.00, '2026-03-22'),
(5, 5, 2200.00, '2026-03-22'),
(6, 6, 1600.00, '2026-03-23'),
(7, 7, 2500.00, '2026-03-23');


SELECT * FROM department;
SELECT * FROM doctor;
SELECT * FROM patient;
SELECT * FROM appointment;
SELECT * FROM bill;
CREATE DATABASE IF NOT EXISTS campus_maintenance;
USE campus_maintenance;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    phone_number VARCHAR(30) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student', 'technician') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    skills VARCHAR(120) DEFAULT NULL,
    must_change_password TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email VARCHAR(100) DEFAULT NULL AFTER name,
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30) DEFAULT NULL AFTER email,
    ADD COLUMN IF NOT EXISTS skills VARCHAR(120) DEFAULT NULL AFTER status,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT DEFAULT NULL,
    technician_id INT DEFAULT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    dorm VARCHAR(120) DEFAULT NULL,
    block VARCHAR(120) DEFAULT NULL,
    location VARCHAR(255) NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Emergency') DEFAULT 'Medium',
    status ENUM('Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed') DEFAULT 'Pending',
    progress_percentage INT DEFAULT 0,
    admin_seen TINYINT(1) DEFAULT 0,
    tech_seen TINYINT(1) DEFAULT 1,
    student_seen TINYINT(1) DEFAULT 1,
    student_hidden TINYINT(1) DEFAULT 0,
    student_name_snapshot VARCHAR(100) DEFAULT NULL,
    student_code_snapshot VARCHAR(50) DEFAULT NULL,
    student_phone_snapshot VARCHAR(30) DEFAULT NULL,
    student_email_snapshot VARCHAR(100) DEFAULT NULL,
    technician_name_snapshot VARCHAR(100) DEFAULT NULL,
    technician_code_snapshot VARCHAR(50) DEFAULT NULL,
    technician_phone_snapshot VARCHAR(30) DEFAULT NULL,
    technician_email_snapshot VARCHAR(100) DEFAULT NULL,
    technician_skills_snapshot VARCHAR(120) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_requests_technician FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

ALTER TABLE requests
    MODIFY COLUMN student_id INT DEFAULT NULL,
    MODIFY COLUMN status ENUM('Pending', 'Assigned', 'In Progress', 'On Hold', 'Completed') DEFAULT 'Pending',
    ADD COLUMN IF NOT EXISTS dorm VARCHAR(120) DEFAULT NULL AFTER category,
    ADD COLUMN IF NOT EXISTS block VARCHAR(120) DEFAULT NULL AFTER dorm,
    ADD COLUMN IF NOT EXISTS admin_seen TINYINT(1) DEFAULT 0 AFTER progress_percentage,
    ADD COLUMN IF NOT EXISTS tech_seen TINYINT(1) DEFAULT 1 AFTER admin_seen,
    ADD COLUMN IF NOT EXISTS student_seen TINYINT(1) DEFAULT 1 AFTER tech_seen,
    ADD COLUMN IF NOT EXISTS student_hidden TINYINT(1) DEFAULT 0 AFTER student_seen,
    ADD COLUMN IF NOT EXISTS student_name_snapshot VARCHAR(100) DEFAULT NULL AFTER student_hidden,
    ADD COLUMN IF NOT EXISTS student_code_snapshot VARCHAR(50) DEFAULT NULL AFTER student_name_snapshot,
    ADD COLUMN IF NOT EXISTS student_phone_snapshot VARCHAR(30) DEFAULT NULL AFTER student_code_snapshot,
    ADD COLUMN IF NOT EXISTS student_email_snapshot VARCHAR(100) DEFAULT NULL AFTER student_phone_snapshot,
    ADD COLUMN IF NOT EXISTS technician_name_snapshot VARCHAR(100) DEFAULT NULL AFTER student_email_snapshot,
    ADD COLUMN IF NOT EXISTS technician_code_snapshot VARCHAR(50) DEFAULT NULL AFTER technician_name_snapshot,
    ADD COLUMN IF NOT EXISTS technician_phone_snapshot VARCHAR(30) DEFAULT NULL AFTER technician_code_snapshot,
    ADD COLUMN IF NOT EXISTS technician_email_snapshot VARCHAR(100) DEFAULT NULL AFTER technician_phone_snapshot,
    ADD COLUMN IF NOT EXISTS technician_skills_snapshot VARCHAR(120) DEFAULT NULL AFTER technician_email_snapshot;

CREATE TABLE IF NOT EXISTS maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    actor_name VARCHAR(100) DEFAULT NULL,
    actor_role VARCHAR(30) DEFAULT NULL,
    actor_code VARCHAR(50) DEFAULT NULL,
    action_taken VARCHAR(255),
    remarks TEXT,
    progress_percentage INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS request_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    uploaded_by_user_id INT DEFAULT NULL,
    uploader_name_snapshot VARCHAR(100) DEFAULT NULL,
    uploader_role_snapshot VARCHAR(30) DEFAULT NULL,
    uploader_code_snapshot VARCHAR(50) DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_extension VARCHAR(30) DEFAULT NULL,
    mime_type VARCHAR(120) DEFAULT NULL,
    file_category VARCHAR(60) DEFAULT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    file_description TEXT DEFAULT NULL,
    file_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_attachments_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_attachments_user FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    owner_name_snapshot VARCHAR(100) DEFAULT NULL,
    owner_role_snapshot VARCHAR(30) DEFAULT NULL,
    owner_code_snapshot VARCHAR(50) DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_extension VARCHAR(30) DEFAULT NULL,
    mime_type VARCHAR(120) DEFAULT NULL,
    file_category VARCHAR(60) DEFAULT NULL,
    file_size_bytes BIGINT DEFAULT NULL,
    file_description TEXT DEFAULT NULL,
    file_data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO users (
    user_code,
    name,
    email,
    phone_number,
    password,
    role,
    status,
    must_change_password
) VALUES (
    'ADMIN001',
    'System Admin',
    'admin@dbu.edu.et',
    '0911000000',
    '$2y$10$9BBWLlSETZ1ZduNlkXjy7e6qjFJpJautu1WtrKbtaOpC4jmaF.X2e',
    'admin',
    'active',
    0
);

-- Default admin login:
-- user_code: ADMIN001
-- password: admin123
